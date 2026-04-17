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
