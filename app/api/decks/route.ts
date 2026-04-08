import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { put } from "@vercel/blob"

// ── Types ────────────────────────────────────────────────────────────────────

interface CardBody {
  front: { title: string; description?: string }
  back: { title: string; description?: string; image?: string }
}

interface DeckBody {
  name: string
  description?: string
  coverImage?: string
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

// ── POST /api/decks ──────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // Auth via Bearer API key
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 })
  }

  const rawKey = authHeader.slice(7).trim()
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: rawKey },
    select: { id: true, userId: true },
  })

  if (!apiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }

  // Update lastUsedAt in the background
  prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  }).catch(() => {})

  // Parse body
  let body: DeckBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Validate
  if (typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Missing required field: name" }, { status: 422 })
  }
  if (!Array.isArray(body.cards) || body.cards.length === 0) {
    return NextResponse.json({ error: "cards must be a non-empty array" }, { status: 422 })
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

  // Mirror images in parallel
  const coverImageUrl = body.coverImage ? await mirrorImage(body.coverImage) : null
  const cardImageUrls = await Promise.all(
    body.cards.map((c) => (c.back.image ? mirrorImage(c.back.image) : Promise.resolve(null)))
  )

  // Create deck
  const deck = await prisma.deck.create({
    data: {
      ownerId: apiKey.userId,
      title: body.name.trim(),
      description: body.description?.trim() || null,
      visibility: "PRIVATE",
      coverImage: coverImageUrl,
    },
  })

  // Create cards
  await prisma.flashcard.createMany({
    data: body.cards.map((card, i) => {
      const question =
        card.front.description?.trim()
          ? `${card.front.title}\n\n${card.front.description}`
          : card.front.title

      const answer =
        card.back.description?.trim()
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
      editUrl: `${baseUrl}/decks/${deck.id}/edit`,
    },
    { status: 201 },
  )
}
