"use client"

import Image from "next/image"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"

type SearchSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const trendingSearches = [
  "MEN'S BOOTCUT DENIMS",
  "BOYFRIEND JEANS",
  "MEN'S DENIM JACKET",
  "SKINNY DENIMS",
]

const featuredProducts = [
  {
    id: "featured-1",
    image: "/images/products/product1.png",
    alt: "Model in blue denim standing against a dark gradient background",
    imageClassName: "object-[center_16%]",
  },
  {
    id: "featured-2",
    image: "/images/products/product2.png",
    alt: "Model in a denim jacket in a monochrome setting",
    imageClassName: "object-[center_14%]",
  },
  {
    id: "featured-3",
    image: "/images/products/product7.png",
    alt: "Model in denim seated beside greenery",
    imageClassName: "object-[center_32%]",
  },
]

function FeaturedImage({
  image,
  alt,
  imageClassName,
  wide = false,
}: {
  image: string
  alt: string
  imageClassName?: string
  wide?: boolean
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#111]",
        wide ? "aspect-[16/11]" : "aspect-[3/4]"
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 420px) 50vw, 210px"
        className={cn("object-cover", imageClassName)}
      />
    </div>
  )
}

export function SearchSidebar({ open, onOpenChange }: SearchSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="z-[120] bg-black/50 backdrop-blur-[1px]"
        className="z-[130] border-l border-white/10 bg-black p-0 text-white shadow-[0_0_80px_rgba(0,0,0,0.45)] ease-in-out duration-300"
        style={{ width: "min(100vw, 420px)", maxWidth: "none" }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <SheetTitle className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white">
              Search
            </SheetTitle>

            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/90 transition-opacity hover:opacity-60"
              >
                <span>Close</span>
                <X className="size-4 stroke-[1.8]" />
              </button>
            </SheetClose>
          </div>

          <SheetDescription className="sr-only">
            Search products, browse trending searches, and view featured best sellers.
          </SheetDescription>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="relative">
              <input
                type="search"
                autoFocus
                aria-label="Search anything"
                placeholder="Search anything....."
                className={cn(
                  "h-11 w-full border border-white/70 bg-transparent px-4 pr-10 text-[0.72rem] uppercase tracking-[0.14em] text-white outline-none placeholder:text-white/60"
                )}
              />
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 stroke-[1.8] text-white/80"
              />
            </div>

            <section className="mt-10">
              <p className="text-[0.72rem] uppercase tracking-[0.16em] text-white/40">
                Trending Searches
              </p>

              <div className="mt-5 space-y-4">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="block text-left text-[0.82rem] uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-70"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <p className="text-[0.72rem] uppercase tracking-[0.16em] text-white/40">
                Featured Best Sellers
              </p>

              <div className="mt-5 grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <FeaturedImage
                    image={featuredProducts[0].image}
                    alt={featuredProducts[0].alt}
                    imageClassName={featuredProducts[0].imageClassName}
                  />
                  <FeaturedImage
                    image={featuredProducts[1].image}
                    alt={featuredProducts[1].alt}
                    imageClassName={featuredProducts[1].imageClassName}
                  />
                </div>

                <FeaturedImage
                  wide
                  image={featuredProducts[2].image}
                  alt={featuredProducts[2].alt}
                  imageClassName={featuredProducts[2].imageClassName}
                />
              </div>
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
