import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionGrid } from "@/components/collection/CollectionGrid"
import { CollectionHeader } from "@/components/collection/CollectionHeader"
import { CollectionRecommendations } from "@/components/collection/CollectionRecommendations"
import { getPublishedCollectionBySlug } from "@/lib/server/dal/collections"
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
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [collection, allProducts] = await Promise.all([
    getPublishedCollectionBySlug(slug),
    listPublishedProducts(),
  ])

  if (!collection) {
    notFound()
  }

  return (
    <main className="flex-1 bg-white">
      <section className="w-full bg-white px-4 pb-0 pt-8 text-black sm:px-6 md:pt-10 lg:px-8">
        <CollectionHeader
          title={collection.title}
          description={collection.description}
          itemCount={collection.products.length}
        />

        <div className="mt-8">
          <CollectionGrid products={collection.products} />
        </div>

        <CollectionRecommendations products={allProducts} />
        <CollectionBenefitsBar />
      </section>
    </main>
  )
}
