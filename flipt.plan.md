# Flipt — Build Plan

## Current State

- Auth (Better Auth) — sign in / sign up working
- `/decks` — browse public + private decks, search, multi-select, favorites (toggle not yet wired)
- `/study?decks=` — full flashcard study session with animations and audio
- DB schema complete: User, Deck, Flashcard, FlashcardUsage, DeckFavorite, UserSettings
- Upload API (`/api/upload`) using Vercel Blob — done, not wired to UI
- Debug buttons still present in `study-page.tsx`

---

## Phase 1 — Polish & Wire Existing Plumbing

These are small wins that finish work already started.

### 1.1 Remove debug buttons from StudyPage
`components/study-page.tsx` has hardcoded debug buttons. Remove them before any further work.

### 1.2 Wire favorite toggle
`DeckCard` shows a star but `DeckFavorite` mutations aren't wired. Add a server action or API route to toggle favorites and call it from `DeckSelection`.

### 1.3 Record FlashcardUsage
`StudyPage` knows correct/incorrect per card but never writes to `FlashcardUsage`. Add a server action that records each result as cards are answered.

### 1.4 Wire cover image upload
`cover-image-upload.tsx` and `/api/upload` exist but aren't connected to any deck form. This unblocks deck creation (Phase 2).

---

## Phase 2 — Deck Management (CRUD)

Users can browse decks but cannot create or edit their own.

### 2.1 Create deck
- Page: `/decks/new`
- Fields: title, description, visibility (private/public), cover image (uses existing upload endpoint)
- Server action: `createDeck` → `prisma.deck.create`

### 2.2 Edit deck
- Page: `/decks/[id]/edit`
- Same form as create, pre-populated
- Server action: `updateDeck`
- Guard: only the owner can edit

### 2.3 Delete deck
- Confirm dialog, then server action: `deleteDeck`
- Cascades to cards via Prisma `onDelete: Cascade`

### 2.4 Card management
- Inline card list on the edit page (no separate route needed)
- Add / edit / delete cards with question, answer, optional image URL
- Reorder via drag-and-drop (updates `position` field)

### 2.5 Deck detail page (`/decks/[id]`)
- Shows deck info, card list preview, and a "Study this deck" button
- Linked from `DeckCard`

---

## Phase 3 — Spaced Repetition & Progress

Make studying meaningful using the `FlashcardUsage` data written in Phase 1.3.

### 3.1 Familiarity score
Compute per-card familiarity from recent `FlashcardUsage` records (e.g. last 5 reviews, weighted). Pass real values to `Flashcard` instead of always `0`.

### 3.2 "Due" card queue
Surface cards the user hasn't reviewed recently or has gotten wrong, prioritised in the study session. Simple SM-2-inspired scoring is enough.

### 3.3 Deck stats on detail page
- % mastered (familiarity ≥ threshold)
- Cards due
- Total reviews, streak

### 3.4 Session complete screen improvements
Replace "study again" with smarter options:
- Study wrong answers only
- Study due cards
- Study full deck

---

## Phase 4 — User Settings

`UserSettings` exists in the schema but isn't surfaced anywhere.

### 4.1 Theme preference
- Toggle in `UserMenu`: System / Light / Dark
- Read on page load, apply via `ThemeProvider`
- Persist via server action

### 4.2 Settings page (`/settings`)
- Theme selector
- Display name / avatar (via Better Auth `updateUser`)

---

## Phase 5 — Deck Discovery & Social

### 5.1 Public deck page
Unauthenticated users can view a public deck's cards (read-only) and a "Sign up to study" CTA.

### 5.2 Copy / fork a public deck
Add a "Copy to my decks" action on public decks — clones the deck and all cards to the viewer's account as private.

### 5.3 Deck sorting and filtering
On `/decks`, add sort options (newest, most cards, alphabetical) and a filter for visibility.

---

## Phase 6 — Mobile & Polish

### 6.1 Responsive deck editor
Card management UI (Phase 2.4) needs a usable mobile layout.

### 6.2 PWA / installable
Add `manifest.json` and service worker for installable mobile experience.

### 6.3 Keyboard shortcut help
`/shortcuts` page exists — verify it's complete and accurate for all actions.

---

## Sequencing

```
Phase 1  →  Phase 2  →  Phase 3
                ↓
           Phase 4 (can run in parallel with Phase 3)
                ↓
           Phase 5  →  Phase 6
```

Phase 1 should be completed before anything else — it removes tech debt and enables Phase 2. Phase 3 depends on Phase 1.3 (usage recording). Phases 4–6 are independent of each other once Phase 2 is done.

---

## Open Questions

- **Image hosting**: Vercel Blob is wired. Should card images also support Blob uploads, or just URL input for now?
- **Spaced repetition algorithm**: Full SM-2 or a simpler approximation?
- **Public deck moderation**: Should admins be able to hide public decks?
- **Email verification**: Better Auth supports it — required before publishing a deck?
