# Plan: FSRS Algorithm Implementation

## Overview

The algorithm itself is pure math — no DB, no React. It should live in a single file
(`lib/fsrs.ts`) and be called from the server action layer. This keeps the core logic
testable and framework-independent.

---

## File: `lib/fsrs.ts` (new)

This is the entire FSRS algorithm ported to TypeScript. Pure functions, no side effects,
no imports from anywhere in the app.

### Constants

```typescript
const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046,
  1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315,
  2.9898, 0.51655, 0.6621,
] as const

const F = 19 / 81
const C = -0.5
```

### Types

```typescript
export type Grade = 'forgot' | 'hard' | 'good' | 'easy'

export interface CardState {
  stability: number   // S: days until R = 0.9
  difficulty: number  // D: [1, 10]
}

export interface ScheduleResult extends CardState {
  nextInterval: number  // days until next review (integer, min 1)
  retrievability: number // R at time of review (0-1)
}
```

### Core Functions (exported)

```typescript
// Probability of recall given t days since last review and stability S
export function retrievability(t: number, s: number): number

// Days until next review given desired retention and current stability
export function interval(desiredRetention: number, s: number): number

// Full schedule computation after a review
// - If reviewCount === 0: first review, uses s0/d0
// - Otherwise: uses stability/difficulty update formulas
// Returns new CardState + next interval
export function schedule(
  state: CardState | null,  // null = never reviewed
  daysSinceLastReview: number,
  grade: Grade,
  desiredRetention: number = 0.9
): ScheduleResult

// Compute next interval for each grade given current state
// Used to show interval previews on the rating buttons
export function previewIntervals(
  state: CardState | null,
  daysSinceLastReview: number,
  desiredRetention: number = 0.9
): Record<Grade, number>
```

### Internal Functions (not exported)

```typescript
function gradeToNumber(grade: Grade): number  // forgot=1, hard=2, good=3, easy=4
function clampD(d: number): number             // clamp to [1, 10]
function s0(grade: Grade): number              // initial stability from W[0-3]
function d0(grade: Grade): number              // initial difficulty
function sSuccess(d, s, r, grade): number      // stability update on recall
function sFail(d, s, r): number                // stability update on forget
function updateDifficulty(d, grade): number    // difficulty update for nth review
```

---

## File: `lib/spaced-repetition.ts` (replace)

Currently exports `getFamiliarity`, `getDueDate`, `getStreak`. After FSRS ships:

- `getFamiliarity` and `getDueDate` are deleted (replaced by `lib/fsrs.ts`)
- `getStreak` can stay as-is (it's independent of the scheduling algorithm)

---

## Server Action: `app/actions.ts` — update `recordUsage`

The existing signature:

```typescript
export async function recordUsage(cardId: string, correct: boolean)
```

Replace with:

```typescript
export async function recordUsage(cardId: string, grade: Grade)
```

**What the updated action does:**

1. Get current user session
2. Load existing `CardSchedule` for (userId, cardId) if it exists
3. Compute `daysSinceLastReview`:
   - If no schedule: `0` (first review)
   - Otherwise: `(now - lastReviewedAt) / 86400000`
4. Call `schedule(currentState, daysSinceLastReview, grade, desiredRetention)`
5. Upsert `CardSchedule` with new stability, difficulty, nextDue, reviewCount+1, lastReviewedAt=now
6. Insert `FlashcardUsage` row with the grade as ReviewResult enum value
7. Return void (same as before)

`desiredRetention` comes from `userSettings.desiredRetention` (default 0.9 if not set).

---

## Study Page Query: `app/study/page.tsx` — update data fetching

Currently fetches `FlashcardUsage` and computes familiarity client-side. Replace with:

```typescript
// Fetch cards with their CardSchedule joined
const cards = await prisma.flashcard.findMany({
  where: { deckId: { in: deckIds } },
  include: {
    schedules: {
      where: { userId: session.user.id },
      take: 1,
    },
  },
  orderBy: { position: 'asc' },
})

// Map to CardData
const cardData = cards.map(card => {
  const schedule = card.schedules[0] ?? null
  return {
    id: card.id,
    question: card.question,
    answer: card.answer,
    image: card.imageUrl ?? undefined,
    stability: schedule?.stability ?? null,
    difficulty: schedule?.difficulty ?? null,
    nextDue: schedule?.nextDue ?? null,
    reviewCount: schedule?.reviewCount ?? 0,
  }
})

// Sort: due/overdue first, then new cards (no schedule)
const now = new Date()
cardData.sort((a, b) => {
  const aDue = !a.nextDue || a.nextDue <= now
  const bDue = !b.nextDue || b.nextDue <= now
  if (aDue && !bDue) return -1
  if (!aDue && bDue) return 1
  if (a.nextDue && b.nextDue) return a.nextDue.getTime() - b.nextDue.getTime()
  return 0
})
```

---

## Component: `components/flashcard.tsx` — update result handler and UI

### Prop change

```typescript
// Before
onResult: (correct: boolean) => void

// After
onResult: (grade: Grade) => void
```

### Rating button UI

After the card is flipped, show 4 buttons instead of 2. Each button displays the
grade label and the projected next interval (computed via `previewIntervals()`).

The intervals are passed in as a prop from `study-page.tsx` so the flashcard component
stays pure (no algorithm calls inside it):

```typescript
interface FlashcardProps {
  // ... existing props minus familiarity
  onResult: (grade: Grade) => void
  nextIntervals?: Record<Grade, number>  // days, for preview labels
}
```

Example button layout (shown after flip):

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Forgot  │ │   Hard   │ │   Good   │ │   Easy   │
│  1 day   │ │  3 days  │ │ 12 days  │ │ 38 days  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### Keyboard shortcuts

```
1 / ↓ / J  →  Forgot
2           →  Hard
3 / ↑ / K  →  Good
4           →  Easy
```

---

## Component: `components/study-page.tsx` — update result handler

```typescript
// Before
const handleResult = async (correct: boolean) => {
  await recordUsage(card.id, correct)
  // track wrong cards: !correct
}

// After
const handleResult = async (grade: Grade) => {
  await recordUsage(card.id, grade)
  // track wrong cards: grade === 'forgot'
}
```

Also compute `nextIntervals` for the current card and pass to `Flashcard`:

```typescript
const currentCard = activeCards[currentIndex]
const currentState = currentCard.stability !== null
  ? { stability: currentCard.stability, difficulty: currentCard.difficulty! }
  : null
const daysSince = currentCard.nextDue
  ? (Date.now() - new Date(currentCard.nextDue).getTime() - currentCard.stability! * 86400000) / 86400000
  : 0
const nextIntervals = previewIntervals(currentState, daysSince, 0.9)
```

---

## File Organization Summary

```
lib/
  fsrs.ts              ← NEW: pure FSRS algorithm
  spaced-repetition.ts ← MODIFIED: remove familiarity/dueDate, keep getStreak
  db.ts                ← unchanged
  auth.ts              ← unchanged

app/
  actions.ts           ← MODIFIED: recordUsage grade param + CardSchedule upsert
  study/page.tsx       ← MODIFIED: query CardSchedule, new sort logic

components/
  flashcard.tsx        ← MODIFIED: 4 grade buttons, new onResult prop, interval previews
  study-page.tsx       ← MODIFIED: handleResult grade, pass nextIntervals to Flashcard
  session-complete.tsx ← MINOR: update labels

prisma/
  schema.prisma        ← MODIFIED: add CardSchedule, update ReviewResult enum, add desiredRetention
  migrations/          ← NEW migration for above
```

---

## Implementation Order

1. `lib/fsrs.ts` — write and verify against the article's simulator output
2. `prisma/schema.prisma` — add CardSchedule, update enum
3. Run migration, update Prisma client
4. `app/actions.ts` — update `recordUsage`
5. `app/study/page.tsx` — update query + CardData type
6. `components/study-page.tsx` — update handleResult, compute nextIntervals
7. `components/flashcard.tsx` — 4-button UI, new prop, keyboard shortcuts
8. `components/session-complete.tsx` — label updates
9. `lib/spaced-repetition.ts` — remove obsolete exports
10. `app/shortcuts/page.tsx` — update docs

---

## Notes

- **No FSRS state in the client.** All scheduling math happens server-side in the action
  (or at query time). The client only calls `previewIntervals` for UI previews, which is
  a pure read with no side effects.
- **`previewIntervals` in the client** requires importing `lib/fsrs.ts` into a client
  component. Since it has no Node-only imports, this is fine in Next.js 15.
- **Desired retention** defaults to 0.9 everywhere until the settings UI is built.
  The `UserSettings.desiredRetention` field can be wired in as a follow-up.
- **Backward compatibility:** The old `FlashcardUsage` rows (CORRECT/INCORRECT) don't
  affect FSRS since the algorithm only reads `CardSchedule`, not usage history.
