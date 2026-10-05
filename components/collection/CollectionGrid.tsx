import { ProductCardView, type ProductCard } from "@/components/home/TrendingSection"

export function CollectionGrid({ products = [] }: { products?: ProductCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-0.5 sm:gap-1 md:grid-cols-2 lg:grid-cols-4 items-start">
      {products.map((product) => (
        <ProductCardView key={product.id} product={product} />
      ))}
    </div>
  )
}
