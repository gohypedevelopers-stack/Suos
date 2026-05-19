import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductSummary } from "@/components/product/ProductSummary"
import type { ProductDetail } from "@/components/product/productData"

export function ProductPage({
  product,
}: {
  product: ProductDetail
}) {
  return (
    <main className="flex-1 bg-white text-black">
      <section className="relative w-full overflow-hidden px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-6">
        <div className="w-full">
          <nav aria-label="Breadcrumb" className="text-[0.7rem] text-black/45">
            <ol className="flex flex-wrap items-center gap-1.5 uppercase tracking-[0.14em]">
              {product.breadcrumb.map((crumb, index) => {
                const isLast = index === product.breadcrumb.length - 1

                return (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="transition-colors hover:text-black"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-black/62" : ""}>
                        {crumb.label}
                      </span>
                    )}

                    {!isLast ? (
                      <ChevronRight className="size-3.5 shrink-0 text-black/25" />
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="mt-5 grid gap-8 xl:grid-cols-[minmax(0,1fr)_573px] xl:items-start xl:gap-12">
            <ProductGallery images={product.gallery} />
            <ProductSummary product={product} />
          </div>
        </div>
      </section>
    </main>
  )
}
