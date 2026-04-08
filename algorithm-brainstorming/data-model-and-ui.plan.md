# Plan: Data Model & UI Adjustments for FSRS

## Context

The current app uses a weighted familiarity score (0-100) derived from the last 5 reviews
(CORRECT | INCORRECT) to compute due dates in fixed brackets (1, 3, 7, 14 days). FSRS
replaces this with a continuous memory model requiring per-card state to be persisted
between sessions.

---

## Data Model Changes

### 1. New `CardSchedule` table (required)

FSRS needs to persist per-user, per-card scheduling state. This cannot be computed on
the fly from raw review history (unlike familiarity). A dedicated table is the right approach
so the Flashcard model stays deck-owned while schedule is user-owned.

```prisma
model CardSchedule {
  id             String    @id @default(cuid())
  userId         String
  cardId         String
  stability      Float     // S: days until R drops to 0.9
  difficulty     Float     // D: memory difficulty, range [1, 10]
  nextDue        DateTime  // when to show this card again
  reviewCount    Int       @default(0) // 0 = never reviewed; distinguishes first vs nth review
  lastReviewedAt DateTime?

  user  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  card  Flashcard @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@unique([userId, cardId])
}
```

**Why a separate table (not fields on Flashcard):** Flashcard is deck-owned; schedule is
user-owned. Multiple users studying the same public deck each need independent schedules.

### 2. Update `ReviewResult` enum (required)

FSRS uses a 4-point grade scale. The current binary CORRECT/INCORRECT must be replaced.

```prisma
// Before
enum ReviewResult {
  CORRECT
  INCORRECT
}

// After
enum ReviewResult {
  FORGOT  // grade 1
  HARD    // grade 2
  GOOD    // grade 3
  EASY    // grade 4
}
```

**Migration note:** Existing CORRECT rows map to GOOD; INCORRECT rows map to FORGOT.
Historical data is only used for the legacy familiarity display (which will be removed), so
the migration can be lossy — map CORRECT → GOOD and INCORRECT → FORGOT.

### 3. Add `desiredRetention` to `UserSettings` (optional, recommended)

FSRS uses a target retention rate (default 0.9 = 90%). Exposing this as a user setting
allows power users to tune the review frequency tradeoff.

```prisma
model UserSettings {
  // ... existing fields
  desiredRetention Float @default(0.9) // range [0.7, 0.97] is practical
}
```

### 4. Remove `familiarity` from query layer (required)

The computed `familiarity` field (currently computed in `lib/spaced-repetition.ts` and
passed as a prop through `CardData`) will be replaced by FSRS state. The `familiarity`
prop on `Flashcard` and `CardData` interfaces should be replaced with FSRS-derived values.

---

## Required Fields Summary

| Field | Location | Type | Notes |
|-------|----------|------|-------|
| `stability` | `CardSchedule` | `Float` | Core FSRS state |
| `difficulty` | `CardSchedule` | `Float` | Core FSRS state |
| `nextDue` | `CardSchedule` | `DateTime` | Replaces due-date brackets |
| `reviewCount` | `CardSchedule` | `Int` | Needed to distinguish first review |
| `lastReviewedAt` | `CardSchedule` | `DateTime?` | For retrievability calculation |
| `ReviewResult` enum | `FlashcardUsage` | enum | Expanded from 2 to 4 values |

## Optional Fields Summary

| Field | Location | Type | Notes |
|-------|----------|------|-------|
| `desiredRetention` | `UserSettings` | `Float` | Default 0.9, user-configurable |

---

## UI Changes

### 1. Flashcard rating buttons: 2 → 4 (required, `components/flashcard.tsx`)

Currently after flipping, the user sees: `[Incorrect]` `[Correct]`

FSRS requires a 4-point rating shown after the answer is revealed:

```
[Forgot]  [Hard]  [Good]  [Easy]
```

- **Forgot** — could not recall (red)
- **Hard** — recalled with significant effort (orange/amber)
- **Good** — recalled with normal effort (default/neutral)
- **Easy** — recalled instantly, no effort (green/emerald)

Each button should show the projected next interval beneath it so the user can see the
consequence of each rating. E.g.:

```
[Forgot]   [Hard]    [Good]    [Easy]
  1 day     3 days   12 days   38 days
```

These intervals are computed client-side from the FSRS `interval()` formula given current
S and D.

**Prop change:** `onResult(correct: boolean)` → `onResult(grade: 'forgot' | 'hard' | 'good' | 'easy')`

### 2. Keyboard shortcuts: update for 4 grades (required, `components/flashcard.tsx`)

Current shortcuts when flipped:
- `↑` / `K` → Correct
- `↓` / `J` → Incorrect

New shortcuts when flipped:
- `1` → Forgot
- `2` → Hard
- `3` → Good
- `4` → Easy

The numeric keys are conventional in FSRS-based apps (Anki uses them). Keep arrow keys
as aliases: `↑` → Good, `↓` → Forgot (preserves muscle memory for existing users).

Update `app/shortcuts/page.tsx` to reflect the new key bindings.

### 3. Remove familiarity indicator (required, `components/flashcard.tsx`)

The colored dot/badge showing familiarity (emerald ≥80, sky ≥60, amber ≥30, neutral <30)
is tied to the old 0-100 score and has no FSRS equivalent.

Replace with a small "due in X days" or retrievability % badge, or remove entirely. Keeping
the UI clean is preferred over showing raw FSRS internals.

### 4. Study page sorting & filtering (required, `app/study/page.tsx`)

Current logic:
1. Compute familiarity from last 5 reviews
2. Sort: due cards first (least familiar first), then non-due by familiarity

New logic:
1. Load `CardSchedule` for each card (join in query)
2. Cards with no `CardSchedule` (never studied) are always included
3. Sort: overdue/due cards first (by `nextDue` ascending), then new cards

The "due" concept becomes: `nextDue <= now()` (or no schedule exists yet).

### 5. Session complete screen (minor, `components/session-complete.tsx`)

Currently shows correct/incorrect counts. Update labels to reflect the 4-grade system:

- Keep correct/incorrect counts (Forgot = incorrect, Hard/Good/Easy = correct)
- Optionally add a breakdown: Forgot / Hard / Good / Easy counts

### 6. `CardData` interface update (required)

Threads through `app/study/page.tsx` → `components/study-page.tsx` → `components/flashcard.tsx`.

```typescript
// Before
interface CardData {
  id: string
  question: string
  answer: string
  image?: string
  familiarity: number  // 0-100
  due?: boolean
}

// After
interface CardData {
  id: string
  question: string
  answer: string
  image?: string
  // FSRS state (null = never reviewed)
  stability: number | null
  difficulty: number | null
  nextDue: Date | null
  reviewCount: number
}
```

---

## Migration Path

1. Add `CardSchedule` table via Prisma migration
2. Add `desiredRetention` to `UserSettings`
3. Migrate `ReviewResult` enum (CORRECT → GOOD, INCORRECT → FORGOT)
4. Deploy schema
5. Existing `FlashcardUsage` rows with old enum values: migrate in place
6. `CardSchedule` rows are created on first FSRS review — no backfill needed

---

## What Does NOT Change

- `Flashcard` model (question, answer, imageUrl, position) — untouched
- `Deck` model — untouched
- Auth, upload, favorites — untouched
- `FlashcardUsage` table still records every review (audit trail) — kept, enum updated
- The 3D flip animation, whoosh sounds, camera shake — untouched
