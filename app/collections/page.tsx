import type { Metadata } from "next"

import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionGrid } from "@/components/collection/CollectionGrid"
import { CollectionHeader } from "@/components/collection/CollectionHeader"
import { CollectionRecommendations } from "@/components/collection/CollectionRecommendations"
import { listPublishedProducts } from "@/lib/server/dal/products"

export const metadata: Metadata = {
  title: "Collection | SUOS",
  description: "Browse the SUOS men's clothing collection.",
}

export const dynamic = "force-dynamic"

export default async function Page() {
  const products = await listPublishedProducts()

  return (
    <main className="flex-1 bg-white">
      <section className="w-full bg-white px-4 pb-0 pt-8 text-black sm:px-6 md:pt-10 lg:px-8">
        <CollectionHeader itemCount={products.length} />

        <div className="mt-8">
          <CollectionGrid products={products} />
        </div>

        <CollectionRecommendations products={products} />
        <CollectionBenefitsBar />
      </section>
    </main>
  )
}
