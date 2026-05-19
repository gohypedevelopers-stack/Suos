import { FooterSection } from "@/components/home/FooterSection"
import { SustainabilityMarquee } from "@/components/home/SustainabilityMarquee"

export function SiteFooter() {
  return (
    <div className="w-full">
      <SustainabilityMarquee />
      <FooterSection />
    </div>
  )
}
