export interface ErrorRow {
  code: string;
  message: string;
}

export function ErrorTable({ errors }: { errors: ErrorRow[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden mb-6">
      <div className="px-4 py-3 bg-muted/40 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Error codes</p>
      </div>
      <div className="divide-y divide-border/50">
        {errors.map(({ code, message }) => (
          <div key={code} className="flex items-center gap-4 px-4 py-3">
            <code className="text-xs font-mono font-bold text-destructive w-10 shrink-0">{code}</code>
            <span className="text-xs text-muted-foreground">{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
