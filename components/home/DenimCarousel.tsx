"use client"

import Image from "next/image"

import Link from "next/link"

import { useContinuousDraggableCarousel } from "./useContinuousDraggableCarousel"
import type { HomeCarouselSlide } from "@/lib/server/dal/banners"

type DenimSlide = {
  id: string
  image: string
  alt: string
  ctaLink?: string | null
}

const defaultDenimSlides: DenimSlide[] = [
  {
    id: "skinny",
    image: "/images/products/product5-white.png",
    alt: "Model wearing skinny denim",
    ctaLink: "/collections",
  },
  {
    id: "bootcut",
    image: "/images/products/product5-white.png",
    alt: "Model wearing bootcut denim",
    ctaLink: "/collections",
  },
  {
    id: "low-rise",
    image: "/images/products/product5-white.png",
    alt: "Model wearing low-rise denim",
    ctaLink: "/collections",
  },
  {
    id: "straight",
    image: "/images/products/product5-white.png",
    alt: "Model wearing straight denim",
    ctaLink: "/collections",
  },
  {
    id: "relaxed",
    image: "/images/products/product5-white.png",
    alt: "Model wearing relaxed denim",
    ctaLink: "/collections",
  },
]

function DenimSlideCard({ slide }: { slide: DenimSlide }) {
  const card = (
    <article className="relative h-[460px] w-[min(92vw,627px)] shrink-0 overflow-hidden bg-white sm:h-[530px] sm:w-[min(72vw,627px)] md:h-[590px] md:w-[min(58vw,627px)] lg:h-[640px] lg:w-[627px]">
      <Image
        src={slide.image}
        alt={slide.alt}
        fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 64vw, 627px"
        className="pointer-events-none object-contain object-center"
      />
    </article>
  )

  if (slide.ctaLink) {
    return (
      <Link href={slide.ctaLink} className="block cursor-pointer">
        {card}
      </Link>
    )
  }

  return card
}

export function DenimCarousel({
  slides,
}: {
  slides?: HomeCarouselSlide[]
}) {
  const activeSlides: DenimSlide[] =
    slides && slides.length > 0
      ? slides.map((s) => ({
          id: s.id,
          image: s.desktopImageUrl,
          alt: s.title || "Denim collection slide",
          ctaLink: s.ctaLink,
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
