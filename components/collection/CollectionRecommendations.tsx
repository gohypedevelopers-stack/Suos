"use client"

import { HoverSwapImage } from "@/components/HoverSwapImage"
import Link from "next/link"

import { useContinuousDraggableCarousel } from "@/components/home/useContinuousDraggableCarousel"
import type { ProductCard } from "@/components/home/TrendingSection"

export function CollectionRecommendations({ products = [] }: { products?: ProductCard[] }) {
  const displayProducts = products.slice(0, 6)
  const {
    viewportRef,
    trackRef,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
  } = useContinuousDraggableCarousel({
    slideCount: displayProducts.length || 1,
  })

  if (!displayProducts.length) return null

  return (
    <section
      aria-labelledby="collection-recommendations-heading"
      className="w-full overflow-hidden border-t border-black/10 bg-white py-12 text-black sm:py-14"
    >
      <div>
        <div className="flex items-center justify-between gap-6">
          <h2
            id="collection-recommendations-heading"
            className="type-title"
          >
            You May Also Like
          </h2>

          <Link
            href="/shop"
            className="hidden text-body text-ink-650 underline underline-offset-[5px] transition-colors hover:text-black sm:inline"
          >
            View all
          </Link>
        </div>

        <div
          ref={viewportRef}
          className="continuous-carousel-viewport mt-7"
          tabIndex={0}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClickCapture={onClickCapture}
        >
          <div ref={trackRef} className="continuous-carousel-track">
            {[...displayProducts, ...displayProducts, ...displayProducts].map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                href={`/products/${product.slug}`}
                className="recommendation-card group"
                aria-label={`View ${product.alt}`}
                aria-hidden={index >= displayProducts.length}
                tabIndex={index >= displayProducts.length ? -1 : undefined}
              >
                <div className="relative aspect-[330/479] overflow-hidden bg-[#e7e7e4]">
                  <HoverSwapImage
                    src={product.image}
                    hoverSrc={product.gallery?.[1]}
                    alt={product.alt}
                    sizes="(max-width: 640px) 42vw, (max-width: 1024px) 20vw, 12vw"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-7 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex h-10 min-w-[102px] items-center justify-center border border-black px-6 text-[13px] font-normal uppercase leading-none tracking-[0.04em] transition-colors hover:bg-black hover:text-white"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  )
}
