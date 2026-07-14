import Image from "next/image"
import Link from "next/link"

import { trendingProducts } from "@/components/product/productData"

export function CollectionRecommendations() {
  const products = trendingProducts.slice(0, 6)

  return (
    <section
      aria-labelledby="collection-recommendations-heading"
      className="w-full overflow-hidden border-t border-black/10 bg-white py-12 text-black sm:py-14"
    >
      <div>
        <div className="flex items-end justify-between gap-6">
          <h2
            id="collection-recommendations-heading"
            className="font-heading text-[clamp(1.5rem,2.4vw,2.35rem)] font-semibold uppercase leading-none tracking-[-0.04em]"
          >
            You May Also Like
          </h2>

          <Link
            href="/collections"
            className="hidden border-b border-black pb-0.5 text-[0.7rem] uppercase tracking-[0.14em] transition-opacity hover:opacity-55 sm:inline-flex"
          >
            View all
          </Link>
        </div>

        <div className="recommendation-viewport mt-7" tabIndex={0}>
          <div className="recommendation-track">
            {[...products, ...products].map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                href="/products"
                className="recommendation-card group"
                aria-label={`View ${product.alt}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e7e4]">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 640px) 42vw, (max-width: 1024px) 20vw, 12vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-start justify-between gap-2 pt-2.5">
                  <span className="min-w-0 truncate text-[0.68rem] uppercase tracking-[0.08em]">
                    {product.badge ?? "SUOS EDIT"}
                  </span>
                  <span className="shrink-0 text-[0.68rem] uppercase tracking-[0.08em] text-black/55">
                    ₹2,800
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-7 flex justify-center sm:hidden">
          <Link
            href="/collections"
            className="inline-flex h-9 min-w-[102px] items-center justify-center border border-black px-6 text-[0.7rem] uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  )
}
