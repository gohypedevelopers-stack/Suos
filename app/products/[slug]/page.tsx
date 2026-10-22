import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductHighlightsSection } from "@/components/product/ProductHighlightsSection"
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

/** Breadcrumbs are set in normal case (Figma); product data is stored uppercase. */
function toDisplayCase(label: string) {
  if (label !== label.toUpperCase()) return label
  return label.toLowerCase().replace(/(^|[\s(/-])(\p{L})/gu, (_, sep, char) => sep + char.toUpperCase())
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
          <nav aria-label="Breadcrumb" className="overflow-x-auto scrollbar-none py-1 text-body text-ink-400">
            <ol className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {product.breadcrumb.map((crumb, index) => {
                const isLast = index === product.breadcrumb.length - 1
                const label = toDisplayCase(crumb.label)

                return (
                  <li key={crumb.label} className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="transition-colors hover:text-ink-800">
                        {label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-ink-800" : ""} aria-current={isLast ? "page" : undefined}>
                        {label}
                      </span>
                    )}

                    {!isLast ? (
                      <ChevronRight className="size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
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
      {/* Figma order: details → You May Also Like → lifestyle image; marquee + footer come from SiteFooter. */}
      <ProductHighlightsSection intro={product.highlightsIntro} highlights={product.highlights} />
      <YouMayAlsoLikeSection excludeProductId={product.id} />
      {product.lifestyleImage ? (
        <section className="relative aspect-[4/5] w-full overflow-hidden bg-[#efefef] sm:aspect-[1440/720]">
          <Image
            src={product.lifestyleImage}
            alt={`${product.title} lifestyle`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </section>
      ) : null}
    </main>
  )
}
