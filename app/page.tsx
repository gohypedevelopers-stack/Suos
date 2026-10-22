import { Hero } from "@/components/home/Hero"
import { DenimCarousel } from "@/components/home/DenimCarousel"
import { DenimEditorialSection } from "@/components/home/DenimEditorialSection"
import { MotionBannerSection } from "@/components/home/MotionBannerSection"
import { RecommendedSection } from "@/components/home/RecommendedSection"
import { ResponsibleDenimSection } from "@/components/home/ResponsibleDenimSection"
import { ProductBannerSection } from "@/components/home/ProductBannerSection"
import { LookbookCarousel } from "@/components/home/LookbookCarousel"
import { LaunchOfferBar } from "@/components/home/LaunchOfferBar"
import { FeatureBannerSection } from "@/components/home/FeatureBannerSection"
import { TrendingSection } from "@/components/home/TrendingSection"
import { SplitBannerSection } from "@/components/home/SplitBannerSection"
import { listPublishedProducts } from "@/lib/server/dal/products"
import { getHomeBanners } from "@/lib/server/dal/banners"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [products, banners] = await Promise.all([
    listPublishedProducts(),
    getHomeBanners(),
  ])
  
  // "You May Also Like" shows the next 6 products after the 8 in Our Favourite.
  const alsoLike = products.length >= 14 ? products.slice(8, 14) : products.slice(0, 6)

  // Order follows the Revised_Home Page Figma frame. The launch offer bar and
  // feature banner aren't in that frame; both stay hidden unless switched on in admin.
  return (
    <main className="flex-1 bg-black">
      <Hero banners={banners.hero} />
      <SplitBannerSection banners={banners.split} />
      <LaunchOfferBar />
      <FeatureBannerSection banner={banners.feature} />
      <TrendingSection products={products.slice(0, 8)} />
      <MotionBannerSection banner={banners.middle} />
      <DenimCarousel slides={banners.denimCarousel} />
      <DenimEditorialSection banners={banners.editorial} />
      <LookbookCarousel />
      <ProductBannerSection banner={banners.bottom} />
      <RecommendedSection products={alsoLike} />
      <ResponsibleDenimSection />
    </main>
  )
}
