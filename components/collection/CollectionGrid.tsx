import { ProductCardView, type ProductCard } from "@/components/home/TrendingSection"

export function CollectionGrid({ products = [] }: { products?: ProductCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCardView key={product.id} product={product} />
      ))}
    </div>
  )
}
