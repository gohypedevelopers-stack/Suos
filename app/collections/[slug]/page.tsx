import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { CollectionBanner } from "@/components/collection/CollectionBanner"
import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionHero } from "@/components/collection/CollectionHero"
import { CollectionRecommendations } from "@/components/collection/CollectionRecommendations"
import { CollectionTiles } from "@/components/collection/CollectionTiles"
import { ProductListing, buildEditorialImages } from "@/components/collection/ProductListing"
import { parseSort, sortProducts } from "@/components/collection/productSort"
import {
  getPublishedCollectionBySlug,
  listPublishedCollectionsWithImages,
} from "@/lib/server/dal/collections"
import { listPublishedProducts } from "@/lib/server/dal/products"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const collection = await getPublishedCollectionBySlug(slug)

  if (!collection) {
    return {
      title: "Collection Not Found | SUOS",
    }
  }

  return {
    title: `${collection.title} | SUOS`,
    description: collection.description || `Browse the ${collection.title} collection at SUOS.`,
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const [collection, allProducts, collections] = await Promise.all([
    getPublishedCollectionBySlug(slug),
    listPublishedProducts(),
    listPublishedCollectionsWithImages(),
  ])

  if (!collection) {
    // Launch links (Originals, Freedom, Timeless) may point at collections not
    // created or published yet; send shoppers to Shop All instead of a 404.
    redirect("/shop")
  }

  const sort = parseSort(query.sort)
  const products = sortProducts(
    collection.products,
    sort,
    allProducts.map((product) => product.id),
  )

  const heroImage =
    collection.image || collection.products[0]?.image || "/home-page-content/hero-1.png"

  const otherCollections = collections.filter((item) => item.id !== collection.id)
  const editorialImages = buildEditorialImages(
    collection.products,
    otherCollections.flatMap((item) =>
      item.images.slice(0, 1).map((image) => ({
        ...image,
        href: `/collections/${item.slug}`,
      })),
    ),
  )

  const bannerSource = otherCollections.find((item) => item.image)
  const banner = bannerSource
    ? {
        image: bannerSource.image,
        alt: bannerSource.alt,
        href: `/collections/${bannerSource.slug}`,
      }
    : { image: "/home-page-content/hero-2.png", alt: "SUOS", href: "/shop" }

  const collectionIds = new Set(collection.products.map((product) => product.id))
  const recommendations = [
    ...allProducts.filter((product) => !collectionIds.has(product.id)),
    ...allProducts.filter((product) => collectionIds.has(product.id)),
  ]

  return (
    <main className="flex-1 bg-white">
      <CollectionHero
        image={heroImage}
        alt={collection.alt}
        ctaLabel="Shop now"
        ctaHref="#products"
      />

      <ProductListing
        id="products"
        title={collection.title}
        products={products}
        sort={sort}
        editorialImages={editorialImages}
        emptyState={
          <p className="py-16 text-center text-[14px] uppercase leading-[1.4] tracking-[0.04em] text-black/55">
            New pieces are on their way. Check back soon.
          </p>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <CollectionRecommendations products={recommendations} />
      </div>

      <CollectionTiles
        collections={collections.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          image: item.image,
          alt: item.alt,
        }))}
      />

      <div className="mt-0.5">
        <CollectionBanner {...banner} />
      </div>

      <CollectionBenefitsBar />
    </main>
  )
}
