import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { authenticate } from "@/lib/api-auth"

// ── PUT /api/collections/[id]/decks/[deckId] ─────────────────────────────────
// Add a deck to a collection.
//
// A deck may belong to at most one PERSONAL collection at a time. When moved
// to a different personal collection, it is automatically removed from the
// previous one. Course collections (courseCode != null) are tracked separately
// and are never affected by personal-collection moves.
//
// Idempotent: adding a deck that is already in this collection is a no-op.

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; deckId: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id: collectionId, deckId } = await params

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true, courseCode: true },
  })

  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }
  if (collection.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

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

  // When adding to a personal collection, remove from any other personal
  // collection first (enforce one-personal-collection-per-deck). Course
  // collection memberships are left untouched.
  if (collection.courseCode === null) {
    await prisma.collectionDeck.deleteMany({
      where: {
        deckId,
        NOT: { collectionId },
        collection: { courseCode: null },
      },
    })
  }

  await prisma.collectionDeck.upsert({
    where: { collectionId_deckId: { collectionId, deckId } },
    create: { collectionId, deckId },
    update: {},
  })

  return NextResponse.json({ collectionId, deckId })
}

// ── DELETE /api/collections/[id]/decks/[deckId] ───────────────────────────────
// Remove a deck from a collection. The deck itself is NOT deleted.
// Caller must own the collection.

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; deckId: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id: collectionId, deckId } = await params

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
