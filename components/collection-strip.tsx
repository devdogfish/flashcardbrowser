"use client";

import { useState, useRef, useTransition } from "react";
import { Plus, MoreHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createCollection,
  deleteCollection,
  renameCollection,
} from "@/app/actions";

export interface CollectionData {
  id: string;
  name: string;
  deckIds: string[];
}

interface CollectionStripProps {
  collections: CollectionData[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onCollectionsChange: (collections: CollectionData[]) => void;
}

export function CollectionStrip({
  collections,
  activeId,
  onSelect,
  onCollectionsChange,
}: CollectionStripProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [, startTransition] = useTransition();
  const createInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) {
      setIsCreating(false);
      return;
    }
    const optimisticName = newName.trim();
    setNewName("");
    setIsCreating(false);
    startTransition(async () => {
      const created = await createCollection(optimisticName);
      onCollectionsChange([
        ...collections,
        { id: created.id, name: created.name, deckIds: [] },
      ]);
    });
  }

  function handleStartCreate() {
    setIsCreating(true);
    setTimeout(() => createInputRef.current?.focus(), 0);
  }

  function handleStartRename(c: CollectionData) {
    setRenamingId(c.id);
    setRenameValue(c.name);
    setTimeout(() => renameInputRef.current?.focus(), 0);
  }

  function handleRenameSubmit(e: React.FormEvent, id: string) {
    e.preventDefault();
    const trimmed = renameValue.trim();
    setRenamingId(null);
    if (!trimmed) return;
    onCollectionsChange(
      collections.map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
    );
    startTransition(() => renameCollection(id, trimmed));
  }

  function handleDelete(id: string) {
    if (activeId === id) onSelect(null);
    onCollectionsChange(collections.filter((c) => c.id !== id));
    startTransition(() => deleteCollection(id));
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {/* All chip */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
          activeId === null
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </button>

      {/* Collection chips */}
      {collections.map((c) => (
        <div key={c.id} className="group relative shrink-0 flex items-center">
          {renamingId === c.id ? (
            <form onSubmit={(e) => handleRenameSubmit(e, c.id)}>
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={(e) => handleRenameSubmit(e as unknown as React.FormEvent, c.id)}
                onKeyDown={(e) => e.key === "Escape" && setRenamingId(null)}
                className="h-7 px-3 rounded-full text-sm bg-muted border border-border outline-none focus:ring-1 focus:ring-primary w-36"
              />
            </form>
          ) : (
            <button
              onClick={() => onSelect(activeId === c.id ? null : c.id)}
              className={cn(
                "h-7 pl-3 pr-7 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeId === c.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {c.name}
              <span
                className={cn(
                  "ml-1.5 text-xs",
                  activeId === c.id ? "opacity-70" : "opacity-50",
                )}
              >
                {c.deckIds.length}
              </span>
            </button>
          )}

          {/* ⋯ menu — visible on hover */}
          {renamingId !== c.id && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-opacity",
                  "opacity-0 group-hover:opacity-100",
                  activeId === c.id
                    ? "text-primary-foreground/70 hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={12} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-32">
                <DropdownMenuItem onClick={() => handleStartRename(c)}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}

      {/* New collection */}
      {isCreating ? (
        <form onSubmit={handleCreateSubmit} className="shrink-0">
          <input
            ref={createInputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleCreateSubmit}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsCreating(false);
                setNewName("");
              }
            }}
            placeholder="Collection name…"
            className="h-7 px-3 rounded-full text-sm bg-muted border border-border outline-none focus:ring-1 focus:ring-primary w-44"
          />
        </form>
      ) : (
        <button
          onClick={handleStartCreate}
          className="shrink-0 h-7 px-3 rounded-full text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors border border-dashed border-border hover:border-foreground/30"
        >
          <Plus size={12} />
          New
        </button>
      )}
    </div>
  );
}
