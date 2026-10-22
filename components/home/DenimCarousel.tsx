import Image from "next/image"
import Link from "next/link"

import type { HomeCarouselSlide } from "@/lib/server/dal/banners"

type CategoryTile = {
  id: string
  image: string
  alt: string
  label: string
  href: string
}

const TILE_COUNT = 3

/** Shown until the Denim Carousel slides are set in Banners → 04. */
const DEFAULT_TILES: CategoryTile[] = ["Originals", "Freedom", "Timeless"].map((label) => ({
  id: `default-${label.toLowerCase()}`,
  image: "/images/products/product5-white.png",
  alt: `${label} collection`,
  label,
  href: `/collections/${label.toLowerCase()}`,
}))

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function toTile(slide: HomeCarouselSlide): CategoryTile {
  // The slide name (subtitle) is the label; the title is the image description.
  const label = slide.subtitle?.trim() || slide.title?.trim() || "Shop"
  const link = slide.ctaLink?.trim()
  return {
    id: slide.id,
    image: slide.desktopImageUrl,
    alt: slide.title || `${label} collection`,
    label,
    // A bare "/collections" link is the old seed default; prefer the collection page.
    href: link && link !== "/collections" ? link : `/collections/${slugify(label)}`,
  }
}

/** Figma: 3 tall photo tiles across the full width, white label bottom-left. */
export function DenimCarousel({ slides }: { slides?: HomeCarouselSlide[] }) {
  const tiles = slides && slides.length > 0 ? slides.slice(0, TILE_COUNT).map(toTile) : DEFAULT_TILES

  return (
    <section className="flex w-full snap-x snap-mandatory gap-1 overflow-x-auto bg-white [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-0 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
      <h2 className="sr-only">Shop by collection</h2>
      {tiles.map((tile) => (
        <Link
          key={tile.id}
          href={tile.href}
          aria-label={`Shop ${tile.label}`}
          className="group relative block aspect-[480/834] w-[78vw] shrink-0 snap-start overflow-hidden bg-[#efefef] sm:w-auto"
        >
          <Image
            src={tile.image}
            alt={tile.alt}
            fill
            sizes="(max-width: 639px) 100vw, 33vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute bottom-5 left-5 z-10 text-[18px] font-medium uppercase leading-none tracking-normal text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] sm:bottom-6 sm:left-6 lg:text-h3">
            <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-current">
              {tile.label}
            </span>
          </span>
        </Link>
      ))}
    </section>
  )
}
