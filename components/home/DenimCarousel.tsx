"use client"

import Image from "next/image"

import { useContinuousDraggableCarousel } from "./useContinuousDraggableCarousel"

type DenimSlide = {
  id: string
  image: string
  alt: string
}

const denimSlides: DenimSlide[] = [
  {
    id: "skinny",
    image: "/images/products/product5-white.png",
    alt: "Model wearing skinny denim",
  },
  {
    id: "bootcut",
    image: "/images/products/product5-white.png",
    alt: "Model wearing bootcut denim",
  },
  {
    id: "low-rise",
    image: "/images/products/product5-white.png",
    alt: "Model wearing low-rise denim",
  },
  {
    id: "straight",
    image: "/images/products/product5-white.png",
    alt: "Model wearing straight denim",
  },
  {
    id: "relaxed",
    image: "/images/products/product5-white.png",
    alt: "Model wearing relaxed denim",
  },
]

// The first and last copies give a dragged carousel space to move in either direction.
const loopingDenimSlides = [...denimSlides, ...denimSlides, ...denimSlides]

function DenimSlideCard({ slide }: { slide: DenimSlide }) {
  return (
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
}

export function DenimCarousel() {
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
    slideCount: denimSlides.length,
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
            <div key={`${slide.id}-${index}`} aria-hidden={index >= denimSlides.length}>
              <DenimSlideCard slide={slide} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
