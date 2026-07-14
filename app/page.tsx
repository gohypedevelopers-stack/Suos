import { Hero } from "@/components/home/Hero"
import { DenimCarousel } from "@/components/home/DenimCarousel"
import { DenimEditorialSection } from "@/components/home/DenimEditorialSection"
import { MotionBannerSection } from "@/components/home/MotionBannerSection"
import { ProductBannerSection } from "@/components/home/ProductBannerSection"
import { LookbookCarousel } from "@/components/home/LookbookCarousel"
import { LaunchOfferBar } from "@/components/home/LaunchOfferBar"
import { EditsCarousel } from "@/components/home/EditsCarousel"
import { TrendingSection } from "@/components/home/TrendingSection"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <main className="flex-1 bg-black">
      <Hero />
      <LaunchOfferBar />
      <TrendingSection />
      <MotionBannerSection />
      <DenimCarousel />
      <EditsCarousel />
      <DenimEditorialSection />
      <LookbookCarousel />
      <ProductBannerSection />
    </main>
  )
}
