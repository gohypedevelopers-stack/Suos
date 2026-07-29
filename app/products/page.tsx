import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { LookbookCarousel } from "@/components/home/LookbookCarousel"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductSummary } from "@/components/product/ProductSummary"
import { YouMayAlsoLikeSection } from "@/components/product/YouMayAlsoLikeSection"
import { featuredProduct } from "@/components/product/productData"

export const metadata: Metadata = {
  title: "Bootcut Denim | SUOS",
  description: "An editorial product page for SUOS featuring bootcut denim.",
}

export default function Page() {
  return (
    <main className="flex-1 bg-white text-black">
      <section className="relative w-full overflow-x-clip px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-6">
        <div className="w-full">
          <nav
            aria-label="Breadcrumb"
            className="text-[13px] font-normal text-black/45"
          >
            <ol className="flex flex-wrap items-center gap-1.5 uppercase tracking-[0]">
              {featuredProduct.breadcrumb.map((crumb, index) => {
                const isLast = index === featuredProduct.breadcrumb.length - 1

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
                      <span className={isLast ? "text-black" : ""}>
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
            <ProductGallery images={featuredProduct.gallery} />
            <ProductSummary product={featuredProduct} />
          </div>
        </div>
      </section>
      <YouMayAlsoLikeSection />
      <LookbookCarousel />
    </main>
  )
}
