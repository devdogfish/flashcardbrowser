import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

export default async function DecksPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course: courseParam } = await searchParams;

  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  // Fetch course collections — always, for all users
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

  // ── Course-focused view ──────────────────────────────────────────────────────
  if (courseParam) {
    const courseCollection = courseCollectionsRaw.find((c) => c.id === courseParam);
    if (!courseCollection) {
      // Invalid course ID — fall through to normal view
    } else {
      // Fetch decks in this course collection
      const courseDecks = await prisma.collectionDeck.findMany({
        where: { collectionId: courseParam },
        include: {
          deck: {
            include: {
              _count: { select: { cards: true } },
              owner: { select: { name: true } },
            },
          },
        },
      });

      const deckRows = courseDecks.map((cd) => ({
        id: cd.deck.id,
        title: cd.deck.title,
        description: cd.deck.description ?? "",
        cardCount: cd.deck._count.cards,
        coverImage: cd.deck.coverImage ?? null,
        ownerName: cd.deck.owner?.name ?? null,
        createdAt: cd.deck.createdAt.toISOString(),
        isPublic: true,
        collectionIds: [courseParam],
      }));

      const courseHeader = (
        <div className="mb-8">
          <Link
            href="/decks"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <ArrowLeft size={14} />
            All decks
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-foreground text-background">
              {courseCollection.courseCode}
            </span>
            <h1 className="text-xl font-semibold tracking-tight">{courseCollection.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {courseCollection._count.decks} decks · Community-maintained
          </p>
        </div>
      );

      if (session) {
        const [userDecks, sharedDecks, favorites, collections] = await Promise.all([
          prisma.deck.findMany({
            where: { ownerId: session.user.id },
            include: {
              _count: { select: { cards: true } },
              collections: { select: { collectionId: true } },
            },
            orderBy: { updatedAt: "desc" },
          }),
          prisma.deckShare.findMany({
            where: { userId: session.user.id },
            include: {
              deck: { include: { _count: { select: { cards: true } }, owner: { select: { name: true } } } },
            },
          }),
          prisma.deckFavorite.findMany({ where: { userId: session.user.id }, select: { deckId: true } }),
          prisma.collection.findMany({
            where: { userId: session.user.id, courseCode: null },
            include: { decks: { select: { deckId: true } } },
            orderBy: { createdAt: "asc" },
          }),
        ]);

        return (
          <main className="min-h-svh px-5 py-16 mx-auto max-w-4xl">
            {courseHeader}
            <DeckSelection
              userDecks={userDecks.map((d) => ({
                id: d.id, title: d.title, description: d.description ?? "",
                cardCount: d._count.cards, coverImage: d.coverImage ?? null,
                createdAt: d.createdAt.toISOString(), isPublic: d.visibility === "PUBLIC",
                collectionIds: d.collections.map((c) => c.collectionId),
              }))}
              sharedDecks={sharedDecks.map((s) => ({
                id: s.deck.id, title: s.deck.title, description: s.deck.description ?? "",
                cardCount: s.deck._count.cards, coverImage: s.deck.coverImage ?? null,
                ownerName: s.deck.owner?.name ?? null, createdAt: s.deck.createdAt.toISOString(),
                isPublic: true,
              }))}
              publicDecks={deckRows}
              favoriteIds={favorites.map((f) => f.deckId)}
              collections={collections.map((c) => ({ id: c.id, name: c.name, deckIds: c.decks.map((d) => d.deckId) }))}
            />
          </main>
        );
      }

      return (
        <main className="min-h-svh px-5 py-16 mx-auto max-w-4xl">
          {courseHeader}
          <PublicDecksBrowse decks={deckRows} />
        </main>
      );
    }
  }

  // ── Normal view ──────────────────────────────────────────────────────────────

  if (session) {
    const [userDecks, sharedDecks, publicDecks, favorites, collections] =
      await Promise.all([
        prisma.deck.findMany({
          where: { ownerId: session.user.id },
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
        // Only personal collections (no course collections) for the strip
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
    where: { visibility: "PUBLIC" },
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
