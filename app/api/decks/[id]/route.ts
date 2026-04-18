import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { authenticate, optionalAuthenticate } from "@/lib/api-auth"

// ── GET /api/decks/[id] ──────────────────────────────────────────────────────
// Fetch a deck and its full card list.
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
    include: {
      _count: { select: { cards: true } },
      cards: { where: { hidden: false }, orderBy: { position: "asc" } },
      collections: { select: { collectionId: true } },
      owner: { select: { name: true } },
    },
  })

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 })
  }

  if (deck.visibility === "PRIVATE") {
    if (!userId || userId !== deck.ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.json({
    id: deck.id,
    title: deck.title,
    description: deck.description,
    visibility: deck.visibility,
    coverImage: deck.coverImage,
    cardCount: deck._count.cards,
    ownerName: deck.owner?.name ?? null,
    collectionIds: deck.collections.map((c) => c.collectionId),
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
    cards: deck.cards.map((c) => ({
      id: c.id,
      question: c.question,
      answer: c.answer,
      imageUrl: c.imageUrl,
      position: c.position,
    })),
  })
}

// ── PATCH /api/decks/[id] ────────────────────────────────────────────────────
// Update deck metadata. Caller must be the deck owner.
//
// Body (all fields optional): { title?, description?, visibility?, coverImage? }

export async function PATCH(
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

  let body: { title?: unknown; description?: unknown; visibility?: unknown; coverImage?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const data: Record<string, unknown> = {}

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "title must be a non-empty string" }, { status: 422 })
    }
    data.title = body.title.trim()
  }

  if (body.description !== undefined) {
    data.description = body.description === null ? null : String(body.description).trim() || null
  }

  if (body.visibility !== undefined) {
    if (body.visibility !== "PUBLIC" && body.visibility !== "PRIVATE") {
      return NextResponse.json({ error: "visibility must be \"PUBLIC\" or \"PRIVATE\"" }, { status: 422 })
    }
    data.visibility = body.visibility
  }

  if (body.coverImage !== undefined) {
    data.coverImage = body.coverImage === null ? null : String(body.coverImage)
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 422 })
  }

  const updated = await prisma.deck.update({ where: { id }, data })

  return NextResponse.json({
    id: updated.id,
    title: updated.title,
    description: updated.description,
    visibility: updated.visibility,
    coverImage: updated.coverImage,
    updatedAt: updated.updatedAt,
  })
}

// ── DELETE /api/decks/[id] ───────────────────────────────────────────────────
// Permanently delete a deck and all its cards. Caller must be the deck owner.

export async function DELETE(
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

  await prisma.deck.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
