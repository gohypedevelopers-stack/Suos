import Image from "next/image"

import type { ProductDetail } from "@/components/product/productData"

type Highlight = NonNullable<ProductDetail["highlights"]>[number]

function HighlightImage({
  highlight,
  number,
  sizes,
  className,
}: {
  highlight: Highlight
  number: number
  sizes: string
  className: string
}) {
  return (
    <figure data-reveal="zoom" data-scroll-zoom className={`relative overflow-hidden bg-[#efefef] ${className}`}>
      <Image
        src={highlight.src}
        alt={highlight.title || `Detail ${number}`}
        fill
        sizes={sizes}
        className="object-cover"
      />
      {highlight.title || highlight.text ? (
        <figcaption className="absolute bottom-3 right-3 max-w-[260px] bg-white p-3 text-black max-sm:bottom-2 max-sm:right-2 max-sm:max-w-[calc(100%-16px)] max-sm:p-2 sm:bottom-5 sm:right-5 sm:max-w-[300px] sm:p-4">
          <span className="block text-caption max-sm:text-[9px] sm:text-body-lg">{String(number).padStart(2, "0")}</span>
          {highlight.title ? (
            <span className="mt-1 block text-caption font-bold uppercase max-sm:mt-0.5 max-sm:text-[9px] sm:text-body-lg">{highlight.title}</span>
          ) : null}
          {highlight.text ? (
            <span className="mt-1 block text-[13px] leading-[17px] max-sm:mt-0.5 max-sm:text-[9px] max-sm:leading-[12px] sm:text-[16px] sm:leading-[20px]">{highlight.text}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

/**
 * Figma "It's in the Details": heading + detail 02 (tall) on the left,
 * details 01 and 03 stacked on the right, captions in white boxes.
 */
export function ProductHighlightsSection({
  intro,
  highlights,
}: {
  intro?: string
  highlights: NonNullable<ProductDetail["highlights"]>
}) {
  if (highlights.length === 0) return null

  const [first, second, third] = highlights
  const heading = (
    <div className="px-3 pb-6 pt-10 max-md:px-4 max-md:pb-3 max-md:pt-0 sm:px-6 lg:px-8 md:pt-2">
      <h2 data-reveal="up" className="type-title max-md:!text-[15px] max-md:!leading-5">
        It&apos;s in the Details
      </h2>
      {intro ? (
        <p className="mt-4 max-w-[420px] whitespace-pre-line text-[16px] leading-[20px] text-ink-600 sm:text-[20px] sm:leading-[25px] max-md:!mt-1.5 max-md:!text-[11px] max-md:!leading-[14px]">
          {intro}
        </p>
      ) : null}
    </div>
  )

  // Fewer than 3 images: a simple equal-width row.
  if (!second || !third) {
    return (
      <section className="w-full bg-white pb-10 pt-8 text-black md:py-16">
        {heading}
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {highlights.map((highlight, index) => (
            <HighlightImage
              key={`${highlight.src}-${index}`}
              highlight={highlight}
              number={index + 1}
              sizes="(max-width: 639px) 100vw, 50vw"
              className="aspect-[4/3] sm:max-h-[calc(100svh-var(--main-navbar-height)-10rem)] sm:w-full"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-white pb-10 pt-8 text-black md:py-16">
      <div className="grid grid-cols-[46fr_54fr] gap-1 md:h-[min(calc(100svh-var(--main-navbar-height)-2rem),900px)] md:min-h-[520px] md:grid-cols-[46fr_54fr]">
        <div className="flex min-h-0 flex-col">
          {heading}
          <HighlightImage
            highlight={second}
            number={2}
            sizes="(max-width: 767px) 100vw, 46vw"
            className="min-h-[160px] flex-1 md:min-h-0"
          />
        </div>
        <div className="reveal-stagger grid min-h-0 grid-rows-2 gap-1">
          <HighlightImage highlight={first} number={1} sizes="(max-width: 767px) 100vw, 54vw" className="aspect-[760/560] md:aspect-auto md:h-full" />
          <HighlightImage highlight={third} number={3} sizes="(max-width: 767px) 100vw, 54vw" className="aspect-[760/560] md:aspect-auto md:h-full" />
        </div>
      </div>
    </section>
  )
}
