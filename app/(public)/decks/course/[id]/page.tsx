import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageLayout } from "@/components/page-layout";
import { CourseDeckView } from "@/components/course-decks-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const collection = await prisma.collection.findFirst({
    where: { id, courseCode: { not: null } },
  });
  if (!collection) return { title: "Course — flashcardbrowser" };
  return {
    title: `${collection.courseCode} — flashcardbrowser`,
    description: `Community flashcard decks for ${collection.name} at Dalhousie. Browse and study.`,
  };
}

export default async function CourseDecksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [collection, session] = await Promise.all([
    prisma.collection.findFirst({
      where: { id, courseCode: { not: null } },
      include: { _count: { select: { decks: true } } },
    }),
    auth.api.getSession({ headers: await headers() }).catch(() => null),
  ]);

  if (!collection) notFound();

  const [collectionDecks, favorites] = await Promise.all([
    prisma.collectionDeck.findMany({
      where: { collectionId: id, deck: { deckType: { not: "COURSE" } } },
      include: {
        deck: {
          include: {
            _count: { select: { cards: true } },
            owner: { select: { id: true, name: true } },
          },
        },
      },
    }),
    session
      ? prisma.deckFavorite.findMany({
          where: { userId: session.user.id },
          select: { deckId: true },
        })
      : Promise.resolve([]),
  ]);

  const decks = collectionDecks.map((cd) => ({
    id: cd.deck.id,
    title: cd.deck.title,
    description: cd.deck.description ?? "",
    cardCount: cd.deck._count.cards,
    coverImage: cd.deck.coverImage ?? null,
    ownerName: cd.deck.owner?.name ?? null,
    isOwned: session ? cd.deck.owner?.id === session.user.id : false,
    createdAt: cd.deck.createdAt.toISOString(),
  }));

  return (
    <PageLayout
      title={collection.name}
      backHref="/decks"
      backLabel="All decks"
      subtitle={`${collection._count.decks} ${collection._count.decks === 1 ? "deck" : "decks"} · Community-maintained`}
      maxWidth="max-w-4xl"
      action={
        <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-foreground text-background mt-1 shrink-0">
          {collection.courseCode}
        </span>
      }
    >
      <CourseDeckView
        decks={decks}
        favoriteIds={favorites.map((f) => f.deckId)}
        isAuthenticated={!!session}
      />
    </PageLayout>
  );
}
