import { ProductCardView, type ProductCard } from "@/components/home/TrendingSection"

export function CollectionGrid({ products = [] }: { products?: ProductCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCardView key={product.id} product={product} />
      ))}
    </div>
  )
}
