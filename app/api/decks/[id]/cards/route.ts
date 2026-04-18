import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { authenticate, optionalAuthenticate } from "@/lib/api-auth"

// ── GET /api/decks/[id]/cards ────────────────────────────────────────────────
// List all visible cards in a deck.
//
// Public decks: accessible without authentication.
// Private decks: require the deck owner's API key.

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const userId = await optionalAuthenticate(request)

  const deck = await prisma.deck.findUnique({
    where: { id },
    select: { ownerId: true, visibility: true },
  })

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 })
  }
  if (deck.visibility === "PRIVATE" && (!userId || userId !== deck.ownerId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const cards = await prisma.flashcard.findMany({
    where: { deckId: id, hidden: false },
    orderBy: { position: "asc" },
    select: { id: true, question: true, answer: true, imageUrl: true, position: true, createdAt: true, updatedAt: true },
  })

  return NextResponse.json({ cards })
}

// ── POST /api/decks/[id]/cards ───────────────────────────────────────────────
// Add a single card to a deck. Caller must be the deck owner.
//
// Body: { question: string, answer: string, imageUrl?: string, position?: number }

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id } = await params

  const deck = await prisma.deck.findUnique({
    where: { id },
    select: { ownerId: true },
  })

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 })
  }
  if (deck.ownerId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: { question?: unknown; answer?: unknown; imageUrl?: unknown; position?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body.question !== "string" || !body.question.trim()) {
    return NextResponse.json({ error: "Missing required field: question" }, { status: 422 })
  }
  if (typeof body.answer !== "string" || !body.answer.trim()) {
    return NextResponse.json({ error: "Missing required field: answer" }, { status: 422 })
  }

  // Default position: one after the current last card
  let position: number
  if (body.position !== undefined && typeof body.position === "number") {
    position = Math.max(0, Math.floor(body.position))
  } else {
    const agg = await prisma.flashcard.aggregate({ where: { deckId: id }, _max: { position: true } })
    position = (agg._max.position ?? -1) + 1
  }

  const card = await prisma.flashcard.create({
    data: {
      deckId: id,
      question: body.question.trim(),
      answer: body.answer.trim(),
      imageUrl: typeof body.imageUrl === "string" ? body.imageUrl : null,
      position,
    },
    select: { id: true, question: true, answer: true, imageUrl: true, position: true, createdAt: true },
  })

  return NextResponse.json(card, { status: 201 })
}
