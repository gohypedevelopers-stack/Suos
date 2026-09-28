import Image from "next/image"
import Link from "next/link"

import { listPublishedCollections } from "@/lib/server/dal/collections"

export async function CollectionsHub() {
  const collections = await listPublishedCollections()

  return (
    <section className="w-full bg-white">
      {/* Page Header */}
      <div className="border-b border-black/10 px-4 pb-6 pt-8 sm:px-6 md:pt-10 lg:px-8">
        <h1 className="font-heading text-[24px] font-[400] uppercase leading-none tracking-[-0.05em] text-black">
          Collections
        </h1>
        <p className="mt-2 text-[13px] font-normal uppercase tracking-[0.04em] text-black/50">
          {collections.length} {collections.length === 1 ? "Collection" : "Collections"}
        </p>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyCollections />
      )}
    </section>
  )
}

type CollectionItem = Awaited<ReturnType<typeof listPublishedCollections>>[number]

function CollectionCard({ collection }: { collection: CollectionItem }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative block overflow-hidden bg-[#f0ede8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      aria-label={`Browse the ${collection.title} collection — ${collection.productCount} ${collection.productCount === 1 ? "item" : "items"}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e8e4de]">
        {collection.image.length > 0 ? (
          <Image
            src={collection.image}
            alt={collection.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-[1.03]"
          />
        ) : (
          /* Placeholder when no image is set */
          <div className="flex h-full w-full items-center justify-center bg-[#e8e4de]">
            <span className="font-heading text-[64px] font-[400] uppercase leading-none tracking-[-0.05em] text-black/10">
              {collection.title.slice(0, 1)}
            </span>
          </div>
        )}

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Text overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="font-heading text-[22px] font-[400] uppercase leading-none tracking-[-0.04em]">
            {collection.title}
          </p>
          <p className="mt-1.5 text-[12px] font-normal uppercase tracking-[0.08em] text-white/75">
            {collection.productCount} {collection.productCount === 1 ? "item" : "items"}
          </p>
          {collection.description ? (
            <p className="mt-2 line-clamp-2 max-w-xs text-[12px] leading-relaxed text-white/60">
              {collection.description}
            </p>
          ) : null}

          {/* CTA */}
          <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-normal uppercase tracking-[0.1em] text-white/80 transition-all duration-200 group-hover:text-white">
            Shop now
            <span
              aria-hidden="true"
              className="block h-px w-0 origin-left bg-white transition-all duration-300 group-hover:w-10"
            />
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyCollections() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-heading text-[20px] font-[400] uppercase leading-none tracking-[-0.04em] text-black">
        No Collections Yet
      </p>
      <p className="mt-3 max-w-sm text-[13px] uppercase tracking-[0.04em] text-black/50">
        Collections are being curated. Check back soon.
      </p>
    </div>
  )
}
