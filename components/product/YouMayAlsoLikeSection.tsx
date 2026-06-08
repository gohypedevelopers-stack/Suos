import Link from "next/link"

import {
  ProductCardView,
} from "@/components/home/TrendingSection"
import { trendingProducts } from "@/components/product/productData"

export function YouMayAlsoLikeSection() {
  return (
    <section className="w-full bg-white px-4 pb-14 pt-10 text-black sm:px-6 lg:px-8">
      <div className="w-full">
        <h2 className="font-heading text-[40px] font-bold uppercase leading-none tracking-normal">
          You May Also Like
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trendingProducts.map((product) => (
            <ProductCardView key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/collections"
            className="inline-flex h-9 min-w-[102px] items-center justify-center border border-black px-6 text-[0.75rem] uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-white"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}
