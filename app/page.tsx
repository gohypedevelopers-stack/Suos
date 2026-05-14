import { Hero } from "@/components/home/Hero"
import { DenimCarousel } from "@/components/home/DenimCarousel"
import { LaunchOfferBar } from "@/components/home/LaunchOfferBar"
import { TrendingSection } from "@/components/home/TrendingSection"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <main className="flex-1 bg-black">
      <Hero />
      <LaunchOfferBar />
      <TrendingSection />
      <DenimCarousel />
    </main>
  )
}
