import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { z } from "zod"

import { PrismaClient } from "../generated/prisma/client"

const env = z
  .object({
    DATABASE_URL: z.string().min(1),
    ADMIN_EMAIL: z.email(),
  })
  .parse(process.env)

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: 5_000,
  max: 1,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const user = await prisma.user.update({
      where: { email: env.ADMIN_EMAIL.toLowerCase() },
      data: { role: "ADMIN" },
      select: { id: true, email: true, role: true },
    })

    console.log(`Promoted ${user.email} (${user.id}) to ${user.role}.`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
