import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Seed user that owns the public decks
  const seedUser = await prisma.user.upsert({
    where: { email: "seed@flipt.app" },
    update: {},
    create: {
      id: "seed-user-flipt",
      email: "seed@flipt.app",
      name: "Flipt",
      emailVerified: true,
    },
  })

  // ── Data Science deck ──────────────────────────────────────────────────────
  const dataScienceDeck = await prisma.deck.upsert({
    where: { id: "deck-data-science" },
    update: {},
    create: {
      id: "deck-data-science",
      ownerId: seedUser.id,
      title: "Data Science Fundamentals",
      description: "Core concepts in data science, statistics, and machine learning.",
      visibility: "PUBLIC",
    },
  })

  const dataScienceCards = [
    {
      id: "ds-01",
      question: "What is the bias-variance tradeoff?",
      answer:
        "The tension between a model's ability to fit training data (low bias) and generalise to new data (low variance). Reducing one typically increases the other.",
      position: 1,
    },
    {
      id: "ds-02",
      question: "What is overfitting?",
      answer:
        "When a model learns the noise in training data rather than the underlying pattern, performing well on training data but poorly on unseen data.",
      position: 2,
    },
    {
      id: "ds-03",
      question: "What does cross-validation do?",
      answer:
        "Splits data into k folds to evaluate model performance on held-out subsets, giving a more reliable estimate of generalisation error than a single train/test split.",
      position: 3,
    },
    {
      id: "ds-04",
      question: "What is gradient descent?",
      answer:
        "An optimisation algorithm that iteratively adjusts model parameters in the direction of steepest loss decrease to find a local minimum.",
      position: 4,
    },
    {
      id: "ds-05",
      question: "What is the difference between supervised and unsupervised learning?",
      answer:
        "Supervised learning trains on labelled examples to predict outputs; unsupervised learning finds structure in unlabelled data (e.g. clustering, dimensionality reduction).",
      position: 5,
    },
    {
      id: "ds-06",
      question: "What is a confusion matrix?",
      answer:
        "A table showing true positives, false positives, true negatives, and false negatives for a classifier, used to derive metrics like precision, recall, and F1 score.",
      position: 6,
    },
    {
      id: "ds-07",
      question: "What is regularisation?",
      answer:
        "A technique that adds a penalty term to the loss function to discourage large weights, reducing overfitting. Common forms are L1 (Lasso) and L2 (Ridge).",
      position: 7,
    },
    {
      id: "ds-08",
      question: "What is the central limit theorem?",
      answer:
        "Given a sufficiently large sample, the distribution of the sample mean approaches a normal distribution regardless of the population's distribution.",
      position: 8,
    },
    {
      id: "ds-09",
      question: "What is a p-value?",
      answer:
        "The probability of observing results at least as extreme as the data, assuming the null hypothesis is true. A small p-value (< 0.05) suggests evidence against the null.",
      position: 9,
    },
    {
      id: "ds-10",
      question: "What is feature engineering?",
      answer:
        "The process of using domain knowledge to create, transform, or select input variables that make machine learning algorithms work better.",
      position: 10,
    },
  ]

  for (const card of dataScienceCards) {
    await prisma.flashcard.upsert({
      where: { id: card.id },
      update: {},
      create: { ...card, deckId: dataScienceDeck.id },
    })
  }

  // ── European Portuguese deck ───────────────────────────────────────────────
  const portugueseDeck = await prisma.deck.upsert({
    where: { id: "deck-european-portuguese" },
    update: {},
    create: {
      id: "deck-european-portuguese",
      ownerId: seedUser.id,
      title: "European Portuguese",
      description: "Essential vocabulary and phrases for European Portuguese (PT-PT).",
      visibility: "PUBLIC",
      coverImage: "/deck-covers/portuguese.jpg",
    },
  })

  const portugueseCards = [
    {
      id: "pt-01",
      question: "Bom dia",
      answer: "Good morning — used until around midday. Pronounced 'bom JEE-ah' in Portugal.",
      position: 1,
    },
    {
      id: "pt-02",
      question: "Boa tarde / Boa noite",
      answer: "Good afternoon / Good evening (night). 'Boa tarde' from noon; 'boa noite' from sunset.",
      position: 2,
    },
    {
      id: "pt-03",
      question: "Por favor",
      answer: "Please. Used at the end of a request in European Portuguese.",
      position: 3,
    },
    {
      id: "pt-04",
      question: "Obrigado / Obrigada",
      answer: "Thank you. Men say 'obrigado', women say 'obrigada' — it agrees with the speaker's gender.",
      position: 4,
    },
    {
      id: "pt-05",
      question: "Faz favor — when is this used?",
      answer:
        "A common way to get a waiter's attention or make a polite request in Portugal, roughly equivalent to 'excuse me' or 'please'.",
      position: 5,
    },
    {
      id: "pt-06",
      question: "Onde fica…?",
      answer: "Where is…? — e.g. 'Onde fica a estação de metro?' (Where is the metro station?)",
      position: 6,
    },
    {
      id: "pt-07",
      question: "Quanto custa?",
      answer: "How much does it cost?",
      position: 7,
    },
    {
      id: "pt-08",
      question: "Não percebo / Não entendo",
      answer:
        "I don't understand. 'Percebo' (from perceber) is more common in European Portuguese; 'entendo' is also used.",
      position: 8,
    },
    {
      id: "pt-09",
      question: "Pode repetir, por favor?",
      answer: "Can you repeat that, please? Useful when you miss something someone said.",
      position: 9,
    },
    {
      id: "pt-10",
      question: "Uma bica / Um galão",
      answer:
        "A bica is a small strong espresso (like Italian espresso). A galão is a tall milky coffee similar to a latte — both are staples of Portuguese café culture.",
      position: 10,
    },
  ]

  for (const card of portugueseCards) {
    await prisma.flashcard.upsert({
      where: { id: card.id },
      update: {},
      create: { ...card, deckId: portugueseDeck.id },
    })
  }

  // ── Getting Jacked deck ────────────────────────────────────────────────────
  const gettingJackedDeck = await prisma.deck.upsert({
    where: { id: "deck-getting-jacked" },
    update: {},
    create: {
      id: "deck-getting-jacked",
      ownerId: seedUser.id,
      title: "Getting Jacked",
      description: "Workout principles, muscle anatomy, nutrition basics, and training techniques for building muscle.",
      visibility: "PRIVATE",
    },
  })

  const gettingJackedCards = [
    {
      id: "gj-01",
      question: "What is progressive overload?",
      answer: "Gradually increasing the stress placed on the body during training — through more weight, reps, sets, or reduced rest — so the muscle continues adapting and growing.",
      position: 1,
    },
    {
      id: "gj-02",
      question: "What are the three primary muscle fiber types?",
      answer: "Type I (slow-twitch, endurance), Type IIa (fast-twitch, mixed), and Type IIx (fast-twitch, power). Hypertrophy training targets Type II fibers most.",
      position: 2,
    },
    {
      id: "gj-03",
      question: "How much protein do you need to build muscle?",
      answer: "Around 1.6–2.2 g per kg of bodyweight per day. Spread across meals of roughly 30–40 g to maximise muscle protein synthesis.",
      position: 3,
    },
    {
      id: "gj-04",
      question: "What is a caloric surplus and why does it matter?",
      answer: "Consuming more calories than you burn. A modest surplus (200–500 kcal/day) provides energy for muscle synthesis without excessive fat gain.",
      position: 4,
    },
    {
      id: "gj-05",
      question: "What does RPE mean in training?",
      answer: "Rate of Perceived Exertion — a 1–10 scale for how hard a set feels. RPE 8 means 2 reps left in the tank. Useful for auto-regulating intensity.",
      position: 5,
    },
    {
      id: "gj-06",
      question: "What is the mind-muscle connection?",
      answer: "Consciously focusing on contracting the target muscle during a lift. Research suggests it increases muscle activation, particularly useful for isolation exercises.",
      position: 6,
    },
    {
      id: "gj-07",
      question: "How long should you rest between hypertrophy sets?",
      answer: "2–4 minutes for compound lifts; 1–2 minutes for isolation exercises. Longer rest preserves performance and total volume, leading to better hypertrophy.",
      position: 7,
    },
    {
      id: "gj-08",
      question: "What is muscle protein synthesis (MPS)?",
      answer: "The cellular process of building new muscle proteins in response to training and protein intake. Elevated for ~24–48 hours after a session.",
      position: 8,
    },
    {
      id: "gj-09",
      question: "What is the difference between compound and isolation exercises?",
      answer: "Compound lifts (squat, bench, deadlift) engage multiple joints and muscle groups — ideal for overall mass. Isolation exercises (curls, flyes) target a single muscle.",
      position: 9,
    },
    {
      id: "gj-10",
      question: "Why is sleep important for muscle growth?",
      answer: "Most muscle repair and growth hormone release happens during deep sleep. Aim for 7–9 hours. Sleep deprivation raises cortisol and impairs recovery.",
      position: 10,
    },
  ]

  for (const card of gettingJackedCards) {
    await prisma.flashcard.upsert({
      where: { id: card.id },
      update: {},
      create: { ...card, deckId: gettingJackedDeck.id },
    })
  }

  // ── Favorites ──────────────────────────────────────────────────────────────
  await prisma.deckFavorite.upsert({
    where: { userId_deckId: { userId: seedUser.id, deckId: portugueseDeck.id } },
    update: {},
    create: { userId: seedUser.id, deckId: portugueseDeck.id },
  })

  console.log("Seed complete.")
  console.log(`  Data Science deck: ${dataScienceCards.length} cards`)
  console.log(`  European Portuguese deck: ${portugueseCards.length} cards`)
  console.log(`  Getting Jacked deck: ${gettingJackedCards.length} cards`)
  console.log(`  Favorites: Portuguese Essentials favorited for seed user`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
