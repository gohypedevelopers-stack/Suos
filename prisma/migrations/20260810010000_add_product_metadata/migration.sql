-- AlterTable
ALTER TABLE "products"
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "details" JSONB;
