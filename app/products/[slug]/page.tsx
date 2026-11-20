import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { CollectionBanner } from "@/components/collection/CollectionBanner"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductHighlightsSection } from "@/components/product/ProductHighlightsSection"
import { RecentlyViewed } from "@/components/product/RecentlyViewed"
import { ProductSummary } from "@/components/product/ProductSummary"
import { YouMayAlsoLikeSection } from "@/components/product/YouMayAlsoLikeSection"
import { getCurrentUser } from "@/lib/server/dal/auth"
import { getCollectionBanner } from "@/lib/server/dal/collections"
import { getProductBySlug } from "@/lib/server/dal/products"
import { isStaffRole } from "@/lib/roles"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}

/** Staff can open Draft products with ?preview=1 (the admin's Preview button). */
async function loadProduct({ params, searchParams }: PageProps) {
  const [{ slug }, { preview }] = await Promise.all([params, searchParams])
  const wantsPreview = preview === "1" && isStaffRole((await getCurrentUser().catch(() => null))?.role)
  return getProductBySlug(slug, { preview: wantsPreview })
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const product = await loadProduct(props)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.seoTitle || `${product.title} | SUOS`,
    description: product.seoDescription || product.description?.slice(0, 160) || `Buy ${product.title} at SUOS`,
    // Draft previews must never be indexed.
    ...(product.isDraft ? { robots: { index: false, follow: false } } : {}),
  }
}

/** Breadcrumbs are set in normal case (Figma); product data is stored uppercase. */
function toDisplayCase(label: string) {
  if (label !== label.toUpperCase()) return label
  return label.toLowerCase().replace(/(^|[\s(/-])(\p{L})/gu, (_, sep, char) => sep + char.toUpperCase())
}

export default async function Page(props: PageProps) {
  const product = await loadProduct(props)

  if (!product) {
    notFound()
  }

  // Same banner as the product's collection page, shown just before the footer.
  const banner = await getCollectionBanner(product.collectionSlug)

  return (
    <main className="flex-1 bg-white text-black w-full min-w-0 overflow-x-clip">
      {product.isDraft ? (
        <p className="bg-amber-100 px-4 py-2 text-center text-caption text-amber-900">
          Preview of a Draft product: only staff can see this page until it is set to Active.
        </p>
      ) : null}
      <section className="relative w-full min-w-0 overflow-x-clip px-4 pb-10 pt-3 max-md:!pt-0 sm:px-6 sm:pb-16 sm:pt-5 lg:px-8 lg:pt-6">
        <div className="w-full min-w-0">
          {/* Mobile design: no breadcrumb, the gallery starts right under the header. */}
          <nav aria-label="Breadcrumb" className="overflow-x-auto scrollbar-none py-1 text-body text-ink-400 max-md:hidden">
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

          <div className="mt-3 max-md:!mt-0 sm:mt-5 grid w-full min-w-0 gap-6 max-md:!gap-4 sm:gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-10 xl:gap-14">
            <ProductGallery images={product.gallery} />
            <ProductSummary product={product} />
          </div>
        </div>
      </section>
      {/* Figma order: details → You May Also Like → lifestyle image; marquee + footer come from SiteFooter. */}
      <ProductHighlightsSection intro={product.highlightsIntro} highlights={product.highlights} />
      <YouMayAlsoLikeSection excludeProductId={product.id} pickedIds={product.alsoLikeIds} />
      {product.lifestyleImage ? (
        <section data-reveal="zoom" data-scroll-zoom className="relative aspect-[3/2] w-full overflow-hidden bg-[#efefef] sm:aspect-[1440/720]">
          <Image
            src={product.lifestyleImage}
            alt={`${product.title} lifestyle`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </section>
      ) : null}
      {product.isDraft ? null : (
        <RecentlyViewed
          current={{
            id: product.id,
            slug: product.slug,
            title: product.title,
            image: product.gallery[0]?.src ?? "",
            hoverImage: product.gallery[1]?.src,
            price: product.price,
            line: product.editLabel,
          }}
        />
      )}
      <CollectionBanner {...banner} />
    </main>
  )
}
