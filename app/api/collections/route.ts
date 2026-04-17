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

  // Update lastUsedAt in the background
  prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  }).catch(() => {})

  return { userId: apiKey.userId }
}

// ── GET /api/collections ─────────────────────────────────────────────────────
// List all collections owned by the authenticated user.

export async function GET(request: Request) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const collections = await prisma.collection.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { decks: true } },
    },
  })

  return NextResponse.json({
    collections: collections.map((c) => ({
      id: c.id,
      name: c.name,
      deckCount: c._count.decks,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  })
}

// ── POST /api/collections ────────────────────────────────────────────────────
// Create a new collection.
//
// Body: { name: string }
// Returns: { id, name, deckCount, createdAt, updatedAt }

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
      deckCount: 0,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    },
    { status: 201 },
  )
}
