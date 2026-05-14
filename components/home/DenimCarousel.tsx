import Image from "next/image"
import Link from "next/link"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

type DenimSlide = {
  title: string
  image: string
  alt: string
}

const denimSlides: DenimSlide[] = [
  {
    title: "SKINNY DENIMS",
    image: "/images/products/product5.png",
    alt: "Model wearing skinny denim",
  },
  {
    title: "BOOTCUT DENIMS",
    image: "/images/products/product5.png",
    alt: "Model wearing bootcut denim",
  },
  {
    title: "LOW-RISE DENIMS",
    image: "/images/products/product5.png",
    alt: "Model wearing low-rise denim",
  },
  {
    title: "STRAIGHT DENIMS",
    image: "/images/products/product5.png",
    alt: "Model wearing straight denim",
  },
  {
    title: "RELAXED DENIMS",
    image: "/images/products/product5.png",
    alt: "Model wearing relaxed denim",
  },
]

function DenimSlideCard({ slide }: { slide: DenimSlide }) {
  return (
    <article className="relative h-[500px] overflow-hidden bg-[#eef2f2] sm:h-[580px] md:h-[640px] lg:h-[700px]">
      <Image
        src={slide.image}
        alt={slide.alt}
        fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 64vw, 49vw"
        className="object-contain object-center"
        priority={false}
      />

      <div className="absolute inset-x-5 bottom-5 z-10 max-w-[11rem] text-black">
        <h3 className="text-[0.875rem] font-semibold uppercase leading-none tracking-[-0.02em]">
          {slide.title}
        </h3>

        <Link
          href="/#collection"
          className="mt-2 inline-flex h-7 items-center justify-center border border-black px-3 text-[0.5rem] uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white"
        >
          Explore Collection
        </Link>
      </div>
    </article>
  )
}

export function DenimCarousel() {
  return (
    <section className="w-full bg-white px-4 pb-16 pt-4 text-black sm:px-6 lg:px-8 md:pb-20">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
        aria-label="Denim collection carousel"
      >
        <CarouselContent>
          {denimSlides.map((slide) => (
            <CarouselItem
              key={slide.title}
              className="basis-[92%] sm:basis-[72%] md:basis-[58%] lg:basis-[46.5%]"
            >
              <DenimSlideCard slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
