import { type PrismaClient } from "@/lib/generated/prisma/client";

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export interface SuggestionRecord {
  id: string;
  deckId: string;
  type: "ADD" | "EDIT" | "DELETE";
  targetCardId: string | null;
  question: string | null;
  answer: string | null;
}

/**
 * Applies a single card suggestion inside an existing transaction, then
 * marks it as MERGED. Called by both the cron auto-merge and admin approval.
 */
export async function applySuggestion(tx: Tx, suggestion: SuggestionRecord) {
  if (suggestion.type === "ADD") {
    const maxPos = await tx.flashcard.aggregate({
      where: { deckId: suggestion.deckId },
      _max: { position: true },
    });
    await tx.flashcard.create({
      data: {
        deckId: suggestion.deckId,
        question: suggestion.question ?? "",
        answer: suggestion.answer ?? "",
        position: (maxPos._max.position ?? -1) + 1,
      },
    });
  } else if (suggestion.type === "EDIT" && suggestion.targetCardId) {
    await tx.flashcard.update({
      where: { id: suggestion.targetCardId },
      data: {
        question: suggestion.question ?? undefined,
        answer: suggestion.answer ?? undefined,
      },
    });
  } else if (suggestion.type === "DELETE" && suggestion.targetCardId) {
    await tx.flashcard.delete({ where: { id: suggestion.targetCardId } });
  }

  await tx.cardSuggestion.update({
    where: { id: suggestion.id },
    data: { status: "MERGED" },
  });
}
