import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "How to make good flashcards — flashcardbrowser",
  description:
    "The principles behind effective flashcard design for long-term retention. Short, specific, and honest.",
};

const sections = [
  {
    id: "atomic",
    label: "The atomic rule",
    heading: "One card, one fact.",
    body: "Every card should test exactly one thing. If a card covers three facts and you remember two, the algorithm gets a noisy signal — it either over-schedules the forgotten fact or resets the ones you already know. When in doubt, split it.",
  },
  {
    id: "context",
    label: "Write specific questions",
    heading: `Avoid "What is X?" — start with "What does X do?" or "How does X differ from Y?"`,
    body: `Yes/No questions are weak — they give the algorithm a 50% baseline and teach you nothing useful. Add context to remove ambiguity: "In the Krebs cycle, what does..." instead of "What does..." Context triggers the right retrieval path.`,
  },
  {
    id: "understand",
    label: "Understand before you card",
    heading: "Read the chapter before you make the cards.",
    body: "Trying to memorize something you don't fully understand creates fragile memories that break under slightly different questions. Get the big picture of a section first, then extract cards from it. This order matters.",
  },
  {
    id: "templates",
    label: "Card types",
    heading: "Match the card type to the knowledge type.",
    subsections: [
      {
        name: "Basic Q&A",
        text: "Best for definitions, single facts, and anything with a clean right/wrong answer.",
      },
      {
        name: "Reverse cards",
        text: "For vocabulary or bidirectional associations — term→definition and definition→term. Builds stronger, more flexible recall.",
      },
      {
        name: "Process/pathway cards",
        text: "One card per step, plus one card for the overall sequence. Don't cram an entire pathway onto one card.",
      },
      {
        name: "Formula cards",
        text: "One card with the formula. One card per variable's meaning. Keep them separate.",
      },
    ],
  },
  {
    id: "subjects",
    label: "Subject-specific",
    heading: "Different subjects call for different card shapes.",
    subsections: [
      {
        name: "Programming",
        text: "Card language syntax, keywords, library functions, and edge cases. Use code samples on the back. Associate abstract logic with a visual — picturing a \"camera viewfinder\" for a sliding window algorithm makes it stick.",
      },
      {
        name: "Law",
        text: "Use three templates: Definition, Element (a single element of a test, e.g. \"breach\" in negligence), and Case Principle. For multi-element tests, one cloze deletion per element. Practice IRAC on short fact patterns.",
      },
      {
        name: "Medicine / anatomy",
        text: "Anchor anatomy to spatial memory whenever possible — describe where something is, not just what it does. Physiological pathways work well as step-by-step process cards.",
      },
    ],
  },
  {
    id: "mnemonics",
    label: "Memory hooks",
    heading: "A vivid, weird image beats a clever acronym.",
    body: "For hard vocabulary, find a word that sounds similar (an acoustic link) and build a bizarre image connecting the sound to the meaning. Humor and slightly absurd visuals trigger stronger consolidation than clean, forgettable ones. Images on cards work the same way — visual memory often outlasts verbal memory.",
  },
  {
    id: "grading",
    label: "Grading honestly",
    heading: "The algorithm only works if you're honest.",
    body: `FSRS schedules cards based on your grades. If you use "Hard" when you actually forgot something, you'll end up with unreasonably long intervals and cards you keep blanking on. The rule: use "Again" if you forgot it, "Hard" only if you recalled with real hesitation, "Good" for solid recall. Never use "Hard" to soften a failing grade.`,
  },
  {
    id: "ai",
    label: "AI-generated cards",
    heading: "AI drafts fast. You still have to edit.",
    body: "AI can turn a lecture PDF into 30 draft cards in seconds — but it often misses the atomic rule, bundles facts, or generates generic questions. Always do a human pass: delete the filler, split the bundles, and rewrite questions that could mean multiple things. The AI gets you 80% of the way. The last 20% is yours.",
  },
];

export default function TipsPage() {
  return (
    <main className="min-h-svh px-5 py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          flashcardbrowser
        </Link>

        <div className="mb-12">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Guide
          </p>
          <h1 className="text-3xl font-semibold tracking-tight mb-3">
            How to make good flashcards
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Most flashcard decks fail not because of the algorithm, but because
            the cards are bad. These are the principles that actually matter.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-border p-6"
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                {section.label}
              </p>
              <h2 className="text-base font-semibold tracking-tight mb-3 leading-snug">
                {section.heading}
              </h2>

              {"body" in section && section.body && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
              )}

              {"subsections" in section && section.subsections && (
                <div className="mt-3 space-y-3">
                  {section.subsections.map((sub) => (
                    <div key={sub.name} className="flex gap-3">
                      <span className="text-sm font-medium text-foreground/80 shrink-0 w-28">
                        {sub.name}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {sub.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Ready to put it into practice?
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-xl hover:opacity-80 transition-opacity"
          >
            Start studying
          </Link>
        </div>
      </div>
    </main>
  );
}
