"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Keyboard } from "lucide-react"
import { Flashcard } from "@/components/flashcard"
import { SessionComplete } from "@/components/session-complete"

// Sample flashcard data with images and familiarity
const SAMPLE_CARDS = [
  {
    id: 1,
    question: "What is the average path length of a network?",
    answer: "The average shortest path between all pairs of nodes, measuring how efficiently information travels through the network.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    category: "Network Basics",
    familiarity: 75,
  },
  {
    id: 2,
    question: "What defines a scale-free network?",
    answer: "A network whose degree distribution follows a power law — a few nodes have many connections while most have few.",
    category: "Network Types",
    familiarity: 45,
  },
  {
    id: 3,
    question: "What is the clustering coefficient?",
    answer: "A measure of how much nodes tend to cluster together, representing local connectivity density.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    category: "Metrics",
    familiarity: 20,
  },
  {
    id: 4,
    question: "What characterizes small-world networks?",
    answer: "High clustering with short average path lengths, enabling efficient local and global communication.",
    category: "Network Types",
    familiarity: 90,
  },
  {
    id: 5,
    question: "What is network centrality?",
    answer: "A measure identifying the most important nodes based on degree, betweenness, or closeness.",
    category: "Metrics",
    familiarity: 5,
  },
  {
    id: 6,
    question: "What is a hub in network theory?",
    answer: "A node with a significantly higher number of connections than average, often critical for network connectivity.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    category: "Concepts",
    familiarity: 60,
  },
  {
    id: 7,
    question: "What is network resilience?",
    answer: "The ability of a network to maintain functionality when nodes or edges are removed.",
    category: "Concepts",
    familiarity: 15,
  },
]

export default function StudyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [cards] = useState(SAMPLE_CARDS)
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
          category={currentCard.category}
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
