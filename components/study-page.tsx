"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Keyboard } from "lucide-react"
import { Flashcard } from "@/components/flashcard"
import { SessionComplete } from "@/components/session-complete"
import { UserMenu } from "@/components/user-menu"

interface CardData {
  id: string
  question: string
  answer: string
  image?: string
  familiarity: number
}

interface StudyPageProps {
  userName: string
  userEmail: string
  userImage?: string | null
  cards: CardData[]
  deckTitle?: string
}

export function StudyPage({ userName, userEmail, userImage, cards, deckTitle }: StudyPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [lastWhoosh, setLastWhoosh] = useState<number | null>(null)

  const handleResult = useCallback((correct: boolean) => {
    if (correct) {
      setCorrectCount((prev) => prev + 1)
    }

    if (currentIndex + 1 >= cards.length) {
      setTimeout(() => setIsComplete(true), 100)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, cards.length])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setCorrectCount(0)
    setIsComplete(false)
  }, [])

  const handleSkip = useCallback(() => {
    if (currentIndex + 1 >= cards.length) {
      setTimeout(() => setIsComplete(true), 100)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, cards.length])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const currentCard = cards[currentIndex]

  // DEBUG: cycle cards to test entry animation
  const handleDebugNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }, [cards.length])

  return (
    <main className="h-svh flex items-center justify-center">
      <Link
        href="/shortcuts"
        className="fixed bottom-6 left-6 z-50 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard size={18} />
      </Link>

      <UserMenu userName={userName} userEmail={userEmail} userImage={userImage} />

      {/* DEBUG BUTTONS — remove when done */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <button
          onClick={() => setIsComplete(true)}
          className="bg-black text-white text-xs font-mono px-3 py-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
        >
          final screen [debug]
        </button>
        <button
          onClick={handleDebugNext}
          className="bg-black text-white text-xs font-mono px-3 py-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
        >
          next card [debug]
        </button>
        {lastWhoosh !== null && (
          <span className="bg-black text-white text-xs font-mono px-3 py-2 rounded-lg opacity-60">
            whoosh {lastWhoosh}
          </span>
        )}
      </div>
      {isComplete ? (
        <SessionComplete
          correctCount={correctCount}
          totalCards={cards.length}
          onRestart={handleRestart}
        />
      ) : (
        <Flashcard
          question={currentCard.question}
          answer={currentCard.answer}
          image={currentCard.image}
          familiarity={currentCard.familiarity}
          currentIndex={currentIndex}
          totalCards={cards.length}
          onResult={handleResult}
          onSkip={handleSkip}
          onPrev={handlePrev}
          onWhooshPlayed={setLastWhoosh}
        />
      )}
    </main>
  )
}
