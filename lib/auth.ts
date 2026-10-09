import "server-only"

import { prismaAdapter } from "@better-auth/prisma-adapter"
import { betterAuth } from "better-auth/minimal"

import { getPrisma } from "@/lib/server/db"
import { getAuthEnv, getGoogleAuthEnv } from "@/lib/server/env"
import { sendAuthEmail } from "@/lib/server/notifications"

function createAuth() {
  const authEnv = getAuthEnv()
  const googleEnv = getGoogleAuthEnv()
  const googleConfigured = Boolean(googleEnv.GOOGLE_CLIENT_ID && googleEnv.GOOGLE_CLIENT_SECRET)

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
      sendResetPassword: async ({ user, url }) => {
        await sendAuthEmail("PASSWORD_RESET", {
          userId: user.id,
          email: user.email,
          name: user.name,
          url,
        })
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendAuthEmail("VERIFY_EMAIL", {
          userId: user.id,
          email: user.email,
          name: user.name,
          url,
        })
      },
    },
    ...(googleConfigured
      ? {
          socialProviders: {
            google: {
              clientId: googleEnv.GOOGLE_CLIENT_ID!,
              clientSecret: googleEnv.GOOGLE_CLIENT_SECRET!,
            },
          },
        }
      : {}),
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        role: {
          type: ["CUSTOMER", "SUB_ADMIN", "ADMIN"],
          defaultValue: "CUSTOMER",
          input: false,
          required: true,
        },
        phone: {
          type: "string",
          required: false,
          input: true,
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
