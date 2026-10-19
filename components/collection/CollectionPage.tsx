import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionRecommendations } from "@/components/collection/CollectionRecommendations"
import { ProductListing } from "@/components/collection/ProductListing"
import type { ProductCard } from "@/components/home/TrendingSection"

export function CollectionPage({
  title = "Men's Clothing",
  products = [],
}: {
  title?: string
  products?: ProductCard[]
}) {
  return (
    <main className="flex-1 bg-white">
      <ProductListing title={title} products={products} />
      <div className="px-4 sm:px-6 lg:px-8">
        <CollectionRecommendations products={products} />
      </div>
      <CollectionBenefitsBar />
    </main>
  )
}
