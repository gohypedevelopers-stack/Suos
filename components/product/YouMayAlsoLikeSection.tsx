import { RecommendedSection } from "@/components/home/RecommendedSection"
import { listPublishedProducts } from "@/lib/server/dal/products"

/** Product page "You May Also Like": same 6-card carousel as the homepage, real products only. */
export async function YouMayAlsoLikeSection({
  excludeProductId,
}: {
  excludeProductId?: string
}) {
  const products = await listPublishedProducts({ excludeProductId, take: 6 })
  if (products.length === 0) return null

  return <RecommendedSection products={products} usePlaceholders={false} />
}
