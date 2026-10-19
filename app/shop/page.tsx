import type { Metadata } from "next"
import Link from "next/link"

import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionRecommendations } from "@/components/collection/CollectionRecommendations"
import { ProductListing, buildEditorialImages } from "@/components/collection/ProductListing"
import { parseSort, sortProducts } from "@/components/collection/productSort"
import { listPublishedProducts } from "@/lib/server/dal/products"

export const metadata: Metadata = {
  title: "Shop All | SUOS",
  description: "Shop every SUOS piece — denim, shirts and essentials for men.",
}

export const dynamic = "force-dynamic"

type SearchParams = { [key: string]: string | string[] | undefined }

const FILTER_TITLES = {
  new: "New Arrivals",
  bestsellers: "Bestsellers",
  sale: "Sale",
} as const

type ShopFilter = keyof typeof FILTER_TITLES

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const query = await searchParams
  const allProducts = await listPublishedProducts()

  const categoryParam = first(query.category)
  const categorySlug = categoryParam ? slugify(categoryParam) : undefined
  const filterParam = first(query.filter)?.toLowerCase()
  const filter: ShopFilter | undefined =
    filterParam && filterParam in FILTER_TITLES ? (filterParam as ShopFilter) : undefined
  const sort = parseSort(query.sort)

  let products = allProducts
  let categoryName: string | undefined

  if (categorySlug) {
    products = products.filter((product) => {
      const category = product.category
      if (!category) return false
      const matches =
        category.slug.toLowerCase() === categorySlug || slugify(category.name) === categorySlug
      if (matches) categoryName ??= category.name
      return matches
    })
  }

  if (filter === "new") {
    // Products arrive newest first; prefer explicitly tagged new arrivals.
    const tagged = products.filter((product) => product.badge === "NEW ARRIVAL")
    products = tagged.length > 0 ? tagged : products.slice(0, 24)
  } else if (filter === "bestsellers") {
    products = products.filter((product) => product.badge === "BESTSELLER")
  } else if (filter === "sale") {
    products = products.filter((product) => Boolean(product.compareAtPrice))
  }

  const sorted = sortProducts(
    products,
    sort,
    allProducts.map((product) => product.id),
  )

  const title = [categoryName ?? (categorySlug ? categoryParam : undefined), filter ? FILTER_TITLES[filter] : undefined]
    .filter(Boolean)
    .join(" — ") || "Shop All"

  const shownIds = new Set(sorted.map((product) => product.id))
  const recommendations = [
    ...allProducts.filter((product) => !shownIds.has(product.id)),
    ...allProducts.filter((product) => shownIds.has(product.id)),
  ]

  return (
    <main className="flex-1 bg-white">
      <ProductListing
        title={title}
        products={sorted}
        sort={sort}
        editorialImages={buildEditorialImages(sorted)}
        emptyState={<EmptyShop hasFilters={Boolean(categorySlug || filter)} />}
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <CollectionRecommendations products={recommendations} />
      </div>

      <CollectionBenefitsBar />
    </main>
  )
}

function EmptyShop({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center border-t border-black/10 px-4 py-16 text-center">
      <p className="font-heading text-[20px] font-normal uppercase leading-[1.15] tracking-[0.01em] text-black sm:text-[24px]">
        Nothing here yet
      </p>
      <p className="mt-3 max-w-sm text-[14px] leading-[1.4] text-black/60">
        {hasFilters
          ? "We couldn't find pieces matching this selection. New styles land often — have a look at everything else."
          : "New pieces are on their way. Check back soon."}
      </p>
      {hasFilters ? (
        <Link
          href="/shop"
          className="mt-6 inline-flex h-10 min-w-[140px] items-center justify-center border border-black px-6 text-[13px] uppercase leading-none tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:text-[14px]"
        >
          Shop all
        </Link>
      ) : null}
    </div>
  )
}
