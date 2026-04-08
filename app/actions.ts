"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { put } from "@vercel/blob"

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
  return session
}

async function assertOwner(deckId: string, userId: string) {
  const deck = await prisma.deck.findUnique({ where: { id: deckId }, select: { ownerId: true } })
  if (!deck || deck.ownerId !== userId) throw new Error("Not found or not authorized")
  return deck
}

// ── Favorites ───────────────────────────────────────────────────────────────

export async function toggleFavorite(deckId: string): Promise<boolean> {
  const { user } = await requireSession()
  const key = { userId: user.id, deckId }
  const existing = await prisma.deckFavorite.findUnique({ where: { userId_deckId: key } })
  if (existing) {
    await prisma.deckFavorite.delete({ where: { userId_deckId: key } })
    return false
  }
  await prisma.deckFavorite.create({ data: key })
  return true
}

// ── Flashcard usage ─────────────────────────────────────────────────────────

export async function recordUsage(cardId: string, correct: boolean): Promise<void> {
  const { user } = await requireSession()
  await prisma.flashcardUsage.create({
    data: {
      userId: user.id,
      cardId,
      result: correct ? "CORRECT" : "INCORRECT",
    },
  })
}

// ── Decks ───────────────────────────────────────────────────────────────────

export async function createDeck(
  title: string,
  description: string,
  visibility: "PRIVATE" | "PUBLIC",
  coverImage?: string | null,
): Promise<void> {
  const { user } = await requireSession()
  if (!title.trim()) throw new Error("Title is required")
  const deck = await prisma.deck.create({
    data: {
      ownerId: user.id,
      title: title.trim(),
      description: description.trim() || null,
      visibility,
      coverImage: coverImage || null,
    },
  })
  revalidatePath("/decks")
  redirect(`/decks/${deck.id}/edit`)
}

export async function updateDeck(
  deckId: string,
  title: string,
  description: string,
  visibility: "PRIVATE" | "PUBLIC",
  coverImage: string | null,
): Promise<void> {
  const { user } = await requireSession()
  await assertOwner(deckId, user.id)
  await prisma.deck.update({
    where: { id: deckId },
    data: {
      title: title.trim(),
      description: description.trim() || null,
      visibility,
      coverImage: coverImage || null,
    },
  })
  revalidatePath("/decks")
  revalidatePath(`/decks/${deckId}`)
  revalidatePath(`/decks/${deckId}/edit`)
}

export async function deleteDeck(deckId: string): Promise<void> {
  const { user } = await requireSession()
  await assertOwner(deckId, user.id)
  await prisma.deck.delete({ where: { id: deckId } })
  revalidatePath("/decks")
  redirect("/decks")
}

// ── Cards ───────────────────────────────────────────────────────────────────

export async function createCard(
  deckId: string,
  question: string,
  answer: string,
  imageUrl?: string | null,
): Promise<void> {
  const { user } = await requireSession()
  await assertOwner(deckId, user.id)
  const last = await prisma.flashcard.findFirst({ where: { deckId }, orderBy: { position: "desc" } })
  await prisma.flashcard.create({
    data: {
      deckId,
      question: question.trim(),
      answer: answer.trim(),
      imageUrl: imageUrl || null,
      position: (last?.position ?? -1) + 1,
    },
  })
  revalidatePath(`/decks/${deckId}/edit`)
}

export async function updateCard(
  cardId: string,
  question: string,
  answer: string,
  imageUrl: string | null,
): Promise<void> {
  const { user } = await requireSession()
  const card = await prisma.flashcard.findUnique({
    where: { id: cardId },
    include: { deck: { select: { ownerId: true, id: true } } },
  })
  if (!card || card.deck.ownerId !== user.id) throw new Error("Not found")
  await prisma.flashcard.update({
    where: { id: cardId },
    data: { question: question.trim(), answer: answer.trim(), imageUrl: imageUrl || null },
  })
  revalidatePath(`/decks/${card.deck.id}/edit`)
}

export async function deleteCard(cardId: string): Promise<void> {
  const { user } = await requireSession()
  const card = await prisma.flashcard.findUnique({
    where: { id: cardId },
    include: { deck: { select: { ownerId: true, id: true } } },
  })
  if (!card || card.deck.ownerId !== user.id) throw new Error("Not found")
  await prisma.flashcard.delete({ where: { id: cardId } })
  revalidatePath(`/decks/${card.deck.id}/edit`)
}

export async function forkDeck(deckId: string): Promise<void> {
  const { user } = await requireSession()
  const original = await prisma.deck.findUnique({
    where: { id: deckId, visibility: "PUBLIC" },
    include: { cards: { orderBy: { position: "asc" } } },
  })
  if (!original) throw new Error("Deck not found or not public")
  const newDeck = await prisma.deck.create({
    data: {
      ownerId: user.id,
      title: original.title,
      description: original.description,
      visibility: "PRIVATE",
      coverImage: original.coverImage,
      cards: {
        create: original.cards.map((c) => ({
          question: c.question,
          answer: c.answer,
          imageUrl: c.imageUrl,
          position: c.position,
        })),
      },
    },
  })
  revalidatePath("/decks")
  redirect(`/decks/${newDeck.id}/edit`)
}

// ── API keys ─────────────────────────────────────────────────────────────────

import { randomBytes } from "crypto"

export async function createApiKey(name: string): Promise<{ key: string }> {
  const { user } = await requireSession()
  if (!name.trim()) throw new Error("Name is required")
  const existing = await prisma.apiKey.count({ where: { userId: user.id } })
  if (existing >= 10) throw new Error("Maximum of 10 API keys allowed")
  const key = `flipt_${randomBytes(24).toString("hex")}`
  await prisma.apiKey.create({
    data: { userId: user.id, name: name.trim(), key },
  })
  revalidatePath("/settings")
  return { key }
}

export async function deleteApiKey(keyId: string): Promise<void> {
  const { user } = await requireSession()
  const apiKey = await prisma.apiKey.findUnique({ where: { id: keyId } })
  if (!apiKey || apiKey.userId !== user.id) throw new Error("Not found")
  await prisma.apiKey.delete({ where: { id: keyId } })
  revalidatePath("/settings")
}

// ── Settings ─────────────────────────────────────────────────────────────────

export async function updateTheme(theme: "SYSTEM" | "LIGHT" | "DARK"): Promise<void> {
  const { user } = await requireSession()
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    create: { userId: user.id, theme },
    update: { theme },
  })
}

export async function updateDisplayName(name: string): Promise<void> {
  const { user } = await requireSession()
  if (!name.trim()) throw new Error("Name is required")
  await prisma.user.update({
    where: { id: user.id },
    data: { name: name.trim() },
  })
  revalidatePath("/settings")
}

// ── Deck import ──────────────────────────────────────────────────────────────

export type ImportCardData = {
  question: string
  answer: string
  imageUrl: string | null
}

export type ImportDeckData = {
  title: string
  description: string | null
  coverImage: string | null
  cards: ImportCardData[]
}

async function mirrorImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    const contentType = res.headers.get("content-type") || "image/jpeg"
    const ext = contentType.split("/")[1]?.split("+")[0] || "jpg"
    const filename = `deck-import-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const blob = new Blob([arrayBuffer], { type: contentType })
    const result = await put(`imports/${filename}`, blob, { access: "public" })
    return result.url
  } catch {
    return null
  }
}

export async function importDeck(data: ImportDeckData): Promise<{ deckId: string }> {
  const { user } = await requireSession()

  const coverImageUrl = data.coverImage ? await mirrorImage(data.coverImage) : null

  const deck = await prisma.deck.create({
    data: {
      ownerId: user.id,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      visibility: "PRIVATE",
      coverImage: coverImageUrl,
    },
  })

  // Mirror all card images in parallel
  const mirroredImages = await Promise.all(
    data.cards.map((c) => (c.imageUrl ? mirrorImage(c.imageUrl) : Promise.resolve(null)))
  )

  await prisma.flashcard.createMany({
    data: data.cards.map((card, i) => ({
      deckId: deck.id,
      question: card.question,
      answer: card.answer,
      imageUrl: mirroredImages[i],
      position: i,
    })),
  })

  revalidatePath("/decks")
  return { deckId: deck.id }
}
