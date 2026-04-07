import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StudyPage } from "@/components/study-page"

export default async function StudyRoute({
  searchParams,
}: {
  searchParams: Promise<{ decks?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const { decks: decksParam } = await searchParams
  const deckIds = decksParam?.split(",").filter(Boolean) ?? []

  if (deckIds.length === 0) redirect("/decks")

  const decks = await prisma.deck.findMany({
    where: { id: { in: deckIds } },
    include: { cards: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "asc" },
  })

  const cards = decks.flatMap((deck) =>
    deck.cards.map((card) => ({
      id: card.id,
      question: card.question,
      answer: card.answer,
      image: card.imageUrl ?? undefined,
      familiarity: 0,
    })),
  )

  if (cards.length === 0) redirect("/decks")

  const deckTitle =
    decks.length === 1 ? decks[0].title : `${decks.length} decks`

  return (
    <StudyPage
      userName={session.user.name ?? ""}
      userEmail={session.user.email}
      userImage={session.user.image}
      cards={cards}
      deckTitle={deckTitle}
    />
  )
}
