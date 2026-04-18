"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { DocSection } from "@/components/docs/sections";

export function DocsSidebar({ sections }: { sections: DocSection[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headingEls = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headingEls.length === 0) return;

    const visibleIds = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        }
        for (const { id } of sections) {
          if (visibleIds.has(id)) {
            setActiveId(id);
            window.history.replaceState(null, "", `#${id}`);
            return;
          }
        }
      },
      { rootMargin: "-10% 0px -70% 0px" },
    );

    for (const el of headingEls) {
      observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav>
      <div className="flex flex-col">
        {sections.map(({ id, title, depth }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={cn(
                "block py-1 text-xs leading-snug transition-colors duration-150",
                depth === 2 ? "pl-0" : "pl-3",
                depth === 2 && "mt-3 first:mt-0",
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
