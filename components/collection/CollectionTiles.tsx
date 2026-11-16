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

  // Desktop: a flex row (fixed height, about 2:3 tiles at rest) where the
  // hovered tile widens and the others give way; phones keep the grid.
  const rowHeight =
    tiles.length >= 4 ? "lg:h-[min(37.5vw,760px)]" : tiles.length === 3 ? "lg:h-[min(44vw,760px)]" : "lg:h-[min(48vw,700px)]"

  return (
    <section aria-label={heading ?? "Shop by collection"} className="w-full bg-white">
      {heading ? (
        <h2 className="type-title px-4 pb-5 pt-12 text-black sm:px-6 lg:px-8">
          {heading}
        </h2>
      ) : null}
      <div className={`expand-row grid grid-cols-2 gap-0.5 lg:flex ${rowHeight}`}>
        {tiles.map((tile, index) => (
          <Link
            key={tile.id}
            href={`/collections/${tile.slug}`}
            className={`group relative block overflow-hidden bg-[#e7e7e4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black lg:aspect-auto lg:h-full lg:min-w-0 ${
              tiles.length === 3 && index === 2
                ? "col-span-2 aspect-[3/2]"
                : "aspect-[3/4]"
            }`}
          >
            <Image
              src={tile.image}
              alt={tile.alt}
              fill
              sizes="50vw"
              className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
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
