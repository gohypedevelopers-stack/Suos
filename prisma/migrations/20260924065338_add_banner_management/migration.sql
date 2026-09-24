-- CreateEnum
CREATE TYPE "BannerPlacement" AS ENUM ('HERO', 'MIDDLE', 'BOTTOM');

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "desktopImageKey" TEXT NOT NULL,
    "mobileImageKey" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "placement" "BannerPlacement" NOT NULL DEFAULT 'HERO',
    "textAlignment" TEXT NOT NULL DEFAULT 'CENTER',
    "overlayOpacity" INTEGER NOT NULL DEFAULT 20,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banners_placement_isActive_position_idx" ON "banners"("placement", "isActive", "position");
