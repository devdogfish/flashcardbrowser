import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { authenticate } from "@/lib/api-auth"

// ── GET /api/collections ─────────────────────────────────────────────────────
// List collections for the authenticated user.
//
// Query params:
//   ?type=course   Return all course collections (globally) instead of the
//                  caller's personal collections. Useful for browsing courses.

export async function GET(request: Request) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  if (type === "course") {
    const collections = await prisma.collection.findMany({
      where: { courseCode: { not: null } },
      include: { _count: { select: { decks: true } } },
      orderBy: { courseCode: "asc" },
    })

    return NextResponse.json({
      collections: collections.map((c) => ({
        id: c.id,
        name: c.name,
        courseCode: c.courseCode,
        deckCount: c._count.decks,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    })
  }

  // Personal collections only (no course collections)
  const collections = await prisma.collection.findMany({
    where: { userId: auth.userId, courseCode: null },
    include: { _count: { select: { decks: true } } },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({
    collections: collections.map((c) => ({
      id: c.id,
      name: c.name,
      courseCode: c.courseCode,
      deckCount: c._count.decks,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  })
}

// ── POST /api/collections ────────────────────────────────────────────────────
// Create a new personal collection, or a course collection when courseCode is
// provided. Course collections are community-owned: any verified user can
// create one (max 3 per 24 h), but only admins can rename or delete them.
//
// Body: { name: string, courseCode?: string }
// Returns: { id, name, courseCode, deckCount, createdAt, updatedAt }

export async function POST(request: Request) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  let body: { name?: unknown; courseCode?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Missing required field: name" }, { status: 422 })
  }

  const name = body.name.trim()
  const courseCode =
    typeof body.courseCode === "string" && body.courseCode.trim()
      ? body.courseCode.trim().toUpperCase()
      : null

  if (courseCode !== null) {
    // Rate limit: max 3 course collections per user per 24 h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentCount = await prisma.collection.count({
      where: {
        userId: auth.userId,
        courseCode: { not: null },
        createdAt: { gte: since },
      },
    })
    if (recentCount >= 3) {
      return NextResponse.json(
        { error: "Rate limit exceeded — you can create at most 3 course collections per 24 hours" },
        { status: 429 },
      )
    }

    // Uniqueness check — one collection per course code globally
    const existing = await prisma.collection.findUnique({ where: { courseCode } })
    if (existing) {
      return NextResponse.json(
        { error: `A collection for course code "${courseCode}" already exists`, id: existing.id },
        { status: 409 },
      )
    }
  }

  // Create collection (and a starter COURSE deck if this is a course collection)
  const collection = await prisma.$transaction(async (tx) => {
    const col = await tx.collection.create({
      data: { userId: auth.userId, name, courseCode },
    })

    if (courseCode !== null) {
      const deck = await tx.deck.create({
        data: {
          ownerId: auth.userId,
          title: name,
          deckType: "COURSE",
          courseCode,
          visibility: "PUBLIC",
        },
      })
      await tx.collectionDeck.create({
        data: { collectionId: col.id, deckId: deck.id },
      })
    }

    return col
  })

  return NextResponse.json(
    {
      id: collection.id,
      name: collection.name,
      courseCode: collection.courseCode,
      deckCount: courseCode !== null ? 1 : 0,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    },
    { status: 201 },
  )
}
