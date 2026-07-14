import { CollectionGrid } from "@/components/collection/CollectionGrid"
import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionHeader } from "@/components/collection/CollectionHeader"
import { CollectionRecommendations } from "@/components/collection/CollectionRecommendations"

export function CollectionPage() {
  return (
    <main className="flex-1 bg-white">
      <section className="w-full bg-white px-4 pt-8 pb-0 text-black sm:px-6 lg:px-8 md:pt-10">
        <CollectionHeader />

        <div className="mt-8">
          <CollectionGrid />
        </div>

        <CollectionRecommendations />
        <CollectionBenefitsBar />
      </section>
    </main>
  )
}
