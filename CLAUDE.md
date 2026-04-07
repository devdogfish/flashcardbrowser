# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev        # Start development server
bun build      # Build for production
bun start      # Start production server
bun lint       # Run ESLint
```

## Architecture

Next.js 15 App Router project (frontend-only, no API routes or database).

**Key directories:**
- `app/` — Root layout and main page (`page.tsx` owns all flashcard state)
- `components/` — Feature components (`flashcard.tsx`, `session-complete.tsx`, `dust-overlay.tsx`) plus `ui/` (shadcn/ui components)
- `config/overlay.ts` — Overlay variant definitions
- `hooks/` — `use-mobile.ts`, `use-toast.ts`
- `lib/utils.ts` — `cn()` class utility (clsx + tailwind-merge)
- `public/` — Static assets including `.mp3` audio files and SVG background overlays

**Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`. Theme uses OKLCH color variables in `styles/globals.css`. Use `cn()` from `lib/utils.ts` for class composition.

**Animations:** `motion/react` (Framer Motion). Cards use spring physics, tilt-on-hover, and camera-shake effects.

**Audio:** Web Audio API with pre-loaded buffers. Audio files live in `public/`. Managed via `useRef` in `page.tsx`.

**Components:** shadcn/ui (new-york style, neutral base, Lucide icons). Add new shadcn components with `bunx --bun shadcn@latest add <component>`.

**TypeScript:** `ignoreBuildErrors: true` in `next.config.mjs` — build errors won't block deployment.
