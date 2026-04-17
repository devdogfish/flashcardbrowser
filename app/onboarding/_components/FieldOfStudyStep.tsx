"use client";

import { useState, useRef, useEffect } from "react";
import { saveFieldOfStudy } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import fieldsOfStudy from "./fields-of-study.json";

function FieldOfStudyInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = value.trim()
    ? fieldsOfStudy.filter((f) => f.toLowerCase().includes(value.toLowerCase()))
    : fieldsOfStudy;

  useEffect(() => {
    setHighlighted(0);
  }, [value]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) {
        onChange(filtered[highlighted]);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        placeholder="Search your program…"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoFocus
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-44 overflow-y-auto rounded-lg border border-border bg-card dark:bg-zinc-900 shadow-md text-sm divide-y divide-border/40">
          {filtered.map((f, i) => (
            <li
              key={f}
              onPointerDown={(e) => {
                e.preventDefault();
                onChange(f);
                setOpen(false);
              }}
              className={cn(
                "cursor-pointer px-3 py-2 text-foreground transition-colors",
                i === highlighted ? "bg-accent" : "hover:bg-accent/50",
              )}
              onPointerEnter={() => setHighlighted(i)}
            >
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FieldOfStudyStep({ onNext }: { onNext: () => void }) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = (fieldsOfStudy as string[]).includes(value);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      setError("Please select a valid field of study from the list.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await saveFieldOfStudy(value);
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-3xl bg-card dark:bg-zinc-900 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-none dark:border dark:border-white/20 p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          What are you studying?
        </h1>
        <p className="text-sm text-muted-foreground">
          We use this to surface relevant decks and connect you with students in
          your program.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Field of study</Label>
          <FieldOfStudyInput value={value} onChange={setValue} />
        </div>

        {error && (
          <p className="text-sm text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pending || !isValid}>
          {pending ? "Saving…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
