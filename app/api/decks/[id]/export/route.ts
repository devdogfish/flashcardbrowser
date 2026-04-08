import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const deck = await prisma.deck.findUnique({
    where: { id },
    include: { cards: { orderBy: { position: "asc" } } },
  })

  if (!deck) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Private decks require auth and ownership
  if (deck.visibility === "PRIVATE") {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || session.user.id !== deck.ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const exportData = {
    name: deck.title,
    ...(deck.description ? { description: deck.description } : {}),
    ...(deck.coverImage ? { coverImage: deck.coverImage } : {}),
    cards: deck.cards.map((card) => ({
      id: card.id,
      front: { title: card.question },
      back: {
        title: card.answer,
        ...(card.imageUrl ? { image: card.imageUrl } : {}),
      },
    })),
  }

  const slug = deck.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  const filename = `${slug || "deck"}.json`

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
