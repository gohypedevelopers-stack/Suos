"use client"

import { useRef, useState } from "react"
import Image from "next/image"
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
    // Mobile: bleeds past the page's side padding (px-4, sm:px-6) so the photo runs edge to edge.
    <div className="w-full min-w-0 overflow-hidden max-sm:-mx-4 max-md:w-auto sm:max-md:-mx-6">
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
              className="relative aspect-[4/5] max-h-[80svh] w-full min-w-full shrink-0 snap-center overflow-hidden bg-[#efefef]"
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

        {/* Counter pill (mobile design: "1/6", bottom right of the photo) */}
        {images.length > 1 && (
          <div className="pointer-events-none absolute bottom-[14px] right-3 z-10">
            <span
              aria-live="polite"
              className="inline-flex h-6 min-w-[38px] items-center justify-center rounded-full bg-white/85 px-2.5 text-[11px] font-medium leading-none tabular-nums text-black backdrop-blur-sm"
            >
              {activeIndex + 1}/{images.length}
            </span>
          </div>
        )}

        {/* Progress line under the photo: the dark segment marks the current slide. */}
        {images.length > 1 && (
          <div aria-hidden="true" className="relative h-[2px] w-full bg-black/10">
            <span
              className="absolute inset-y-0 left-0 bg-black transition-transform duration-300 ease-out"
              style={{
                width: `${100 / images.length}%`,
                transform: `translateX(${Math.min(activeIndex, images.length - 1) * 100}%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Desktop 2-Column Grid (>= md) */}
      <div className="hidden md:grid md:grid-cols-2 gap-1">
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
