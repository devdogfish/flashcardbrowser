import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { authenticate, optionalAuthenticate } from "@/lib/api-auth"

// ── GET /api/collections/[id] ────────────────────────────────────────────────
// Get a single collection with its decks.
//
// Course collections (courseCode != null) are globally readable — any valid
// API key may access them. Personal collections require the owner's API key.

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const userId = await optionalAuthenticate(request)

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
              coverImage: true,
              createdAt: true,
              _count: { select: { cards: true } },
              owner: { select: { name: true } },
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

  const isCourseCollection = collection.courseCode !== null

  // Personal collections are owner-only
  if (!isCourseCollection) {
    if (!userId || collection.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }
  // Course collections are publicly readable — no ownership check needed

  return NextResponse.json({
    id: collection.id,
    name: collection.name,
    courseCode: collection.courseCode,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    decks: collection.decks.map(({ deck, addedAt }) => ({
      id: deck.id,
      title: deck.title,
      description: deck.description,
      visibility: deck.visibility,
      coverImage: deck.coverImage,
      cardCount: deck._count.cards,
      ownerName: deck.owner?.name ?? null,
      addedAt,
    })),
  })
}

// ── PATCH /api/collections/[id] ──────────────────────────────────────────────
// Rename a collection. Caller must be the owner.
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
    select: { userId: true, courseCode: true },
  })

  if (!existing) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }

  if (existing.courseCode !== null) {
    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } })
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Course collections can only be renamed by admins" }, { status: 403 })
    }
  } else if (existing.userId !== auth.userId) {
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
    courseCode: updated.courseCode,
    updatedAt: updated.updatedAt,
  })
}

// ── DELETE /api/collections/[id] ─────────────────────────────────────────────
// Delete a collection. Decks are NOT deleted — they are simply unlinked.
// Caller must be the owner.

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { id } = await params

  const existing = await prisma.collection.findUnique({
    where: { id },
    select: { userId: true, courseCode: true },
  })

  if (!existing) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }

  if (existing.courseCode !== null) {
    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } })
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Course collections can only be deleted by admins" }, { status: 403 })
    }
  } else if (existing.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.collection.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
