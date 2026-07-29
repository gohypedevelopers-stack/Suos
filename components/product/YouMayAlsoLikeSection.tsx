import Link from "next/link"

import {
  ProductCardView,
} from "@/components/home/TrendingSection"
import { trendingProducts } from "@/components/product/productData"

export function YouMayAlsoLikeSection() {
  return (
    <section className="w-full bg-white px-4 pb-14 pt-10 text-black sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="flex items-center justify-between gap-6">
          <h2 className="font-heading text-[24px] font-normal uppercase leading-none tracking-[-0.04em]">
            You May Also Like
          </h2>

          <Link
            href="/collections"
            className="group hidden flex-col items-start pb-0.5 text-[13px] font-normal uppercase leading-none tracking-normal transition-opacity hover:opacity-70 sm:inline-flex"
          >
            <span>View all</span>
            <span
              aria-hidden="true"
              className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100"
            />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trendingProducts.map((product) => (
            <ProductCardView key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/collections"
            className="inline-flex h-9 min-w-[102px] items-center justify-center border border-black px-6 text-[13px] font-normal uppercase leading-none tracking-normal transition-colors hover:bg-black hover:text-white"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}
