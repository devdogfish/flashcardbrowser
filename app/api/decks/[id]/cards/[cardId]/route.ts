import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { authenticate } from "@/lib/api-auth"

// ── Shared: verify deck ownership ────────────────────────────────────────────

async function requireDeckOwner(deckId: string, userId: string) {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: { ownerId: true },
  })
  if (!deck) return { error: NextResponse.json({ error: "Deck not found" }, { status: 404 }) }
  if (deck.ownerId !== userId) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  return { ok: true }
}

// ── PATCH /api/decks/[id]/cards/[cardId] ─────────────────────────────────────
// Update a card's question, answer, or image. Caller must own the deck.
//
// Body (all optional): { question?, answer?, imageUrl? }

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id, cardId } = await params

  const ownership = await requireDeckOwner(id, auth.userId)
  if ("error" in ownership) return ownership.error

  const card = await prisma.flashcard.findUnique({
    where: { id: cardId },
    select: { deckId: true },
  })
  if (!card || card.deckId !== id) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 })
  }

  let body: { question?: unknown; answer?: unknown; imageUrl?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const data: Record<string, unknown> = {}

  if (body.question !== undefined) {
    if (typeof body.question !== "string" || !body.question.trim()) {
      return NextResponse.json({ error: "question must be a non-empty string" }, { status: 422 })
    }
    data.question = body.question.trim()
  }

  if (body.answer !== undefined) {
    if (typeof body.answer !== "string" || !body.answer.trim()) {
      return NextResponse.json({ error: "answer must be a non-empty string" }, { status: 422 })
    }
    data.answer = body.answer.trim()
  }

  if (body.imageUrl !== undefined) {
    data.imageUrl = body.imageUrl === null ? null : String(body.imageUrl)
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 422 })
  }

  const updated = await prisma.flashcard.update({
    where: { id: cardId },
    data,
    select: { id: true, question: true, answer: true, imageUrl: true, position: true, updatedAt: true },
  })

  return NextResponse.json(updated)
}

// ── DELETE /api/decks/[id]/cards/[cardId] ────────────────────────────────────
// Permanently delete a card. Caller must own the deck.

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id, cardId } = await params

  const ownership = await requireDeckOwner(id, auth.userId)
  if ("error" in ownership) return ownership.error

  const card = await prisma.flashcard.findUnique({
    where: { id: cardId },
    select: { deckId: true },
  })
  if (!card || card.deckId !== id) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 })
  }

  await prisma.flashcard.delete({ where: { id: cardId } })

  return new NextResponse(null, { status: 204 })
}
