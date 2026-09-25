import "server-only"

import { prismaAdapter } from "@better-auth/prisma-adapter"
import { betterAuth } from "better-auth/minimal"

import { getPrisma } from "@/lib/server/db"
import { getAuthEnv } from "@/lib/server/env"

function createAuth() {
  const authEnv = getAuthEnv()

  return betterAuth({
    appName: "SUOS",
    baseURL: authEnv.BETTER_AUTH_URL,
    secret: authEnv.BETTER_AUTH_SECRET,
    trustedOrigins: [
      authEnv.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:*",
      "http://127.0.0.1:*",
      "https://*.suosindia.com",
      "https://suosindia.com",
      "https://dev.suosindia.com",
    ],
    database: prismaAdapter(getPrisma(), {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        role: {
          type: ["CUSTOMER", "ADMIN"],
          defaultValue: "CUSTOMER",
          input: false,
          required: true,
        },
      },
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },
  })
}

export type Auth = ReturnType<typeof createAuth>

let auth: Auth | undefined

export function getAuth() {
  auth ??= createAuth()
  return auth
}
