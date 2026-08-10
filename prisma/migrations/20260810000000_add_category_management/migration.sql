-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('DRAFT', 'ACTIVE');

-- AlterTable
ALTER TABLE "categories"
  ADD COLUMN "status" "CategoryStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "visible" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "imageObjectKey" TEXT,
  ADD COLUMN "imageAltText" TEXT,
  ADD COLUMN "parentId" TEXT;

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_status_visible_idx" ON "categories"("status", "visible");

-- AddForeignKey
ALTER TABLE "categories"
  ADD CONSTRAINT "categories_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "categories"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
