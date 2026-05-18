import Image from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type LookbookSlide = {
  id: string
  image: string
  alt: string
  imageClassName?: string
}

const lookbookSlides: LookbookSlide[] = [
  {
    id: "lookbook-1",
    image: "/images/products/product9.png",
    alt: "Model in blue denim standing against a dark gradient background",
    imageClassName: "object-[center_16%]",
  },
  {
    id: "lookbook-2",
    image: "/images/products/product10.png",
    alt: "Model in a denim jacket in a monochrome setting",
    imageClassName: "object-[center_14%]",
  },
  {
    id: "lookbook-3",
    image: "/images/products/product11.png",
    alt: "Model in a striped shirt holding a cup indoors",
    imageClassName: "object-[center_20%]",
  },
  {
    id: "lookbook-4",
    image: "/images/products/product12.png",
    alt: "Model in an all-black outfit seated on a chair",
    imageClassName: "object-[center_22%]",
  },
  {
    id: "lookbook-5",
    image: "/images/products/product13.png",
    alt: "Model in a light denim jacket and jeans against a bright backdrop",
    imageClassName: "object-[center_18%]",
  },
  {
    id: "lookbook-6",
    image: "/images/products/product14.png",
    alt: "Model wearing blue denim seated on a stool",
    imageClassName: "object-[center_24%]",
  },
  {
    id: "lookbook-7",
    image: "/images/products/product5-white.png",
    alt: "Model in denim seated beside greenery",
    imageClassName: "object-[center_32%]",
  },
  {
    id: "lookbook-8",
    image: "/images/products/product9.png",
    alt: "Model reclining in a denim look across stacked screens",
    imageClassName: "object-[center_44%]",
  },
]

function PlayBadge() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="grid size-12 place-items-center rounded-full bg-white/86 shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-[2px]">
        <span className="ml-0.5 inline-block border-y-[8px] border-y-transparent border-l-[12px] border-l-black/72" />
      </div>
    </div>
  )
}

function LookbookCard({ slide }: { slide: LookbookSlide }) {
  return (
    <div className="bg-black/70 p-px">
      <article className="group relative aspect-[7/12] overflow-hidden bg-[#e6e8eb]">
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 36vw, (max-width: 1280px) 18vw, 16vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-[1.015]",
            slide.imageClassName
          )}
        />

        <PlayBadge />
      </article>
    </div>
  )
}

export function LookbookCarousel() {
  return (
    <section className="w-full bg-white px-4 py-10 text-black sm:px-6 lg:px-8">
      <h2 className="sr-only">Lookbook carousel</h2>

      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full select-none cursor-grab active:cursor-grabbing"
        aria-label="Lookbook carousel"
      >
        <CarouselContent>
          {lookbookSlides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="basis-[82%] sm:basis-[40%] md:basis-[28%] lg:basis-[16.2%]"
            >
              <LookbookCard slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
