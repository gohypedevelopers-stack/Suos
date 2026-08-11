-- CreateEnum
CREATE TYPE "DraftOrderStatus" AS ENUM ('DRAFT', 'SENT', 'COMPLETED');

-- CreateTable
CREATE TABLE "draft_orders" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "status" "DraftOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shipping" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draft_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_order_items" (
    "id" TEXT NOT NULL,
    "draftOrderId" TEXT NOT NULL,
    "variantId" TEXT,
    "title" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "draft_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "draft_orders_number_key" ON "draft_orders"("number");
CREATE INDEX "draft_orders_userId_idx" ON "draft_orders"("userId");
CREATE INDEX "draft_orders_status_createdAt_idx" ON "draft_orders"("status", "createdAt");
CREATE INDEX "draft_order_items_draftOrderId_idx" ON "draft_order_items"("draftOrderId");
CREATE INDEX "draft_order_items_variantId_idx" ON "draft_order_items"("variantId");

-- AddForeignKey
ALTER TABLE "draft_orders" ADD CONSTRAINT "draft_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "draft_order_items" ADD CONSTRAINT "draft_order_items_draftOrderId_fkey" FOREIGN KEY ("draftOrderId") REFERENCES "draft_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "draft_order_items" ADD CONSTRAINT "draft_order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
