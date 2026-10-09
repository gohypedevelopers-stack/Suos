import Image from "next/image"
import Link from "next/link"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { getSiteContent } from "@/lib/server/dal/site-content"
import type { EditsContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"

type EditSlide = EditsContent["slides"][number]

function EditCard({ slide }: { slide: EditSlide }) {
  const card = (
    <article className="relative aspect-[330/479] overflow-hidden bg-[#eef2f2]">
      <Image
        src={slide.image}
        alt={slide.alt}
        fill
        sizes="(max-width: 640px) 88vw, (max-width: 1024px) 52vw, 24vw"
        className="object-cover object-center transition-transform duration-500 hover:scale-[1.01]"
      />

      <div className="absolute inset-x-3 bottom-3 z-10">
        <p className="inline-block bg-white/0 px-1 py-0.5 text-[13px] font-normal uppercase tracking-normal text-black">
          {slide.label}
        </p>
      </div>
    </article>
  )

  return slide.href ? <Link href={slide.href}>{card}</Link> : card
}

function TabLabel({
  label,
  active,
}: {
  label: string
  active: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "group inline-flex flex-col items-start pb-0.5 text-[13px] font-normal uppercase leading-none tracking-normal transition-opacity hover:opacity-70"
      )}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100"
      />
    </button>
  )
}

export async function EditsCarousel() {
  const { edits } = await getSiteContent()

  return (
    <section className="w-full bg-white px-4 py-14 text-black sm:px-6 lg:px-8 md:py-16">
      <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-heading text-[24px] font-normal uppercase leading-none tracking-[-0.04em]">
          {edits.heading}
        </h2>

        <div className="flex items-center gap-6 sm:gap-8">
          {edits.tabs.map((tab) => (
            <TabLabel key={tab.label} label={tab.label} active={tab.active} />
          ))}
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="mt-8 w-full"
        aria-label="Edit collection carousel"
      >
        <CarouselContent>
          {edits.slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="basis-[88%] sm:basis-[56%] md:basis-[38%] lg:basis-[24%]"
            >
              <EditCard slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
