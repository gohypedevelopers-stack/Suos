import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"
import { getDatabaseEnv } from "@/lib/server/env"

const SCHEMA_VERSION = "2026-09-24-v2-editorial"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  schemaVersion?: string
}

if (globalForPrisma.schemaVersion !== SCHEMA_VERSION) {
  globalForPrisma.prisma = undefined
  globalForPrisma.schemaVersion = SCHEMA_VERSION
}

let prisma = globalForPrisma.prisma

function createPrismaClient() {
  const { DATABASE_URL } = getDatabaseEnv()
  const adapter = new PrismaPg({
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 5_000,
    max: 10,
  })

  return new PrismaClient({ adapter })
}

export function getPrisma() {
  if (!prisma || !("banner" in prisma)) {
    prisma = createPrismaClient()
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma
    }
  }

  return prisma
}
