import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { StudyPage } from "@/components/study-page"

type Props = { params: Promise<{ id: string }> }

export default async function GuestStudyPage({ params }: Props) {
  const { id } = await params

  const deck = await prisma.deck.findUnique({
    where: { id, visibility: "PUBLIC" },
    include: { cards: { orderBy: { position: "asc" } } },
  })

  if (!deck || deck.cards.length === 0) notFound()

  const cards = deck.cards.map((card) => ({
    id: card.id,
    question: card.question,
    answer: card.answer,
    image: card.imageUrl ?? undefined,
    stability: null,
    difficulty: null,
    nextDue: null,
    reviewCount: 0,
    lastReviewedAt: null,
  }))

  return <StudyPage cards={cards} deckTitle={deck.title} guest />
}
