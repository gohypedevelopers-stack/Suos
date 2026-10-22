"use client"

import Image from "next/image"

import { isVideoMedia } from "@/lib/banner-media"
import type { LookbookSlideContent } from "@/lib/site-content"
import { useSiteContent } from "@/lib/site-content-context"

const LOOKBOOK_COUNT = 6

function LookbookCard({ slide }: { slide: LookbookSlideContent }) {
  const objectPosition = slide.objectPosition || "center"

  return (
    <article className="relative aspect-[7/11] overflow-hidden bg-[#e6e8eb]">
      {isVideoMedia(slide.image) ? (
        <video
          src={slide.image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={slide.alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />
      ) : (
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          sizes="(max-width: 1023px) 33vw, 16vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      )}
    </article>
  )
}

/** Figma reels strip: 6 fixed clips/images inside the page margins (no scrolling). */
export function LookbookCarousel() {
  const { lookbook } = useSiteContent()
  const slides = lookbook.slides.slice(0, LOOKBOOK_COUNT)
  if (slides.length === 0) return null

  return (
    <section className="w-full bg-white px-3 py-10 text-black sm:px-6 lg:px-8">
      <h2 className="sr-only">Lookbook</h2>
      <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:grid-cols-6">
        {slides.map((slide) => (
          <LookbookCard key={slide.id} slide={slide} />
        ))}
      </div>
    </section>
  )
}
