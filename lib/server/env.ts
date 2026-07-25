import "server-only"

import { z } from "zod"

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
})

const authEnvSchema = databaseEnvSchema.extend({
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must contain at least 32 characters")
    .refine(
      (value) => !value.startsWith("replace-"),
      "Replace the example BETTER_AUTH_SECRET before starting the application",
    ),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
})

const r2EnvSchema = z.object({
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.url(),
})

let databaseEnv: z.infer<typeof databaseEnvSchema> | undefined
let authEnv: z.infer<typeof authEnvSchema> | undefined
let r2Env: z.infer<typeof r2EnvSchema> | undefined

export function getDatabaseEnv() {
  databaseEnv ??= databaseEnvSchema.parse(process.env)
  return databaseEnv
}

export function getAuthEnv() {
  authEnv ??= authEnvSchema.parse(process.env)
  return authEnv
}

export function getR2Env() {
  r2Env ??= r2EnvSchema.parse(process.env)
  return r2Env
}
