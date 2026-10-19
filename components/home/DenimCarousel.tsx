"use client"

import Image from "next/image"

import Link from "next/link"

import { useContinuousDraggableCarousel } from "./useContinuousDraggableCarousel"
import type { HomeCarouselSlide } from "@/lib/server/dal/banners"

type DenimSlide = {
  id: string
  image: string
  alt: string
  label: string
  href: string
}

/** Collection tiles shown over the carousel slides, cycled by slide index. */
const COLLECTION_TILES = [
  { label: "Originals", href: "/collections/originals" },
  { label: "Freedom", href: "/collections/freedom" },
  { label: "Timeless", href: "/collections/timeless" },
] as const

function resolveTile(
  index: number,
  title?: string | null,
  subtitle?: string | null,
  ctaLink?: string | null
) {
  const named = COLLECTION_TILES.find((tile) =>
    [title, subtitle].some(
      (value) => value?.trim().toLowerCase() === tile.label.toLowerCase()
    )
  )
  const tile = named ?? COLLECTION_TILES[index % COLLECTION_TILES.length]
  const link = ctaLink?.trim()
  // A bare "/collections" link is the generic seed default; prefer the collection page.
  const href = link && link !== "/collections" ? link : tile.href
  return { label: tile.label, href }
}

const defaultDenimSlides: DenimSlide[] = [
  "Model wearing skinny denim",
  "Model wearing bootcut denim",
  "Model wearing low-rise denim",
].map((alt, index) => ({
  id: `default-${index}`,
  image: "/images/products/product5-white.png",
  alt,
  ...resolveTile(index),
}))

function DenimSlideCard({ slide }: { slide: DenimSlide }) {
  return (
    <Link
      href={slide.href}
      aria-label={`Shop ${slide.label}`}
      className="group block cursor-pointer"
    >
      <article className="relative h-[460px] w-[min(92vw,627px)] shrink-0 overflow-hidden bg-white sm:h-[530px] sm:w-[min(72vw,627px)] md:h-[590px] md:w-[min(58vw,627px)] lg:h-[640px] lg:w-[627px]">
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 64vw, 627px"
          className="pointer-events-none object-contain object-center"
        />
        {/* mix-blend-difference keeps the label legible on both white cut-outs and dark photos */}
        <span className="pointer-events-none absolute bottom-5 left-5 z-10 text-[14px] font-normal uppercase leading-[1.15] tracking-[0.04em] text-white mix-blend-difference sm:bottom-6 sm:left-6 sm:text-[16px]">
          <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-current">
            {slide.label}
          </span>
        </span>
      </article>
    </Link>
  )
}

export function DenimCarousel({
  slides,
}: {
  slides?: HomeCarouselSlide[]
}) {
  const activeSlides: DenimSlide[] =
    slides && slides.length > 0
      ? slides.map((s, index) => ({
          id: s.id,
          image: s.desktopImageUrl,
          alt: s.title || "Denim collection slide",
          ...resolveTile(index, s.title, s.subtitle, s.ctaLink),
        }))
      : defaultDenimSlides

  const loopingDenimSlides = [...activeSlides, ...activeSlides, ...activeSlides]
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
    slideCount: activeSlides.length,
  })

  return (
    <section className="w-full bg-white pb-12 pt-4 text-black md:pb-16">
      <h2 className="sr-only">Denim collection carousel</h2>

      <div
        ref={viewportRef}
        className="denim-carousel-viewport continuous-carousel-viewport"
        aria-label="Denim collection carousel"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div ref={trackRef} className="denim-carousel-track continuous-carousel-track">
          {loopingDenimSlides.map((slide, index) => (
            <div key={`${slide.id}-${index}`} aria-hidden={index >= activeSlides.length}>
              <DenimSlideCard slide={slide} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
