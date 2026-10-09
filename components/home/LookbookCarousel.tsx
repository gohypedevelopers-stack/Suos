"use client"

import Image from "next/image"

import type { LookbookSlideContent } from "@/lib/site-content"
import { useSiteContent } from "@/lib/site-content-context"
import { useContinuousDraggableCarousel } from "./useContinuousDraggableCarousel"

function PlayBadge() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="grid size-12 place-items-center rounded-full bg-white/86 shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-[2px]">
        <span className="ml-0.5 inline-block border-y-[8px] border-y-transparent border-l-[12px] border-l-black/72" />
      </div>
    </div>
  )
}

function LookbookCard({ slide }: { slide: LookbookSlideContent }) {
  return (
    <div className="w-[68vw] shrink-0 bg-black/70 p-px sm:w-[40vw] md:w-[28vw] lg:w-[16.2vw]">
      <article className="group relative aspect-[7/12] overflow-hidden bg-[#e6e8eb]">
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 36vw, (max-width: 1280px) 18vw, 16vw"
          className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-[1.015]"
          style={{ objectPosition: slide.objectPosition || "center" }}
        />

        <PlayBadge />
      </article>
    </div>
  )
}

export function LookbookCarousel() {
  const { lookbook } = useSiteContent()
  const slides = lookbook.slides
  const loopingSlides = [...slides, ...slides, ...slides]

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
    slideCount: slides.length,
  })

  return (
    <section className="w-full bg-white py-10 text-black">
      <h2 className="sr-only">Lookbook carousel</h2>

      <div
        ref={viewportRef}
        className="continuous-carousel-viewport"
        aria-label="Lookbook carousel"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div ref={trackRef} className="continuous-carousel-track">
          {loopingSlides.map((slide, index) => (
            <div key={`${slide.id}-${index}`} aria-hidden={index >= slides.length}>
              <LookbookCard slide={slide} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
