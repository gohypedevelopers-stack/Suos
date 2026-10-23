import Image from "next/image"
import Link from "next/link"

import { CollectionHero } from "@/components/collection/CollectionHero"
import { resolvePage, type ResolvedPage } from "@/lib/page-content"
import { getSiteContent } from "@/lib/server/dal/site-content"
import {
  listPublishedCollectionsWithImages,
  type PublishedCollectionWithImages,
} from "@/lib/server/dal/collections"

const FALLBACK_HERO = "/home-page-content/hero-1.png"
const FALLBACK_DESCRIPTION =
  "This denim is washed and finished using closed-loop processes that cut water use and keep harsh chemicals out of the system — made to be worn hard and kept for years."

export async function CollectionsHub() {
  const [collections, siteContent] = await Promise.all([listPublishedCollectionsWithImages(5), getSiteContent()])
  const page = resolvePage("collectionsPage", siteContent.collectionsPage)
  const hero = collections.find((collection) => collection.image)
  const heroImage = page.text("hero", "src") || hero?.image || FALLBACK_HERO

  return (
    <div className="w-full bg-white text-black">
      <h1 className="sr-only">Collections</h1>

      {page.show("hero") ? (
        <CollectionHero
          image={heroImage}
          alt={page.text("hero", "src") ? page.text("hero", "alt") : hero?.alt || page.text("hero", "alt")}
          heightClassName="h-[60vh] min-h-[360px] sm:h-[72vh]"
        />
      ) : null}

      {collections.length > 0 ? (
        collections.map((collection) => (
          <CollectionSection key={collection.id} collection={collection} />
        ))
      ) : (
        <EmptyCollections page={page} />
      )}
    </div>
  )
}

function CollectionSection({
  collection,
}: {
  collection: PublishedCollectionWithImages
}) {
  const headingId = `collection-${collection.slug}`
  const href = `/collections/${collection.slug}`

  return (
    <section aria-labelledby={headingId} className="w-full">
      <h2
        id={headingId}
        className="px-4 pb-4 pt-10 text-[14px] font-normal uppercase leading-[1.15] tracking-[0.04em] sm:px-6 sm:pb-5 sm:pt-14 sm:text-[16px] lg:px-8"
      >
        {collection.title}
      </h2>

      <CollectionMosaic
        images={collection.images}
        href={href}
        title={collection.title}
      />

      <div className="flex flex-col items-center bg-[#fbf3f1] px-4 py-12 text-center sm:px-6 sm:py-16">
        <p className="font-heading text-[20px] font-normal uppercase leading-[1.15] tracking-[0.01em] sm:text-[24px]">
          Shop {collection.title} Collection
        </p>
        <p className="mt-3 max-w-[520px] text-[13px] font-normal leading-[1.4] text-black/70 sm:text-[14px]">
          {collection.description || FALLBACK_DESCRIPTION}
        </p>
        <Link
          href={href}
          className="mt-6 inline-flex h-9 min-w-[128px] items-center justify-center border border-black px-6 text-[12px] font-normal uppercase leading-none tracking-[0.04em] transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:h-10 sm:text-[13px]"
          aria-label={`Shop the ${collection.title} collection`}
        >
          Shop now
        </Link>
      </div>
    </section>
  )
}

type Tile = { className: string; sizes: string }

/**
 * Tile classes for a mosaic of `count` images. Desktop uses a 6-column grid:
 *   5 images: [wide 2/3 | 1/3] then [1/3 | 1/3 | 1/3]
 *   4 images: [wide 2/3 | 1/3] then [1/2 | 1/2]
 *   3 images: three equal columns
 *   2 images: two halves
 *   1 image : one wide banner
 * Mobile uses 2 columns: the first image full width, the rest in pairs.
 */
function mosaicTiles(count: number): Tile[] {
  const big: Tile = {
    className: "col-span-2 aspect-[4/5] lg:col-span-4 lg:aspect-[16/11]",
    sizes: "(max-width: 1024px) 100vw, 67vw",
  }
  const side: Tile = {
    className: "col-span-1 aspect-[3/4] lg:col-span-2 lg:aspect-auto",
    sizes: "(max-width: 1024px) 50vw, 33vw",
  }
  const third: Tile = {
    className: "col-span-1 aspect-[3/4] lg:col-span-2",
    sizes: "(max-width: 1024px) 50vw, 33vw",
  }
  const half: Tile = {
    className: "col-span-1 aspect-[3/4] lg:col-span-3 lg:aspect-[4/3]",
    sizes: "50vw",
  }
  const lastFull: Tile = {
    className: "col-span-2 aspect-[4/3] lg:col-span-3",
    sizes: "(max-width: 1024px) 100vw, 50vw",
  }

  switch (count) {
    case 0:
      return []
    case 1:
      return [{ className: "col-span-2 aspect-[4/5] sm:aspect-[16/9] lg:col-span-6 lg:aspect-[21/9]", sizes: "100vw" }]
    case 2:
      return [
        { className: "col-span-1 aspect-[3/4] lg:col-span-3 lg:aspect-[4/5]", sizes: "50vw" },
        { className: "col-span-1 aspect-[3/4] lg:col-span-3 lg:aspect-[4/5]", sizes: "50vw" },
      ]
    case 3:
      return [
        { className: "col-span-2 aspect-[4/5] lg:col-span-2 lg:aspect-[3/4]", sizes: "(max-width: 1024px) 100vw, 33vw" },
        third,
        third,
      ]
    case 4:
      return [big, side, half, lastFull]
    default:
      return [big, side, third, third, third]
  }
}

function CollectionMosaic({
  images,
  href,
  title,
}: {
  images: PublishedCollectionWithImages["images"]
  href: string
  title: string
}) {
  const shown = images.slice(0, 5)
  const tiles = mosaicTiles(shown.length)

  if (!tiles.length) {
    return (
      <Link
        href={href}
        className="flex aspect-[16/9] w-full items-center justify-center bg-[#e7e7e4] lg:aspect-[21/9]"
        aria-label={`Shop the ${title} collection`}
      >
        <span className="font-heading text-[32px] font-normal uppercase leading-[1.15] tracking-[0.01em] text-black/20">
          {title}
        </span>
      </Link>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-0.5 lg:grid-cols-6">
      {shown.map((image, index) => (
        <Link
          key={image.src}
          href={href}
          tabIndex={index === 0 ? undefined : -1}
          aria-label={index === 0 ? `Shop the ${title} collection` : undefined}
          aria-hidden={index === 0 ? undefined : true}
          className={`group relative block overflow-hidden bg-[#e7e7e4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black ${tiles[index].className}`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={tiles[index].sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </Link>
      ))}
    </div>
  )
}

function EmptyCollections({ page }: { page: ResolvedPage }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-heading text-[24px] font-normal uppercase leading-[1.15] tracking-[0.01em]">
        {page.text("empty", "heading")}
      </p>
      <p className="mt-3 max-w-sm text-[14px] leading-[1.4] text-black/60">
        {page.text("empty", "text")}
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex h-10 min-w-[140px] items-center justify-center border border-black px-6 text-[13px] uppercase leading-none tracking-[0.04em] transition-colors hover:bg-black hover:text-white"
      >
        {page.text("empty", "button")}
      </Link>
    </div>
  )
}
