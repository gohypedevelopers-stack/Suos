import "server-only"

import { prismaAdapter } from "@better-auth/prisma-adapter"
import { betterAuth } from "better-auth/minimal"

import { prisma } from "@/lib/server/db"
import { getAuthEnv } from "@/lib/server/env"

const authEnv = getAuthEnv()

export const auth = betterAuth({
  appName: "SUOS",
  baseURL: authEnv.BETTER_AUTH_URL,
  secret: authEnv.BETTER_AUTH_SECRET,
  trustedOrigins: [authEnv.BETTER_AUTH_URL],
  database: prismaAdapter(prisma, {
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
