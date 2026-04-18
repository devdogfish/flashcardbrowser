# AI Flashcard Generation — Implementation Plan

## Overview

Students upload documents (PDFs, DOCX, images) and get a full deck of flashcards generated from the content. The flow is: **upload → extract → generate → review/edit → save**. One screen, no wizard, no multi-step friction.

---

## Model & Platform

| Role | Model | Platform | Why |
|------|-------|----------|-----|
| **Text → Flashcards** | `google/gemma-4-31b-it:free` | OpenRouter | 262K context, structured JSON output via `response_format`, 6 providers with auto-failover, no prompt logging |
| **Image → Description** | `google/gemma-4-31b-it:free` | OpenRouter | Same model, natively accepts images as base64. Used to describe standalone images for card attribution or deck cover suggestions |
| **Fallback (both)** | `google/gemma-4-26b-a4b-it:free` | OpenRouter | 7 providers, MoE (faster), same capabilities. Auto-switch if primary is down |

**Integration**: OpenRouter is OpenAI-compatible. Use `@ai-sdk/openai` with a custom base URL. Replace the existing `lib/ai.ts` Google provider.

```ts
// lib/ai.ts
import { createOpenAI } from "@ai-sdk/openai";

export const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const PRIMARY_MODEL = "google/gemma-4-31b-it:free";
export const FALLBACK_MODEL = "google/gemma-4-26b-a4b-it:free";
```

**Rate limits**: 20 req/min, 1,000 req/day (with $10 lifetime credit purchase on OpenRouter, otherwise 50/day).

---

## Document Processing Pipeline

Since OpenRouter models cannot read raw files, we need server-side text extraction before sending to the model.

### Step 1: Upload

- User drops or selects files via a drag-and-drop zone (reuse the pattern from `cover-image-upload.tsx`)
- Files go to a **server action** (not an API route) — keeps it consistent with the rest of the app
- Accepted types: `.pdf`, `.docx`, `.doc`, `.txt`, `.md`, `.png`, `.jpg`, `.jpeg`, `.webp`
- Max file size: 10MB per file, 1 file at a time (keep it simple for v1)
- File is stored temporarily in memory (Buffer) — not persisted to Blob unless it's an image that becomes a card image or deck cover

### Step 2: Extract Text

| File Type | Library | Output |
|-----------|---------|--------|
| PDF | `pdf-parse` | Plain text string, page-separated |
| DOCX/DOC | `mammoth` | Plain text (HTML stripped) |
| TXT/MD | None | Read as UTF-8 string directly |
| Images | OpenRouter vision model | One-line semantic description |

**New dependencies**: `pdf-parse`, `mammoth`

For **images** — we send the image as base64 to Gemma 4 31B vision with the prompt:
> "Describe this image in one sentence. Be specific about the subject matter and any labels, diagrams, or data shown."

This description is used to:
1. Suggest the image as a deck cover (if it looks like a title slide or topic image)
2. Attribute the image to relevant generated flashcards via semantic matching
3. Include the description in the text context so the model can reference visual content

### Step 3: Generate Flashcards

Single call to `generateObject()` with the extracted text and a Zod schema.

```ts
import { generateObject } from "ai";
import { z } from "zod";
import { openrouter, PRIMARY_MODEL } from "@/lib/ai";

const flashcardSetSchema = z.object({
  deckTitle: z.string().describe("A concise title for this deck based on the content"),
  deckDescription: z.string().describe("1-2 sentence description of what this deck covers"),
  suggestedCoverDescription: z.string().optional().describe("If any uploaded image suits a deck cover, describe which one"),
  cards: z.array(z.object({
    question: z.string().describe("Clear, specific question"),
    answer: z.string().describe("Concise but complete answer"),
    relatedImageIndex: z.number().optional().describe("Index of the uploaded image most relevant to this card, if any"),
  })).min(1).max(50),
});

const result = await generateObject({
  model: openrouter(PRIMARY_MODEL),
  schema: flashcardSetSchema,
  messages: [
    {
      role: "system",
      content: FLASHCARD_SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: `Generate flashcards from the following document content:\n\n${extractedText}`,
    },
  ],
});
```

**System prompt** (stored as a constant):
```
You are a flashcard generator for university students. Given document content, create high-quality flashcards that test understanding, not just recall.

Rules:
- Create between 10-50 cards depending on content density
- Vary question types: definitions, comparisons, cause-effect, application, "why" questions
- Questions should be specific and unambiguous
- Answers should be concise (1-3 sentences) but complete
- Do NOT create trivial questions like "What is the title of this document?"
- Do NOT repeat the same concept in multiple cards
- If the content is too short or vague, create fewer but higher quality cards
- Suggest a deck title and description based on the content
```

### Step 4: Image Attribution

After generation, if the user uploaded images alongside documents:
1. Each card may have a `relatedImageIndex` pointing to an uploaded image
2. The model also suggests which image (if any) would work as the deck cover via `suggestedCoverDescription`
3. Images are uploaded to Vercel Blob only after the user confirms (saves storage)

---

## UI Design

### Entry Point

A single "Generate with AI" button on the deck creation page, or as a new option in the existing deck creation flow. This sits alongside the existing manual "Create Deck" form — not replacing it.

Two possible entry points:
- **Option A**: New tab/toggle on the deck creation page: "Create manually" | "Generate from document"
- **Option B**: Standalone page at `/generate`

**Recommendation: Option A** — keeps everything in one place, no new routes, less navigation.

### Screen Flow (Single Page)

The entire flow lives in one component with three visual states. No page transitions, no router changes.

#### State 1: Upload

```
┌─────────────────────────────────────────────┐
│                                             │
│     ┌─────────────────────────────────┐     │
│     │                                 │     │
│     │   Upload your study material    │     │
│     │                                 │     │
│     │     [  Drop files here  ]       │     │
│     │     or click to browse          │     │
│     │                                 │     │
│     │   PDF, DOCX, TXT, images        │     │
│     │                                 │     │
│     └─────────────────────────────────┘     │
│                                             │
│               [ Generate ]                  │
│                                             │
└─────────────────────────────────────────────┘
```

- Drag-and-drop zone, full width, generous click target
- Shows file name + size after selection with an X to remove
- "Generate" button activates once a file is selected
- Accepts one file at a time (v1 simplicity)

#### State 2: Generating (Loading)

```
┌─────────────────────────────────────────────┐
│                                             │
│          Generating flashcards...           │
│          ───────────── (spinner)             │
│                                             │
│     Reading your document and creating      │
│     cards. This takes 10-30 seconds.        │
│                                             │
└─────────────────────────────────────────────┘
```

- Simple centered spinner with text
- No progress bar (we don't know %)
- Subtle animation — maybe the spinner uses the app's spring physics
- User can't navigate away (or if they do, generation is lost — that's fine for v1)

#### State 3: Review & Save

```
┌─────────────────────────────────────────────┐
│                                             │
│  Title: [Intro to Cell Biology        ]     │
│  Description: [Covers cell structure...]    │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ Cover Image                         │   │
│  │ [suggested image or upload zone]     │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  24 cards generated                         │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ Q: What is the primary function...  │   │
│  │ A: The mitochondria produces ATP... │   │
│  │                          [Edit] [X] │   │
│  ├──────────────────────────────────────┤   │
│  │ Q: Compare prokaryotic and...       │   │
│  │ A: Prokaryotic cells lack a...      │   │
│  │                          [Edit] [X] │   │
│  ├──────────────────────────────────────┤   │
│  │ ...                                 │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  [ Regenerate ]            [ Save Deck ]    │
│                                             │
└─────────────────────────────────────────────┘
```

- **Title and description** are pre-filled from the model's suggestion, editable inline
- **Cover image**: if an uploaded image was suggested as a cover, show it. Otherwise show the existing `CoverImageUpload` component
- **Card list**: scrollable, each card shows Q and A in a compact row
  - **Edit**: inline editing — click Edit, fields become editable inputs, click Save
  - **Delete (X)**: removes the card with a subtle fade-out animation
  - Cards with associated images show a small thumbnail
- **Regenerate**: goes back to State 2, re-runs generation with the same file
- **Save Deck**: creates the deck and all cards in a single server action, redirects to the deck page

### Visual Style

Follows the brand exactly:
- No decorative elements, no step indicators, no progress trackers
- Geist for all UI text
- `border-dashed border-border` for the drop zone (matches `cover-image-upload.tsx` pattern)
- Subtle spring animations on card list items appearing (staggered entry)
- `text-muted-foreground` for secondary text
- Buttons use existing shadcn `Button` component

---

## File Structure

```
lib/
  ai.ts                          # OpenRouter provider setup (replace Google)
  document-extract.ts            # Text extraction: PDF, DOCX, TXT, images
  flashcard-generate.ts          # generateObject call + schema + prompt

app/
  actions.ts                     # Add: generateFlashcardsFromDocument server action

components/
  generate-deck.tsx              # Main component: upload → generate → review → save
  generate-deck-card-list.tsx    # Card review list with edit/delete
  generate-deck-card-row.tsx     # Individual card row with inline editing
  document-upload.tsx            # Drag-and-drop file upload zone
```

---

## Server Action

Single server action in `app/actions.ts`:

```ts
export async function generateFlashcardsFromDocument(formData: FormData) {
  // 1. Get file from formData
  // 2. Determine file type
  // 3. Extract text (pdf-parse / mammoth / direct read / vision)
  // 4. Call generateObject with extracted text
  // 5. Return { deckTitle, deckDescription, cards, suggestedCover }
}
```

Separate action for saving:

```ts
export async function saveDeckFromGeneration(data: {
  title: string;
  description: string;
  coverImage: string | null;
  visibility: "PRIVATE" | "PUBLIC";
  cards: { question: string; answer: string; imageUrl?: string }[];
}) {
  // 1. Create Deck
  // 2. Create all Flashcards with position indices
  // 3. Upload any associated images to Vercel Blob
  // 4. Redirect to the new deck page
}
```

---

## Dependencies to Install

```bash
bun add pdf-parse mammoth @ai-sdk/openai
```

(`@ai-sdk/openai` may already be available through the `ai` package — check before installing separately)

---

## Environment Variables

```
OPENROUTER_API_KEY=sk-or-...
```

Add to `.env.example` and Vercel dashboard.

---

## Error Handling

- **File too large**: Client-side check before upload. Show inline error under the drop zone.
- **Unsupported file type**: Client-side check on file extension and MIME type.
- **Model rate limited (429)**: Catch in server action, try fallback model. If fallback also fails, return a user-friendly message: "Too many people are generating right now. Try again in a minute."
- **Model down**: Same fallback pattern. If both models fail, surface the error.
- **Empty/unreadable document**: If text extraction returns < 50 characters, show: "We couldn't read enough content from this file. Try a different format."
- **Generation returns low-quality cards**: The review step handles this — user deletes bad cards. Regenerate button lets them try again.

---

## Scope for v1

**In scope:**
- Single file upload (PDF, DOCX, TXT, MD, images)
- Text extraction + AI generation
- Review/edit/delete cards before saving
- Auto-suggested deck title and description
- Image semantic labeling (for card attribution and cover suggestion)
- Fallback model on failure

**Out of scope (future):**
- Multi-file upload
- Streaming card generation
- Custom card count selection
- Difficulty level control
- Re-generation of individual cards
- Sharing generated decks immediately
- Usage tracking / generation history
- Batch operations (generate multiple decks)

---

## Implementation Order

1. **`lib/ai.ts`** — Replace Google provider with OpenRouter setup
2. **`lib/document-extract.ts`** — Text extraction for PDF, DOCX, TXT, images
3. **`lib/flashcard-generate.ts`** — Schema, prompt, generateObject call
4. **`components/document-upload.tsx`** — Drag-and-drop upload zone
5. **`app/actions.ts`** — Server actions for generate + save
6. **`components/generate-deck-card-row.tsx`** — Individual card with inline edit
7. **`components/generate-deck-card-list.tsx`** — Scrollable card list
8. **`components/generate-deck.tsx`** — Main orchestrator component (3 states)
9. **Integration** — Wire into deck creation page as a tab/toggle
10. **Testing** — Manual testing with real PDFs, DOCX files, and images
