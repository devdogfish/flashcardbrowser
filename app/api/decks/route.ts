import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { put } from "@vercel/blob"
import { authenticate } from "@/lib/api-auth"

// ── Types ────────────────────────────────────────────────────────────────────

interface CardBody {
  front: { title: string; description?: string }
  back: { title: string; description?: string; image?: string }
}

interface DeckBody {
  name: string
  description?: string
  coverImage?: string
  visibility?: "PUBLIC" | "PRIVATE"
  cards: CardBody[]
}

// ── Image mirroring ──────────────────────────────────────────────────────────

async function mirrorImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    const contentType = res.headers.get("content-type") || "image/jpeg"
    const ext = contentType.split("/")[1]?.split("+")[0] || "jpg"
    const filename = `deck-import-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const blob = new Blob([arrayBuffer], { type: contentType })
    const result = await put(`imports/${filename}`, blob, { access: "public" })
    return result.url
  } catch {
    return null
  }
}

// ── GET /api/decks ───────────────────────────────────────────────────────────
// List all decks owned by the authenticated user.

export async function GET(request: Request) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  const decks = await prisma.deck.findMany({
    where: { ownerId: auth.userId },
    include: {
      _count: { select: { cards: true } },
      collections: { select: { collectionId: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({
    decks: decks.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      visibility: d.visibility,
      coverImage: d.coverImage,
      cardCount: d._count.cards,
      collectionIds: d.collections.map((c) => c.collectionId),
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
  })
}

// ── POST /api/decks ──────────────────────────────────────────────────────────
// Create a new deck with cards.
//
// Body: { name, description?, coverImage?, visibility?: "PUBLIC"|"PRIVATE", cards[] }
// Returns: { id, title, cardCount, visibility, editUrl }

export async function POST(request: Request) {
  const auth = await authenticate(request)
  if ("error" in auth) return auth.error

  let body: DeckBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Missing required field: name" }, { status: 422 })
  }
  if (!Array.isArray(body.cards) || body.cards.length === 0) {
    return NextResponse.json({ error: "cards must be a non-empty array" }, { status: 422 })
  }
  if (body.visibility && body.visibility !== "PUBLIC" && body.visibility !== "PRIVATE") {
    return NextResponse.json({ error: "visibility must be \"PUBLIC\" or \"PRIVATE\"" }, { status: 422 })
  }

  for (let i = 0; i < body.cards.length; i++) {
    const card = body.cards[i]
    if (!card?.front?.title?.trim()) {
      return NextResponse.json({ error: `Card ${i + 1}: missing front.title` }, { status: 422 })
    }
    if (!card?.back?.title?.trim()) {
      return NextResponse.json({ error: `Card ${i + 1}: missing back.title` }, { status: 422 })
    }
  }

  const coverImageUrl = body.coverImage ? await mirrorImage(body.coverImage) : null
  const cardImageUrls = await Promise.all(
    body.cards.map((c) => (c.back.image ? mirrorImage(c.back.image) : Promise.resolve(null)))
  )

  const deck = await prisma.deck.create({
    data: {
      ownerId: auth.userId,
      title: body.name.trim(),
      description: body.description?.trim() || null,
      visibility: body.visibility ?? "PRIVATE",
      coverImage: coverImageUrl,
    },
  })

  await prisma.flashcard.createMany({
    data: body.cards.map((card, i) => {
      const question = card.front.description?.trim()
        ? `${card.front.title}\n\n${card.front.description}`
        : card.front.title

      const answer = card.back.description?.trim()
        ? `${card.back.title}\n\n${card.back.description}`
        : card.back.title

      return {
        deckId: deck.id,
        question: question.trim(),
        answer: answer.trim(),
        imageUrl: cardImageUrls[i],
        position: i,
      }
    }),
  })

  const baseUrl = new URL(request.url).origin

  return NextResponse.json(
    {
      id: deck.id,
      title: deck.title,
      cardCount: body.cards.length,
      visibility: deck.visibility,
      editUrl: `${baseUrl}/decks/${deck.id}/edit`,
    },
    { status: 201 },
  )
}
