import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { readFileSync } from "fs"
import { resolve } from "path"

// Load prod env from .env.production.local if present
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.production.local"), "utf-8")
  for (const line of envFile.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^"|"$/g, "")
      if (!process.env[key]) process.env[key] = value
    }
  }
} catch {
  // fall through — DATABASE_URL may already be set in environment
}

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set.")
  console.error("Run: vercel env pull .env.production.local --environment=production")
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const full = process.argv.includes("--full")
  const showUsers = process.argv.includes("--users")

  if (showUsers) {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { decks: true, usage: true, schedules: true } },
        settings: { select: { theme: true, desiredRetention: true } },
      },
    })

    await prisma.$disconnect()
    await pool.end()

    console.log(`Total users: ${users.length}\n`)

    if (full) {
      console.log(JSON.stringify(users, null, 2))
    } else {
      for (const user of users) {
        const decks = user._count.decks
        const reviews = user._count.usage
        const scheduled = user._count.schedules
        console.log(
          `${user.email}  |  ${user.name ?? "(no name)"}  |  ${decks} decks, ${reviews} reviews, ${scheduled} scheduled  |  joined ${user.createdAt.toISOString().slice(0, 10)}`
        )
      }
    }
    return
  }

  const cards = await prisma.flashcard.findMany({
    orderBy: [{ deck: { title: "asc" } }, { position: "asc" }],
    include: {
      deck: {
        select: {
          id: true,
          title: true,
          visibility: true,
          owner: { select: { email: true } },
        },
      },
    },
  })

  await prisma.$disconnect()
  await pool.end()

  console.log(`Total cards: ${cards.length}\n`)

  if (full) {
    console.log(JSON.stringify(cards, null, 2))
  } else {
    for (const card of cards) {
      console.log(
        `[${card.deck.title}] ${card.question.slice(0, 60).replace(/\n/g, " ")}  →  ${card.answer.slice(0, 60).replace(/\n/g, " ")}`
      )
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
