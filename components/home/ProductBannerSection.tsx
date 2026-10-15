import { FullWidthBanner } from "@/components/home/FullWidthBanner"
import type { HomeBannerSectionItem } from "@/lib/server/dal/banners"

export function ProductBannerSection({
  banner,
}: {
  banner?: HomeBannerSectionItem | null
}) {
  if (!banner) return null

  return (
    <FullWidthBanner
      banner={banner}
      fallbackSrc="/images/products/product15.png"
      defaultAlt="SUOS denim editorial banner"
      className="aspect-[16/7] sm:aspect-[1440/449] min-h-[150px] sm:min-h-0"
    />
  )
}
