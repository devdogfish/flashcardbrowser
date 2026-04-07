# Auth Integration Plan

## Context

Better Auth is installed and configured (`lib/auth.ts`, `lib/auth-client.ts`, `lib/db.ts`, route handler, auth pages). The Prisma schema has `User`, `Session`, `Account`, `Verification` tables migrated. But nothing in the app actually **uses** auth yet — `app/page.tsx` is a client component with hardcoded sample flashcards, no session checks, no user indicator, and no sign-out.

**Goal:** Wire the auth system into the existing app so unauthenticated users are redirected to `/sign-in`, and signed-in users see a user menu with sign-out.

---

## Key Findings

- `app/page.tsx` — `'use client'`, renders `StudyPage` with hardcoded `SAMPLE_CARDS`. Fullscreen card-centric layout, no header/nav. Bottom-left has a `Link` to `/shortcuts` with keyboard icon. Top-right corner is unused.
- `app/layout.tsx` — Server component. Renders `DustOverlay` + `{children}`. No global header.
- `app/(auth)/layout.tsx` — Separate layout for auth pages (centered).
- `components/ui/` — Full shadcn kit including `avatar.tsx`, `dropdown-menu.tsx` (ready to use).
- No user-scoped data fetching exists — protecting the route is purely access-control for now.

---

## Approach

### 1. Split `app/page.tsx` into server + client components

**Why:** The page is currently `'use client'` which can't do server-side session checks. Split it so the server component handles auth gating.

- **`app/page.tsx`** (server component) — Calls `auth.api.getSession({ headers: await headers() })`. If no session, `redirect('/sign-in')`. Otherwise renders `<StudyPage />` and `<UserMenu />`, passing the user info as props.
- **`components/study-page.tsx`** (new, client component) — Move the existing `StudyPage` function + `SAMPLE_CARDS` + all the audio/state logic here verbatim. No changes to flashcard behavior.

### 2. Create `components/user-menu.tsx`

New client component. Fixed position top-right (mirrors the bottom-left keyboard shortcut link pattern).

- Uses shadcn `Avatar` + `DropdownMenu`
- Shows user initial/image
- Dropdown items: user name/email (display only) + "Sign out" button
- Sign out calls `signOut` from `lib/auth-client.ts` and redirects to `/sign-in`

### 3. Protect the `/shortcuts` page (if it exists)

Check `app/shortcuts/page.tsx` — if it exists, add the same server-side session gate.

---

## Files to modify

| File | Action |
|---|---|
| `app/page.tsx` | Rewrite as server component (auth gate + renders children) |
| `components/study-page.tsx` | **New** — existing `StudyPage` code moved here |
| `components/user-menu.tsx` | **New** — Avatar dropdown with sign-out |

---

## Verification

1. `bun dev` → visit `http://localhost:3000/`
2. **Unauthenticated:** should redirect to `/sign-in`
3. **Sign up** at `/sign-up` → check console/Resend for verification email → verify → auto sign-in
4. **Authenticated:** should see flashcard UI + user avatar top-right
5. **Click avatar** → dropdown with name/email + "Sign out"
6. **Sign out** → redirects to `/sign-in`
7. **Visit `/sign-in` while authenticated** → should still work (no redirect loop)
