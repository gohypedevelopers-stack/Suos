-- Per-product storefront copy: subtitle, fit notes, "It's in the Details" highlights, lifestyle image.
ALTER TABLE "products" ADD COLUMN "pageContent" JSONB;
