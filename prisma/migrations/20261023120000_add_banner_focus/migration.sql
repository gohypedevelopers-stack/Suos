-- Crop focus point per banner (CSS object-position, e.g. "50% 30%"). Null = centre.
ALTER TABLE "banners" ADD COLUMN "desktopFocus" TEXT;
ALTER TABLE "banners" ADD COLUMN "mobileFocus" TEXT;
