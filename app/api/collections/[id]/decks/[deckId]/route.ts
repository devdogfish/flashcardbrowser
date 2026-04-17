import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// ── Auth helper ──────────────────────────────────────────────────────────────

async function authenticate(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 }) }
  }

  const rawKey = authHeader.slice(7).trim()
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: rawKey },
    select: { id: true, userId: true },
  })

  if (!apiKey) {
    return { error: NextResponse.json({ error: "Invalid API key" }, { status: 401 }) }
  }

  prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  }).catch(() => {})

  return { userId: apiKey.userId }
}

// ── PUT /api/collections/[id]/decks/[deckId] ─────────────────────────────────
// Add a deck to a collection.
//
// Each deck may belong to only ONE collection. If the deck is already in
// another collection it is moved automatically (old link removed first).
// Idempotent: adding a deck that is already in this collection is a no-op.

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; deckId: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id: collectionId, deckId } = await params

  // Verify the collection exists and belongs to this user
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true },
  })

  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }

  if (collection.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Verify the deck exists and belongs to this user
  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    select: { ownerId: true },
  })

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 })
  }

  if (deck.ownerId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Enforce one-collection-per-deck: remove from any other collection first
  await prisma.collectionDeck.deleteMany({
    where: {
      deckId,
      NOT: { collectionId },
    },
  })

  // Add to this collection (upsert = idempotent)
  await prisma.collectionDeck.upsert({
    where: { collectionId_deckId: { collectionId, deckId } },
    create: { collectionId, deckId },
    update: {},
  })

  return NextResponse.json({ collectionId, deckId })
}

// ── DELETE /api/collections/[id]/decks/[deckId] ───────────────────────────────
// Remove a deck from a collection. The deck itself is NOT deleted.

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; deckId: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id: collectionId, deckId } = await params

  // Verify the collection exists and belongs to this user
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true },
  })

  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }

  if (collection.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const link = await prisma.collectionDeck.findUnique({
    where: { collectionId_deckId: { collectionId, deckId } },
  })

  if (!link) {
    return NextResponse.json({ error: "Deck is not in this collection" }, { status: 404 })
  }

  await prisma.collectionDeck.delete({
    where: { collectionId_deckId: { collectionId, deckId } },
  })

  return new NextResponse(null, { status: 204 })
}
