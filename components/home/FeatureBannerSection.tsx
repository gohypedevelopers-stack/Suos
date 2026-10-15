import { FullWidthBanner } from "@/components/home/FullWidthBanner"
import type { HomeBannerSectionItem } from "@/lib/server/dal/banners"
import { cn } from "@/lib/utils"

/**
 * Banner directly below the launch offer bar. Accepts an image or a video.
 * Recommended: desktop 1920 × 840 px (16:7), mobile 1080 × 1350 px (4:5).
 */
export function FeatureBannerSection({
  banner,
}: {
  banner?: HomeBannerSectionItem | null
}) {
  if (!banner) return null

  return (
    <FullWidthBanner
      banner={banner}
      fallbackSrc="/home-page-content/hero-2.png"
      defaultAlt="SUOS featured banner"
      className={cn(
        "sm:aspect-[16/7]",
        banner.mobileImageUrl ? "aspect-[4/5]" : "aspect-[16/9]"
      )}
    />
  )
}
