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
// Create a new personal collection.
//
// Body: { name: string }
// Returns: { id, name, courseCode, deckCount, createdAt, updatedAt }

export async function POST(request: Request) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  let body: { name?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Missing required field: name" }, { status: 422 })
  }

  const collection = await prisma.collection.create({
    data: {
      userId: auth.userId,
      name: body.name.trim(),
    },
  })

  return NextResponse.json(
    {
      id: collection.id,
      name: collection.name,
      courseCode: collection.courseCode,
      deckCount: 0,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    },
    { status: 201 },
  )
}
