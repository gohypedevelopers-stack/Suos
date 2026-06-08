"use client"

import Image from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

type CartRecommendation = {
  image: string
  alt: string
}

type CartRecommendationsCarouselProps = {
  items: CartRecommendation[]
}

function RecommendationCard({ image, alt }: CartRecommendation) {
  return (
    <article className="relative aspect-[3/4] overflow-hidden bg-[#111]">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 640px) 28vw, 120px"
        className="object-cover object-center"
      />

      <span className="absolute left-1.5 top-1.5 bg-black px-1.5 py-0.5 text-[0.4rem] uppercase tracking-[0.14em] text-white">
        NEW ARRIVAL
      </span>
    </article>
  )
}

export function CartRecommendationsCarousel({
  items,
}: CartRecommendationsCarouselProps) {
  const slides = [...items, ...items]

  return (
    <section>
      <h3 className="text-[1rem] font-medium uppercase leading-none tracking-[0.08em]">
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
              key={`${item.image}-${item.alt}-${index}`}
              className="basis-[32%] pl-2"
            >
              <RecommendationCard image={item.image} alt={item.alt} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
