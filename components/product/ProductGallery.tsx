"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ProductImage } from "@/components/product/productData"

export function ProductGallery({
  images,
}: {
  images: ProductImage[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, clientWidth } = scrollRef.current
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth)
      setActiveIndex(index)
    }
  }

  return (
    <div className="w-full min-w-0 overflow-hidden">
      {/* Mobile Swipeable Gallery (< md) */}
      <div className="relative block w-full min-w-0 overflow-hidden md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full min-w-0 snap-x snap-mandatory overflow-x-auto scrollbar-none [scroll-behavior:smooth]"
        >
          {images.map((image, index) => (
            <figure
              key={`mobile-${image.src}-${index}`}
              className="relative aspect-[3/4] max-h-[460px] w-full min-w-full shrink-0 snap-center overflow-hidden bg-[#efefef]"
            >
              <Image
                src={image.src}
                alt={image.alt || `Product image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                style={
                  image.objectPosition
                    ? { objectPosition: image.objectPosition }
                    : undefined
                }
                className="object-cover"
              />
            </figure>
          ))}
        </div>

        {/* Counter Pill on Mobile */}
        {images.length > 1 && (
          <div className="pointer-events-none absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Indicator bars on mobile (same style as the product-card photo bars) */}
        {images.length > 1 && (
          <div className="mt-1 flex items-center justify-center">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: idx * scrollRef.current.clientWidth,
                      behavior: "smooth",
                    })
                  }
                }}
                aria-current={idx === activeIndex ? "true" : undefined}
                className="group/ind flex cursor-pointer items-center justify-center px-1 py-2"
              >
                <span
                  className={cn(
                    "block h-[3px] w-6 transition-colors duration-200",
                    idx === activeIndex ? "bg-black" : "bg-black/25 group-hover/ind:bg-black/50",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop 2-Column Grid (>= md) */}
      <div className="hidden md:grid md:grid-cols-2 gap-[5px]">
        {images.map((image, index) => (
          <figure
            key={`desktop-${image.src}-${index}`}
            className="relative aspect-[13/18] overflow-hidden bg-[#efefef]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index < 2}
              sizes="(max-width: 1023px) 50vw, 30vw"
              style={
                image.objectPosition
                  ? { objectPosition: image.objectPosition }
                  : undefined
              }
              className="object-cover"
            />
          </figure>
        ))}
      </div>
    </div>
  )
}
