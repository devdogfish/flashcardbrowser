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

// ── GET /api/collections/[id] ────────────────────────────────────────────────
// Get a single collection with its decks.

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id } = await params

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      decks: {
        include: {
          deck: {
            select: {
              id: true,
              title: true,
              description: true,
              visibility: true,
              createdAt: true,
              _count: { select: { cards: true } },
            },
          },
        },
        orderBy: { addedAt: "asc" },
      },
    },
  })

  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }

  if (collection.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({
    id: collection.id,
    name: collection.name,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    decks: collection.decks.map(({ deck, addedAt }) => ({
      id: deck.id,
      title: deck.title,
      description: deck.description,
      visibility: deck.visibility,
      cardCount: deck._count.cards,
      addedAt,
    })),
  })
}

// ── PATCH /api/collections/[id] ──────────────────────────────────────────────
// Rename a collection.
//
// Body: { name: string }

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id } = await params

  const existing = await prisma.collection.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!existing) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }

  if (existing.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: { name?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Missing required field: name" }, { status: 422 })
  }

  const updated = await prisma.collection.update({
    where: { id },
    data: { name: body.name.trim() },
  })

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    updatedAt: updated.updatedAt,
  })
}

// ── DELETE /api/collections/[id] ─────────────────────────────────────────────
// Delete a collection. Decks are NOT deleted — they are simply unlinked.

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id } = await params

  const existing = await prisma.collection.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!existing) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }

  if (existing.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.collection.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
