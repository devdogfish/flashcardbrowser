-- Migrate ReviewResult enum: replace CORRECT/INCORRECT with FORGOT/HARD/GOOD/EASY

-- Step 1: rename existing enum
ALTER TYPE "ReviewResult" RENAME TO "ReviewResult_old";

-- Step 2: create new enum with FSRS grades
CREATE TYPE "ReviewResult" AS ENUM ('FORGOT', 'HARD', 'GOOD', 'EASY');

-- Step 3: migrate column data (CORRECT → GOOD, INCORRECT → FORGOT)
ALTER TABLE "FlashcardUsage"
  ALTER COLUMN "result" TYPE "ReviewResult"
  USING (
    CASE "result"::text
      WHEN 'CORRECT'   THEN 'GOOD'::"ReviewResult"
      WHEN 'INCORRECT' THEN 'FORGOT'::"ReviewResult"
    END
  );

-- Step 4: drop old enum
DROP TYPE "ReviewResult_old";

-- Add desiredRetention to UserSettings
ALTER TABLE "UserSettings" ADD COLUMN "desiredRetention" DOUBLE PRECISION NOT NULL DEFAULT 0.9;

-- Create CardSchedule table
CREATE TABLE "CardSchedule" (
    "id"             TEXT NOT NULL,
    "userId"         TEXT NOT NULL,
    "cardId"         TEXT NOT NULL,
    "stability"      DOUBLE PRECISION NOT NULL,
    "difficulty"     DOUBLE PRECISION NOT NULL,
    "nextDue"        TIMESTAMP(3) NOT NULL,
    "reviewCount"    INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),

    CONSTRAINT "CardSchedule_pkey" PRIMARY KEY ("id")
);

-- Unique constraint: one schedule per user per card
CREATE UNIQUE INDEX "CardSchedule_userId_cardId_key" ON "CardSchedule"("userId", "cardId");

-- Index for fetching due cards
CREATE INDEX "CardSchedule_userId_nextDue_idx" ON "CardSchedule"("userId", "nextDue");

-- Foreign keys
ALTER TABLE "CardSchedule"
  ADD CONSTRAINT "CardSchedule_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CardSchedule"
  ADD CONSTRAINT "CardSchedule_cardId_fkey"
  FOREIGN KEY ("cardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
