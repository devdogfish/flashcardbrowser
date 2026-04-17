"use client";

import { useState, useEffect } from "react";
import { sendDalVerification } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerifyDalStep({ initialError }: { initialError?: string | null }) {
  const [dalEmail, setDalEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  useEffect(() => {
    if (initialError) {
      window.history.replaceState({}, "", "/onboarding");
    }
  }, [initialError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await sendDalVerification(dalEmail);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-card dark:bg-zinc-900 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-none dark:border dark:border-white/20 p-8 text-center space-y-3">
        <p className="text-lg font-medium">Check your Dal inbox</p>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to{" "}
          <span className="text-foreground font-medium">{dalEmail}</span>. Click
          it to complete setup.
        </p>
        <p className="text-xs text-muted-foreground">The link expires in 1 hour.</p>
        <button
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          onClick={() => {
            setSent(false);
            setDalEmail("");
          }}
        >
          Use a different address
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card dark:bg-zinc-900 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-none dark:border dark:border-white/20 p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Verify your Dal email
        </h1>
        <p className="text-sm text-muted-foreground">
          flashcardbrowser is for Dalhousie students. Link your{" "}
          <span className="text-foreground">@dal.ca</span> email to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dal-email">Dal email address</Label>
          <Input
            id="dal-email"
            type="email"
            placeholder="bXXXXXXX@dal.ca"
            value={dalEmail}
            onChange={(e) => setDalEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-sm text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send verification link"}
        </Button>
      </form>
    </div>
  );
}
