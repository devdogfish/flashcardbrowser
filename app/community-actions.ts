"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SuggestionType } from "@/lib/generated/prisma/client";
import { checkSuggestion } from "@/lib/ai-moderation";
import { applySuggestion } from "@/lib/merge-suggestion";

const MERGE_DELAY_MS = 24 * 60 * 60 * 1000; // 24 hours
const FLAG_THRESHOLD = 3;

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

async function requireAdmin() {
  const session = await requireSession();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

// ── Suggestions ─────────────────────────────────────────────────────────────

export async function suggestCardChange(opts: {
  deckId: string;
  type: SuggestionType;
  targetCardId?: string;
  question?: string;
  answer?: string;
}) {
  const { user } = await requireSession();

  const deck = await prisma.deck.findUnique({
    where: { id: opts.deckId },
    select: {
      visibility: true,
      collections: {
        where: { collection: { courseCode: { not: null } } },
        select: { collectionId: true },
      },
    },
  });
  if (!deck) throw new Error("Deck not found");
  if (deck.visibility !== "PUBLIC") throw new Error("Deck is not public");
  if (deck.collections.length === 0) throw new Error("Suggestions only allowed on course decks");

  const moderation = await checkSuggestion(opts.question, opts.answer);
  if (!moderation.approved) {
    throw new Error(moderation.reason ?? "Suggestion rejected by moderation");
  }

  await prisma.cardSuggestion.create({
    data: {
      deckId: opts.deckId,
      suggestorId: user.id,
      type: opts.type,
      targetCardId: opts.targetCardId ?? null,
      question: opts.question ?? null,
      answer: opts.answer ?? null,
      aiApproved: true,
      mergeAt: new Date(Date.now() + MERGE_DELAY_MS),
    },
  });
}

// ── Suggestion flags (block auto-merge during cooldown) ──────────────────────

export async function flagSuggestion(suggestionId: string) {
  const { user } = await requireSession();

  const suggestion = await prisma.cardSuggestion.findUnique({
    where: { id: suggestionId },
    select: { status: true },
  });
  if (!suggestion || suggestion.status !== "PENDING") {
    throw new Error("Suggestion not found or no longer pending");
  }

  await prisma.suggestionFlag.upsert({
    where: { suggestionId_userId: { suggestionId, userId: user.id } },
    create: { suggestionId, userId: user.id },
    update: {},
  });
}

// ── Card flags (flag a live card as wrong) ───────────────────────────────────

export async function flagCard(cardId: string, reason?: string) {
  const { user } = await requireSession();

  await prisma.cardFlag.upsert({
    where: { cardId_userId: { cardId, userId: user.id } },
    create: { cardId, userId: user.id, reason: reason ?? null },
    update: { reason: reason ?? null },
  });

  const count = await prisma.cardFlag.count({ where: { cardId } });

  if (count >= FLAG_THRESHOLD) {
    await prisma.flashcard.update({
      where: { id: cardId },
      data: { hidden: true },
    });
    return { autoHidden: true, flagCount: count };
  }

  return { autoHidden: false, flagCount: count };
}

// Removing your flag does NOT un-hide a card. Un-hiding is admin-only via restoreCard.
export async function unflagCard(cardId: string) {
  const { user } = await requireSession();
  await prisma.cardFlag.deleteMany({ where: { cardId, userId: user.id } });
}

// ── Admin: review flagged cards ──────────────────────────────────────────────

export async function getFlaggedCards() {
  await requireAdmin();

  return prisma.flashcard.findMany({
    where: { hidden: true },
    include: {
      deck: { select: { id: true, title: true, courseCode: true } },
      flags: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function restoreCard(cardId: string) {
  await requireAdmin();

  await prisma.$transaction([
    prisma.cardFlag.deleteMany({ where: { cardId } }),
    prisma.flashcard.update({ where: { id: cardId }, data: { hidden: false } }),
  ]);
}

export async function deleteCard(cardId: string) {
  await requireAdmin();
  await prisma.flashcard.delete({ where: { id: cardId } });
}

// ── Admin: review flagged suggestions ────────────────────────────────────────

export async function getFlaggedSuggestions() {
  await requireAdmin();

  return prisma.cardSuggestion.findMany({
    where: { status: "PENDING", flags: { some: {} } },
    include: {
      deck: { select: { id: true, title: true, courseCode: true } },
      suggestor: { select: { id: true, name: true, email: true } },
      flags: { include: { user: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function approveSuggestion(suggestionId: string) {
  await requireAdmin();

  const suggestion = await prisma.cardSuggestion.findUnique({
    where: { id: suggestionId },
  });
  if (!suggestion || suggestion.status !== "PENDING") {
    throw new Error("Suggestion not found or already resolved");
  }

  await prisma.$transaction((tx) => applySuggestion(tx, suggestion));
}

export async function rejectSuggestion(suggestionId: string) {
  await requireAdmin();
  await prisma.cardSuggestion.update({
    where: { id: suggestionId },
    data: { status: "REJECTED" },
  });
}
