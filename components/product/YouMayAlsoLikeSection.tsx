import { RecommendedSection } from "@/components/home/RecommendedSection"
import { listPublishedProducts } from "@/lib/server/dal/products"

const COUNT = 6

/**
 * Product page "You May Also Like": products picked in the admin first, then
 * topped up with the newest products so the row is always full.
 */
export async function YouMayAlsoLikeSection({
  excludeProductId,
  pickedIds = [],
}: {
  excludeProductId?: string
  pickedIds?: string[]
}) {
  const picked = pickedIds.length > 0
    ? (await listPublishedProducts({ ids: pickedIds })).filter((p) => p.id !== excludeProductId)
    : []
  const fill = picked.length < COUNT
    ? (await listPublishedProducts({ excludeProductId, take: COUNT + picked.length })).filter(
        (p) => !picked.some((q) => q.id === p.id),
      )
    : []
  const products = [...picked, ...fill].slice(0, COUNT)
  if (products.length === 0) return null

  return <RecommendedSection products={products} usePlaceholders={false} />
}
