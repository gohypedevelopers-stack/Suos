import Image from "next/image"
import Link from "next/link"

export type CollectionTile = {
  id: string
  title: string
  slug: string
  image: string
  alt: string
}

/** Row of tall collection tiles with bottom-left labels. */
export function CollectionTiles({
  collections,
  heading,
}: {
  collections: CollectionTile[]
  heading?: string
}) {
  const tiles = collections.filter((collection) => collection.image).slice(0, 4)
  if (!tiles.length) return null

  // Fewer than 2 tiles doesn't make a row worth showing.
  if (tiles.length < 2) return null

  const cols =
    tiles.length >= 4 ? "lg:grid-cols-4" : tiles.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"

  return (
    <section aria-label={heading ?? "Shop by collection"} className="w-full bg-white">
      {heading ? (
        <h2 className="px-4 pb-5 pt-12 font-heading text-[20px] font-normal uppercase leading-[1.15] tracking-[0.01em] text-black sm:px-6 sm:text-[24px] lg:px-8">
          {heading}
        </h2>
      ) : null}
      <div className={`grid grid-cols-2 gap-0.5 ${cols}`}>
        {tiles.map((tile, index) => (
          <Link
            key={tile.id}
            href={`/collections/${tile.slug}`}
            className={`group relative block overflow-hidden bg-[#e7e7e4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black lg:col-span-1 lg:aspect-[2/3] ${
              tiles.length === 3 && index === 2
                ? "col-span-2 aspect-[3/2]"
                : "aspect-[3/4]"
            }`}
          >
            <Image
              src={tile.image}
              alt={tile.alt}
              fill
              sizes={`(max-width: 1024px) 50vw, ${Math.round(100 / tiles.length)}vw`}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
            />
            <span className="absolute bottom-4 left-4 text-[14px] font-normal uppercase leading-[1.15] tracking-[0.04em] text-white sm:bottom-6 sm:left-6 sm:text-[18px]">
              {tile.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
