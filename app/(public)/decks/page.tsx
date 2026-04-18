import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DeckSelection } from "@/components/deck-selection";
import { PublicDecksBrowse } from "@/components/public-decks-browse";
import { PageLayout } from "@/components/page-layout";
import type { CourseCollectionData } from "@/components/deck-selection";

export const metadata: Metadata = {
  title: "Browse Decks — flashcardbrowser",
  description:
    "Discover community flashcard decks for Dalhousie students. Browse, search, and study public decks across all subjects.",
};

export default async function DecksPage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  const courseCollectionsRaw = await prisma.collection.findMany({
    where: { courseCode: { not: null } },
    include: { _count: { select: { decks: true } } },
    orderBy: { courseCode: "asc" },
  });

  const courseCollections: CourseCollectionData[] = courseCollectionsRaw.map((c) => ({
    id: c.id,
    name: c.name,
    courseCode: c.courseCode!,
    deckCount: c._count.decks,
  }));

  if (session) {
    const [userDecks, sharedDecks, publicDecks, favorites, collections] =
      await Promise.all([
        prisma.deck.findMany({
          where: { ownerId: session.user.id, deckType: { not: "COURSE" } },
          include: {
            _count: { select: { cards: true } },
            collections: { select: { collectionId: true } },
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.deckShare.findMany({
          where: { userId: session.user.id },
          include: {
            deck: {
              include: {
                _count: { select: { cards: true } },
                owner: { select: { name: true } },
              },
            },
          },
        }),
        prisma.deck.findMany({
          where: {
            visibility: "PUBLIC",
            deckType: { not: "COURSE" },
            ownerId: { not: session.user.id },
            NOT: { shares: { some: { userId: session.user.id } } },
          },
          include: {
            _count: { select: { cards: true } },
            owner: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.deckFavorite.findMany({
          where: { userId: session.user.id },
          select: { deckId: true },
        }),
        prisma.collection.findMany({
          where: { userId: session.user.id, courseCode: null },
          include: { decks: { select: { deckId: true } } },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    const favoriteIds = new Set(favorites.map((f) => f.deckId));

    const toRow = (d: {
      id: string; title: string; description: string | null; coverImage: string | null;
      createdAt: Date; visibility: string; _count: { cards: number };
      owner?: { name: string | null } | null;
    }, collectionIds?: string[]) => ({
      id: d.id,
      title: d.title,
      description: d.description ?? "",
      cardCount: d._count.cards,
      coverImage: d.coverImage ?? null,
      ownerName: d.owner?.name ?? null,
      createdAt: d.createdAt.toISOString(),
      isPublic: d.visibility === "PUBLIC",
      collectionIds: collectionIds ?? [],
    });

    return (
      <PageLayout title="Your decks" subtitle="Your decks, shared decks, and community decks" maxWidth="max-w-4xl">
        <DeckSelection
          userDecks={userDecks.map((d) => toRow(d, d.collections.map((c) => c.collectionId)))}
          sharedDecks={sharedDecks.map((s) => ({ ...toRow({ ...s.deck, visibility: s.deck.visibility }), isShared: true }))}
          publicDecks={publicDecks.map((d) => toRow(d))}
          favoriteIds={[...favoriteIds]}
          collections={collections.map((c) => ({ id: c.id, name: c.name, deckIds: c.decks.map((d) => d.deckId) }))}
          courseCollections={courseCollections}
        />
      </PageLayout>
    );
  }

  // Not authenticated
  const publicDecks = await prisma.deck.findMany({
    where: { visibility: "PUBLIC", deckType: { not: "COURSE" } },
    include: { _count: { select: { cards: true } }, owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageLayout title="Community decks" subtitle="Browse public flashcard decks — sign in to create your own" maxWidth="max-w-4xl">
      <PublicDecksBrowse
        decks={publicDecks.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description ?? "",
          cardCount: d._count.cards,
          coverImage: d.coverImage ?? null,
          ownerName: d.owner?.name ?? null,
          createdAt: d.createdAt.toISOString(),
        }))}
        courseCollections={courseCollections}
      />
    </PageLayout>
  );
}
