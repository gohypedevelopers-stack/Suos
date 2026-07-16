import type { Metadata } from "next"

import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionGrid } from "@/components/collection/CollectionGrid"
import { CollectionHeader } from "@/components/collection/CollectionHeader"
import { CollectionRecommendations } from "@/components/collection/CollectionRecommendations"

export const metadata: Metadata = {
  title: "Collection | SUOS",
  description: "Browse the SUOS men's clothing collection.",
}

export default function Page() {
  return (
    <main className="flex-1 bg-white">
      <section className="w-full bg-white px-4 pb-0 pt-8 text-black sm:px-6 md:pt-10 lg:px-8">
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
