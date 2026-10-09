-- AlterTable users: per-user dashboard permissions for SUB_ADMIN accounts
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "permissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
