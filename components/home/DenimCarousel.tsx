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
    image: "/images/products/product5-white.png",
    alt: "Model wearing skinny denim",
  },
  {
    title: "BOOTCUT DENIMS",
    image: "/images/products/product5-white.png",
    alt: "Model wearing bootcut denim",
  },
  {
    title: "LOW-RISE DENIMS",
    image: "/images/products/product5-white.png",
    alt: "Model wearing low-rise denim",
  },
  {
    title: "STRAIGHT DENIMS",
    image: "/images/products/product5-white.png",
    alt: "Model wearing straight denim",
  },
  {
    title: "RELAXED DENIMS",
    image: "/images/products/product5-white.png",
    alt: "Model wearing relaxed denim",
  },
]

function DenimSlideCard({ slide }: { slide: DenimSlide }) {
  return (
    <article className="relative h-[460px] w-full overflow-hidden bg-white sm:h-[530px] md:h-[590px] lg:h-[640px]">
      <Image
        src={slide.image}
        alt={slide.alt}
        fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 64vw, 627px"
        className="object-contain object-center"
      />

      <div className="absolute inset-x-5 bottom-5 z-10 w-fit max-w-none text-black">
        <h3 className="whitespace-nowrap text-[22px] font-[500] uppercase leading-none tracking-[-0.02em]">
          {slide.title}
        </h3>

        <Link
          href="/collections"
          className="mt-2 inline-flex h-[42px] w-full items-center justify-center border border-black px-3 text-[16px] uppercase tracking-normal transition-colors hover:bg-black hover:text-white"
        >
          Explore Collection
        </Link>
      </div>
    </article>
  )
}

export function DenimCarousel() {
  return (
    <section className="w-full bg-white px-4 pb-12 pt-4 text-black sm:px-6 md:pb-16 lg:px-8">
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
              className="basis-[92%] sm:basis-[72%] md:basis-[58%] lg:basis-[calc(627px+1rem)]"
            >
              <DenimSlideCard slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
