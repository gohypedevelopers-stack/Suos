-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PRODUCT', 'ORDER', 'BUY_X_GET_Y', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "DiscountMethod" AS ENUM ('CODE', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DiscountValueType" AS ENUM ('PERCENTAGE', 'FIXED', 'FREE');

-- CreateEnum
CREATE TYPE "DiscountAppliesTo" AS ENUM ('ALL', 'PRODUCTS', 'COLLECTIONS');

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT,
    "type" "DiscountType" NOT NULL,
    "method" "DiscountMethod" NOT NULL,
    "status" "DiscountStatus" NOT NULL DEFAULT 'ACTIVE',
    "valueType" "DiscountValueType" NOT NULL,
    "value" DECIMAL(12,2),
    "appliesTo" "DiscountAppliesTo" NOT NULL DEFAULT 'ALL',
    "productIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "collectionIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "buyProductIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "getProductIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "eligibility" TEXT NOT NULL DEFAULT 'ALL',
    "minimumType" TEXT NOT NULL DEFAULT 'NONE',
    "minimumQuantity" INTEGER,
    "minimumAmount" DECIMAL(12,2),
    "usageLimit" INTEGER,
    "onePerCustomer" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "discounts_code_key" ON "discounts"("code");
CREATE INDEX "discounts_status_startsAt_idx" ON "discounts"("status", "startsAt");
CREATE INDEX "discounts_type_status_idx" ON "discounts"("type", "status");
