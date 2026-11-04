-- Per-collection page images: editorial photos in the product grid and the bottom banner.
ALTER TABLE "collections" ADD COLUMN "pageContent" JSONB;
