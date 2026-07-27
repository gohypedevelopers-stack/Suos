"use client"

import Image from "next/image"
import Link from "next/link"

import { trendingProducts } from "@/components/product/productData"
import { useContinuousDraggableCarousel } from "@/components/home/useContinuousDraggableCarousel"

export function CollectionRecommendations() {
  const products = trendingProducts.slice(0, 6)
  const {
    viewportRef,
    trackRef,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useContinuousDraggableCarousel({
    slideCount: products.length,
  })

  return (
    <section
      aria-labelledby="collection-recommendations-heading"
      className="w-full overflow-hidden border-t border-black/10 bg-white py-12 text-black sm:py-14"
    >
      <div>
        <div className="flex items-center justify-between gap-6">
          <h2
            id="collection-recommendations-heading"
            className="font-heading text-[24px] font-normal uppercase leading-none tracking-[-0.04em]"
          >
            You May Also Like
          </h2>

          <Link
            href="/collections"
            className="group hidden flex-col items-start pb-0.5 text-[13px] font-normal uppercase leading-none tracking-normal transition-opacity hover:opacity-70 sm:inline-flex"
          >
            <span>View all</span>
            <span
              aria-hidden="true"
              className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100"
            />
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
        >
          <div ref={trackRef} className="continuous-carousel-track">
            {[...products, ...products, ...products].map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                href="/products"
                className="recommendation-card group"
                aria-label={`View ${product.alt}`}
                aria-hidden={index >= products.length}
                tabIndex={index >= products.length ? -1 : undefined}
              >
                <div className="relative aspect-[330/479] overflow-hidden bg-[#e7e7e4]">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 640px) 42vw, (max-width: 1024px) 20vw, 12vw"
                    className="object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-7 flex justify-center sm:hidden">
          <Link
            href="/collections"
            className="inline-flex h-9 min-w-[102px] items-center justify-center border border-black px-6 text-[13px] font-normal uppercase leading-none tracking-normal transition-colors hover:bg-black hover:text-white"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  )
}
