import { Hero } from "@/components/home/Hero"
import { DenimCarousel } from "@/components/home/DenimCarousel"
import { DenimEditorialSection } from "@/components/home/DenimEditorialSection"
import { MotionBannerSection } from "@/components/home/MotionBannerSection"
import { RecommendedSection } from "@/components/home/RecommendedSection"
import { ResponsibleDenimSection } from "@/components/home/ResponsibleDenimSection"
import { ProductBannerSection } from "@/components/home/ProductBannerSection"
import { LookbookCarousel } from "@/components/home/LookbookCarousel"
import { LaunchOfferBar } from "@/components/home/LaunchOfferBar"
import { EditsCarousel } from "@/components/home/EditsCarousel"
import { TrendingSection } from "@/components/home/TrendingSection"
import { listPublishedProducts } from "@/lib/server/dal/products"

export const dynamic = "force-dynamic"

export default async function Home() {
  const products = await listPublishedProducts()
  
  return (
    <main className="flex-1 bg-black">
      <Hero />
      <LaunchOfferBar />
      <TrendingSection products={products.slice(0, 8)} />
      <MotionBannerSection />
      <DenimCarousel />
      <EditsCarousel />
      <DenimEditorialSection />
      <LookbookCarousel />
      <ProductBannerSection />
      <RecommendedSection products={products.slice(4, 8).length >= 4 ? products.slice(4, 8) : products.slice(0, 4)} />
      <ResponsibleDenimSection />
    </main>
  )
}
