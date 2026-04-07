"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Globe,
  Lock,
  Star,
  Check,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DECK_COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#8B5CF6",
  "#F97316",
  "#EC4899",
];

function deckColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return DECK_COLORS[hash % DECK_COLORS.length];
}

interface DeckData {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  coverImage?: string | null;
  ownerName?: string | null;
}

interface DeckSelectionProps {
  userDecks: DeckData[];
  publicDecks: DeckData[];
  favoriteIds: string[];
}

function DeckRow({
  id,
  title,
  cardCount,
  coverImage,
  isSelected,
  onSelect,
}: DeckData & { isSelected: boolean; onSelect: (id: string) => void }) {
  const color = deckColor(id);
  return (
    <button
      onClick={() => onSelect(id)}
      className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-8 h-8 rounded-lg shrink-0 overflow-hidden">
          {coverImage ? (
            <Image src={coverImage} alt={title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: color }} />
          )}
        </div>
        <div className="min-w-0">
          <span className="text-sm text-foreground/90 font-medium truncate block">
            {title}
          </span>
          <span className="text-xs text-muted-foreground">{cardCount} cards</span>
        </div>
      </div>
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
          isSelected ? "bg-primary border-primary" : "border-border",
        )}
      >
        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
      </div>
    </button>
  );
}

export function DeckSelection({
  userDecks,
  publicDecks,
  favoriteIds,
}: DeckSelectionProps) {
  const router = useRouter();
  const [selectedDecks, setSelectedDecks] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const handleSelect = useCallback((id: string) => {
    setSelectedDecks((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  }, []);

  const handleStartStudy = useCallback(() => {
    router.push(`/study?decks=${selectedDecks.join(",")}`);
  }, [router, selectedDecks]);

  const allDecks = useMemo(
    () => [...userDecks, ...publicDecks],
    [userDecks, publicDecks],
  );

  const totalCards = useMemo(() => {
    return selectedDecks
      .map((id) => allDecks.find((d) => d.id === id))
      .reduce((sum, deck) => sum + (deck?.cardCount ?? 0), 0);
  }, [selectedDecks, allDecks]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const filter = useCallback(
    (decks: DeckData[]) => {
      if (!query.trim()) return decks;
      const q = query.toLowerCase();
      return decks.filter((d) => d.title.toLowerCase().includes(q));
    },
    [query],
  );

  const favoriteDecks = filter(
    allDecks.filter((d) => favoriteSet.has(d.id)),
  );
  const filteredUserDecks = filter(
    userDecks.filter((d) => !favoriteSet.has(d.id)),
  );
  const filteredPublicDecks = filter(
    publicDecks.filter((d) => !favoriteSet.has(d.id)),
  );

  const sections = [
    {
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />,
      label: "Favorites",
      decks: favoriteDecks,
    },
    {
      icon: <Lock className="w-3.5 h-3.5 text-muted-foreground" />,
      label: "Your Decks",
      decks: filteredUserDecks,
    },
    {
      icon: <Globe className="w-3.5 h-3.5 text-muted-foreground" />,
      label: "Community",
      decks: filteredPublicDecks,
    },
  ].filter((s) => s.decks.length > 0);

  const hasAnyDecks = allDecks.length > 0;
  const noResults = hasAnyDecks && sections.length === 0;

  return (
    <main className="min-h-svh flex items-start justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight mb-6">
          Choose your decks
        </h1>

        {/* Search */}
        {hasAnyDecks && (
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search decks…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {!hasAnyDecks ? (
          <p className="text-sm text-muted-foreground">No decks available.</p>
        ) : noResults ? (
          <p className="text-sm text-muted-foreground">
            No decks match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.label}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  {section.icon}
                  {section.label}
                </p>
                <div className="rounded-2xl border border-border overflow-hidden">
                  {section.decks.map((deck, i) => (
                    <div
                      key={deck.id}
                      className={cn(
                        i < section.decks.length - 1 && "border-b border-border",
                      )}
                    >
                      <DeckRow
                        {...deck}
                        isSelected={selectedDecks.includes(deck.id)}
                        onSelect={handleSelect}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedDecks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="mt-8"
            >
              <Button onClick={handleStartStudy} className="w-full gap-1.5">
                Start Studying · {totalCards} cards
                <ChevronRight size={16} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
