import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  backHref?: string;
  backLabel?: string;
  subtitle?: string;
  action?: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export function PageLayout({
  children,
  title,
  backHref,
  backLabel = "Back",
  subtitle,
  action,
  maxWidth = "max-w-2xl",
  className,
}: PageLayoutProps) {
  return (
    <main className={cn("min-h-svh px-5 py-16 mx-auto", maxWidth, className)}>
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </Link>
      )}

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {action}
      </div>

      {children}
    </main>
  );
}
