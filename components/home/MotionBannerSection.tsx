import { FullWidthBanner } from "@/components/home/FullWidthBanner"
import type { HomeBannerSectionItem } from "@/lib/server/dal/banners"

export function MotionBannerSection({
  banner,
}: {
  banner?: HomeBannerSectionItem | null
}) {
  if (!banner) return null

  return (
    <FullWidthBanner
      banner={banner}
      fallbackSrc="/home-page-content/hero-2.png"
      defaultAlt="Editorial fashion banner"
      className="aspect-[16/7] sm:aspect-[2172/724] min-h-[150px] sm:min-h-0"
    />
  )
}
