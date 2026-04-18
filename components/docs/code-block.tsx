"use client";

import { CopyButton } from "@/components/docs/copy-button";

export function CodeBlock({ label, code }: { label?: string; code: string }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
        {label ? (
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {label}
          </span>
        ) : (
          <span />
        )}
        <CopyButton text={code} />
      </div>
      <pre className="px-4 py-4 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/80 bg-muted/20">
        {code}
      </pre>
    </div>
  );
}
