"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DeckCard } from "@/components/deck-card";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { X, Sparkles, ChevronRight, Star, Globe, Lock } from "lucide-react";

// Hardcoded deck data
const DECKS = [
  {
    id: "portuguese-basics",
    title: "Portuguese Essentials",
    description:
      "Master the fundamentals of Portuguese - common phrases, greetings, and everyday vocabulary for beginners.",
    cardCount: 45,
    lastStudied: "2 days ago",
    creator: "Maria Silva",
    isPublic: true,
    image: "/deck-covers/portuguese.jpg",
    color: "#F59E0B",
  },
  {
    id: "data-science-fundamentals",
    title: "Data Science Core",
    description:
      "Key concepts in data science including statistics, machine learning basics, and Python fundamentals.",
    cardCount: 62,
    lastStudied: "1 week ago",
    creator: "Alex Chen",
    isPublic: true,
    image: "/deck-covers/data-science.jpg",
    color: "#3B82F6",
  },
  {
    id: "getting-jacked",
    title: "Getting Jacked",
    description:
      "Workout principles, muscle groups, nutrition basics, and training techniques for building muscle.",
    cardCount: 28,
    lastStudied: "yesterday",
    isPublic: false,
    image: "/deck-covers/fitness.jpg",
    color: "#EF4444",
  },
];

// Hardcoded favorite deck IDs (in reality, this would come from user preferences)
const FAVORITE_DECK_IDS = ["portuguese-basics", "getting-jacked"];

// Subtle rotation offsets for visual interest
const ROTATION_OFFSETS = [-2, 1.5, -1, 2, -1.5];

interface DeckSelectionProps {
  userName: string;
  userEmail: string;
  userImage?: string | null;
}

export function DeckSelection({
  userName,
  userEmail,
  userImage,
}: DeckSelectionProps) {
  const router = useRouter();
  const [selectedDecks, setSelectedDecks] = useState<string[]>([]);

  const handleSelect = useCallback((id: string) => {
    setSelectedDecks((prev) => {
      if (prev.includes(id)) {
        return prev.filter((d) => d !== id);
      }
      return [...prev, id];
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setSelectedDecks((prev) => prev.filter((d) => d !== id));
  }, []);

  const handleStartStudy = useCallback(() => {
    router.push(`/study?decks=${selectedDecks.join(",")}`);
  }, [router, selectedDecks]);

  const selectedDeckData = useMemo(() => {
    return selectedDecks
      .map((id) => DECKS.find((d) => d.id === id))
      .filter(Boolean);
  }, [selectedDecks]);

  const totalCards = useMemo(() => {
    return selectedDeckData.reduce(
      (sum, deck) => sum + (deck?.cardCount ?? 0),
      0,
    );
  }, [selectedDeckData]);

  // Split decks into categories
  const favoriteDecks = DECKS.filter((d) => FAVORITE_DECK_IDS.includes(d.id));
  const publicDecks = DECKS.filter(
    (d) => d.isPublic && !FAVORITE_DECK_IDS.includes(d.id),
  );
  const privateDecks = DECKS.filter(
    (d) => !d.isPublic && !FAVORITE_DECK_IDS.includes(d.id),
  );

  return (
    <main className="flex-1 overflow-y-auto px-6 py-8 pb-32">
      <h1 className="text-xl font-semibold text-foreground">
        Choose your decks
      </h1>
      <p className="text-sm text-muted-foreground mt-0.5">
        Select one or more decks to study
      </p>
      {/* Favorites section */}
      {favoriteDecks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Favorites
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {favoriteDecks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DeckCard
                  {...deck}
                  isSelected={selectedDecks.includes(deck.id)}
                  onSelect={handleSelect}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Private decks section */}
      {privateDecks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Your Decks
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {privateDecks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (favoriteDecks.length + index) * 0.1 }}
              >
                <DeckCard
                  {...deck}
                  isSelected={selectedDecks.includes(deck.id)}
                  onSelect={handleSelect}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Public decks section */}
      {publicDecks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Community Decks
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {publicDecks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay:
                    (favoriteDecks.length + privateDecks.length + index) * 0.1,
                }}
              >
                <DeckCard
                  {...deck}
                  isSelected={selectedDecks.includes(deck.id)}
                  onSelect={handleSelect}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}
      {/* Floating session bar - v2 style with circular thumbnails */}
      <AnimatePresence>
        {selectedDecks.length > 0 && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="bg-card border-t border-border shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
              <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mixed indicator */}
                  {selectedDecks.length > 1 && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Sparkles size={14} />
                      <span>Mixed</span>
                    </div>
                  )}

                  {/* Circular deck thumbnails */}
                  <div className="flex items-center gap-1">
                    {selectedDeckData.map((deck) => (
                      <button
                        key={deck?.id}
                        onClick={() => handleRemove(deck?.id ?? "")}
                        className="group relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-background hover:ring-destructive/50 transition-all"
                      >
                        {deck?.image ? (
                          <Image
                            src={deck.image}
                            alt={deck.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: deck?.color ?? "#888" }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <X
                            size={12}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Card count */}
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {totalCards} cards
                  </span>
                </div>

                <Button onClick={handleStartStudy} className="shrink-0 gap-1">
                  Start Studying
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
