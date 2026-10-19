"use client"

import Image from "next/image"
import Link from "next/link"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export type CartRecommendation = {
  id?: string
  slug?: string
  image: string
  alt: string
}

type CartRecommendationsCarouselProps = {
  items: CartRecommendation[]
}

function RecommendationCard({ image, alt, slug }: CartRecommendation) {
  const CardInner = (
    <div className="group relative aspect-[3/4] overflow-hidden bg-[#111]">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 640px) 28vw, 120px"
        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
      />

      <span className="absolute left-1 top-1 bg-black px-1 py-[3px] text-[11px] font-normal uppercase leading-none tracking-[0.06em] text-white whitespace-nowrap">
        NEW ARRIVAL
      </span>
    </div>
  )

  if (slug) {
    return (
      <Link href={`/products/${slug}`} className="block">
        {CardInner}
      </Link>
    )
  }

  return <article>{CardInner}</article>
}

export function CartRecommendationsCarousel({
  items,
}: CartRecommendationsCarouselProps) {
  const slides = [...items, ...items]

  return (
    <section>
      <h3 className="text-[14px] font-normal uppercase leading-[1.4] tracking-[0.04em]">
        You May Also Like
      </h3>

      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="mt-3 w-full select-none cursor-grab active:cursor-grabbing"
        aria-label="You may also like carousel"
      >
        <CarouselContent className="-ml-2">
          {slides.map((item, index) => (
            <CarouselItem
              key={`${item.id || item.image}-${index}`}
              className="basis-[32%] pl-2"
            >
              <RecommendationCard
                id={item.id}
                slug={item.slug}
                image={item.image}
                alt={item.alt}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
