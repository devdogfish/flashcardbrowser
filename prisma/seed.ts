import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hashPassword } from "@better-auth/utils/password";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const luigi = await prisma.user.upsert({
    where: { email: "qi975251@dal.ca" },
    update: {},
    create: {
      id: "seed-user-luigi",
      email: "qi975251@dal.ca",
      name: "Luigi",
      emailVerified: true,
      dalEmail: "qi975251@dal.ca",
    },
  });

  await prisma.account.upsert({
    where: { id: "seed-account-luigi" },
    update: {},
    create: {
      id: "seed-account-luigi",
      accountId: luigi.id,
      providerId: "credential",
      userId: luigi.id,
      password: await hashPassword("luigi1234"),
    },
  });

  // Seed a stable API key for Luigi so the deck-generator skill can use it
  const LUIGI_API_KEY = "flashcardbrowser_a4f8c2e6b1d3f7a9c5e2b4d6f8a1c3e5b7d9f2a4c6e8b1d3";
  await prisma.apiKey.upsert({
    where: { key: LUIGI_API_KEY },
    update: {},
    create: {
      id: "seed-apikey-luigi",
      userId: luigi.id,
      name: "Deck Generator (seeded)",
      key: LUIGI_API_KEY,
    },
  });

  console.log("Seed complete.");
  console.log(`  User: ${luigi.name} <${luigi.email}>`);
  console.log(`  API Key: ${LUIGI_API_KEY}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
