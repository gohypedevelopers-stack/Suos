"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

export type ProductCard = {
  id: string
  image: string
  alt: string
  badge?: string
  featured?: boolean
  sizes?: string[]
  swatches: string[]
  gallery?: string[]
}

const tabs = [
  { label: "ALL", active: false },
  { label: "WOMEN", active: false },
  { label: "MEN", active: true },
] as const

const hoverSizes = ["28", "32", "36", "42"]

const products: ProductCard[] = [
  {
    id: "product-1",
    image: "/images/products/product1.png",
    alt: "Model wearing a blue denim outfit",
    badge: "NEW ARRIVAL",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product1.png",
      "/images/products/product5.png",
      "/images/products/product9.png",
      "/images/products/product13.png",
    ],
  },
  {
    id: "product-2",
    image: "/images/products/product2.png",
    alt: "Model wearing a denim jacket in monochrome",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product2.png",
      "/images/products/product6.png",
      "/images/products/product10.png",
      "/images/products/product14.png",
    ],
  },
  {
    id: "product-3",
    image: "/images/products/product3.png",
    alt: "Model seated in a black tailored look",
    badge: "BESTSELLER",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product3.png",
      "/images/products/product7.png",
      "/images/products/product11.png",
      "/images/products/product15.png",
    ],
  },
  {
    id: "product-4",
    image: "/images/products/product4.png",
    alt: "Model wearing an all-black outfit",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product4.png",
      "/images/products/product8.png",
      "/images/products/product12.png",
      "/images/products/product5-white.png",
    ],
  },
  {
    id: "product-5-featured",
    image: "/images/products/product4.png",
    alt: "Model wearing an all-black outfit",
    featured: true,
    sizes: ["28", "32", "36", "42"],
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product4.png",
      "/images/products/product8.png",
      "/images/products/product12.png",
      "/images/products/product5-white.png",
    ],
  },
  {
    id: "product-6",
    image: "/images/products/product3.png",
    alt: "Model seated in a black tailored look",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product3.png",
      "/images/products/product7.png",
      "/images/products/product11.png",
      "/images/products/product15.png",
    ],
  },
  {
    id: "product-7",
    image: "/images/products/product1.png",
    alt: "Model wearing a blue denim outfit",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product1.png",
      "/images/products/product5.png",
      "/images/products/product9.png",
      "/images/products/product13.png",
    ],
  },
  {
    id: "product-8",
    image: "/images/products/product2.png",
    alt: "Model wearing a denim jacket in monochrome",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product2.png",
      "/images/products/product6.png",
      "/images/products/product10.png",
      "/images/products/product14.png",
    ],
  },
]

function ColorSwatches({ swatches }: { swatches: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {swatches.map((swatch) => (
        <span
          key={swatch}
          className="size-2.5 border border-black/10"
          style={{ backgroundColor: swatch }}
        />
      ))}
    </div>
  )
}

export function ProductCardView({ product }: { product: ProductCard }) {
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const activeImage = gallery[activeImageIndex] ?? product.image
  const hasGalleryControls = gallery.length > 1

  const handlePreviousImage = () => {
    setActiveImageIndex(
      (currentIndex) => (currentIndex - 1 + gallery.length) % gallery.length
    )
  }

  const handleNextImage = () => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % gallery.length)
  }

  return (
    <article className="group relative overflow-hidden bg-black shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[330/479]">
        <Image
          key={`${product.id}-${activeImageIndex}`}
          src={activeImage}
          alt={product.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
        />

        {product.badge ? (
          <span className="absolute left-2 top-2 z-10 bg-black px-2.5 py-1 text-[12px] font-light uppercase leading-none tracking-[0.16em] text-white">
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          aria-label="Expand product"
          className="absolute right-2 top-2 z-10 inline-flex size-5 translate-y-1 items-center justify-center border border-black/10 bg-white text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus className="size-3.5 stroke-[2.1]" />
        </button>

        {hasGalleryControls ? (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              type="button"
              aria-label="Previous product image"
              onClick={handlePreviousImage}
              className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full text-white/90 transition-colors duration-200 hover:bg-white/15 hover:text-white"
            >
              <ChevronLeft className="size-5" strokeWidth={2.25} />
            </button>

            <button
              type="button"
              aria-label="Next product image"
              onClick={handleNextImage}
              className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full text-white/90 transition-colors duration-200 hover:bg-white/15 hover:text-white"
            >
              <ChevronRight className="size-5" strokeWidth={2.25} />
            </button>
          </div>
        ) : null}

        <div
          className={cn(
            "absolute inset-x-3 bottom-3 z-10 overflow-hidden bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-[height,padding] duration-300 ease-out",
            "h-[56px] group-hover:h-[140px]"
          )}
        >
          <div
            className="flex h-full items-center justify-between gap-2.5 p-3 transition-opacity duration-200 group-hover:opacity-0"
          >
            <div className="min-w-0">
              <p className="text-[14px] font-medium uppercase leading-tight tracking-[0.08em]">
                NAME OF THE PRODUCT
              </p>
              <p className="mt-0.5 text-[14px] uppercase leading-tight tracking-[0.08em]">
                PRICE
              </p>
            </div>

            <ColorSwatches swatches={product.swatches} />
          </div>

          <div className="pointer-events-none absolute inset-0 flex translate-y-2 flex-col gap-2.5 p-3 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-medium uppercase leading-tight tracking-[0.08em]">
                  NAME OF THE PRODUCT
                </p>
                <p className="mt-0.5 text-[14px] uppercase leading-tight tracking-[0.08em]">
                  PRICE
                </p>
              </div>

              <ColorSwatches swatches={product.swatches} />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-[14px] uppercase tracking-[0.18em] text-black/75">
                {hoverSizes.map((size) => (
                  <span key={size}>{size}</span>
                ))}
              </div>

              <button
                type="button"
                className="flex h-10 w-full items-center justify-center border border-black bg-white text-[14px] uppercase tracking-[0.14em] transition-colors hover:bg-black hover:text-white"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function TrendingSection() {
  return (
    <section className="w-full bg-white px-4 py-14 text-black sm:px-6 lg:px-8 md:py-16">
      <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-heading text-[clamp(1.7rem,2.2vw,2.6rem)] font-semibold uppercase leading-none tracking-[-0.04em]">
          Trending
        </h2>

        <div className="flex items-center gap-6 sm:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              aria-pressed={tab.active}
              className={cn(
                "pb-1 text-[0.75rem] font-medium uppercase tracking-[0.12em] transition-opacity hover:opacity-70 sm:text-[0.875rem]",
                tab.active && "border-b border-black"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCardView key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/collections"
          className="inline-flex h-9 items-center justify-center border border-black px-5 text-[0.6875rem] uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white"
        >
          View All
        </Link>
      </div>
    </section>
  )
}
