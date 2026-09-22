import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { LookbookCarousel } from "@/components/home/LookbookCarousel"
import { ResponsibleDenimSection } from "@/components/home/ResponsibleDenimSection"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductSummary } from "@/components/product/ProductSummary"
import { YouMayAlsoLikeSection } from "@/components/product/YouMayAlsoLikeSection"
import { getProductBySlug } from "@/lib/server/dal/products"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.title} | SUOS`,
    description: product.description || `Buy ${product.title} at SUOS`,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="flex-1 bg-white text-black w-full min-w-0 overflow-x-hidden">
      <section className="relative w-full min-w-0 overflow-x-hidden px-3 pb-10 pt-3 sm:px-6 sm:pb-16 sm:pt-5 lg:px-8 lg:pt-6">
        <div className="w-full min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] sm:text-[13px] font-normal text-black/45 overflow-x-auto scrollbar-none py-1"
          >
            <ol className="flex flex-wrap items-center gap-1 sm:gap-1.5 uppercase tracking-[0]">
              {product.breadcrumb.map((crumb, index) => {
                const isLast = index === product.breadcrumb.length - 1

                return (
                  <li key={crumb.label} className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="transition-colors hover:text-black"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-black font-medium" : ""}>
                        {crumb.label}
                      </span>
                    )}

                    {!isLast ? (
                      <ChevronRight className="size-3 sm:size-3.5 shrink-0 text-black/25" />
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="mt-3 sm:mt-5 grid w-full min-w-0 gap-6 sm:gap-8 xl:grid-cols-[minmax(0,1fr)_573px] xl:items-start xl:gap-12">
            <ProductGallery images={product.gallery} />
            <ProductSummary product={product} />
          </div>
        </div>
      </section>
      <ResponsibleDenimSection />
      <YouMayAlsoLikeSection />
      <LookbookCarousel />
    </main>
  )
}
