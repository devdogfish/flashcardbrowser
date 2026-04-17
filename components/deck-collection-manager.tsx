"use client";

import { useState, useTransition } from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { addDeckToCollection, removeDeckFromCollection } from "@/app/actions";

interface CollectionOption {
  id: string;
  name: string;
}

interface DeckCollectionManagerProps {
  deckId: string;
  collections: CollectionOption[];
  memberCollectionIds: string[];
}

export function DeckCollectionManager({
  deckId,
  collections,
  memberCollectionIds,
}: DeckCollectionManagerProps) {
  const [memberIds, setMemberIds] = useState(new Set(memberCollectionIds));
  const [, startTransition] = useTransition();

  function handleToggle(collectionId: string) {
    const isMember = memberIds.has(collectionId);
    setMemberIds((prev) => {
      const next = new Set(prev);
      if (isMember) next.delete(collectionId);
      else next.add(collectionId);
      return next;
    });
    startTransition(() => {
      if (isMember) {
        removeDeckFromCollection(collectionId, deckId);
      } else {
        addDeckToCollection(collectionId, deckId);
      }
    });
  }

  if (collections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No collections yet.{" "}
        <a href="/decks" className="underline underline-offset-2 hover:text-foreground transition-colors">
          Create one from Your Decks.
        </a>
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {collections.map((c) => {
        const active = memberIds.has(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => handleToggle(c.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30",
            )}
          >
            <FolderOpen size={13} />
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
