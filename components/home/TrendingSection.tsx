"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal"
import {
  featuredProduct,
  trendingProducts,
  type ProductCard,
} from "@/components/product/productData"

const tabs = [
  { label: "ALL", active: false },
  { label: "WOMEN", active: false },
  { label: "MEN", active: true },
] as const

const hoverSizes = ["28", "32", "36", "42"]

function ColorSwatches({ swatches }: { swatches: string[] }) {
  return (
    <div className="flex items-start gap-1">
      {swatches.map((swatch) => (
        <span
          key={swatch}
          className="group/swatch relative inline-flex cursor-pointer flex-col items-center pb-0.5"
        >
          <span
            className="size-[15px] border border-black/10"
            style={{ backgroundColor: swatch }}
          />
          <span
            aria-hidden="true"
            className="mt-[1px] h-px w-full origin-left scale-x-0 bg-black/55 transition-transform duration-200 group-hover/swatch:scale-x-100"
          />
        </span>
      ))}
    </div>
  )
}

function SizeMarker({ size }: { size: string }) {
  return (
    <span className="group/size relative inline-flex cursor-pointer flex-col items-center pb-0.5">
      <span className="leading-none">{size}</span>
      <span
        aria-hidden="true"
        className="mt-[1px] h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 group-hover/size:scale-x-100"
      />
    </span>
  )
}

export function ProductCardView({
  product,
  expanded = false,
}: {
  product: ProductCard
  expanded?: boolean
}) {
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

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
          <span className="absolute left-3 top-3 z-10 bg-black px-2.5 py-1 text-[13px] font-light uppercase leading-none tracking-normal text-white">
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={`Quick view ${product.alt}`}
          onClick={(event) => {
            event.stopPropagation()
            setQuickViewOpen(true)
          }}
          className={cn(
            "absolute right-3 top-3 z-10 inline-flex size-5 translate-y-0 cursor-pointer items-center justify-center border border-black/20 bg-white text-black opacity-100 transition-colors duration-200 hover:bg-[#e5e5e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          )}
        >
          <Plus className="size-3.5 stroke-[2.1]" />
        </button>

        {hasGalleryControls ? (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                aria-label="Previous product image"
                onClick={(event) => {
                  event.stopPropagation()
                  handlePreviousImage()
                }}
                className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-none text-white/90 transition-colors duration-200 hover:bg-white/15 hover:text-white"
              >
                <ChevronLeft className="size-5" strokeWidth={2.25} />
              </button>

              <button
                type="button"
                aria-label="Next product image"
                onClick={(event) => {
                  event.stopPropagation()
                  handleNextImage()
                }}
                className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-none text-white/90 transition-colors duration-200 hover:bg-white/15 hover:text-white"
              >
                <ChevronRight className="size-5" strokeWidth={2.25} />
              </button>
          </div>
        ) : null}

        <div
          className={cn(
            "absolute inset-x-3 bottom-3 z-10 overflow-hidden bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-[height,padding] duration-300 ease-out",
            expanded ? "h-[140px]" : "h-[56px] group-hover:h-[140px]"
          )}
        >
          {!expanded ? (
            <div className="flex h-full items-start justify-between gap-2.5 p-3 transition-opacity duration-200 group-hover:opacity-0">
              <div className="min-w-0">
                <p className="text-[13px] font-normal uppercase leading-tight tracking-normal">
                  NAME OF THE PRODUCT
                </p>
                <p className="mt-0.5 text-[13px] uppercase leading-tight tracking-normal">
                  PRICE
                </p>
              </div>

              <ColorSwatches swatches={product.swatches} />
            </div>
          ) : null}

          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex flex-col gap-2.5 p-3 opacity-0 transition-all duration-300 ease-out",
              expanded
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] font-normal uppercase leading-tight tracking-normal">
                  NAME OF THE PRODUCT
                </p>
                <p className="mt-0.5 text-[13px] uppercase leading-tight tracking-normal">
                  PRICE
                </p>
              </div>

              <ColorSwatches swatches={product.swatches} />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap items-start gap-1.5 text-[13px] font-normal uppercase leading-tight tracking-normal text-black/75">
                  {hoverSizes.map((size) => (
                    <SizeMarker key={size} size={size} />
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="flex h-10 w-full cursor-pointer items-center justify-center border border-black bg-white text-[13px] uppercase tracking-normal transition-colors hover:bg-black hover:text-white"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductQuickViewModal
        key={`${product.id}-${quickViewOpen ? "open" : "closed"}-${activeImageIndex}`}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        product={featuredProduct}
        gallery={gallery}
        initialImageIndex={activeImageIndex}
      />
    </article>
  )
}

export function TrendingSection() {
  return (
    <section className="w-full bg-white px-4 py-14 text-black sm:px-6 lg:px-8 md:py-16">
      <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-heading text-[40px] font-normal uppercase leading-none tracking-[-0.04em]">
          Trending
        </h2>

        <div className="flex items-center gap-6 sm:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              aria-pressed={tab.active}
              className={cn(
                "group inline-flex flex-col items-start pb-0.5 text-[13px] font-normal uppercase leading-none tracking-normal transition-opacity hover:opacity-70"
              )}
            >
              <span>{tab.label}</span>
              <span
                aria-hidden="true"
                className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100"
              />
            </button>
          ))}
        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {trendingProducts.map((product) => (
          <ProductCardView key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/collections"
          className="inline-flex h-9 items-center justify-center border border-black px-5 text-[13px] font-normal uppercase tracking-normal transition-colors hover:bg-black hover:text-white"
        >
          View All
        </Link>
      </div>
    </section>
  )
}
