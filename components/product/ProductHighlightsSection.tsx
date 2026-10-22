import Image from "next/image"

import type { ProductDetail } from "@/components/product/productData"

/** Figma "It's in the Details": 3 product close-ups with numbered captions. */
export function ProductHighlightsSection({
  intro,
  highlights,
}: {
  intro?: string
  highlights: NonNullable<ProductDetail["highlights"]>
}) {
  if (highlights.length === 0) return null

  return (
    <section className="w-full bg-white px-3 py-10 text-black sm:px-6 md:py-16 lg:px-8">
      <h2 className="font-heading text-[28px] font-normal uppercase leading-none sm:text-[32px] lg:text-h2">
        It&apos;s in the Details
      </h2>
      {intro ? (
        <p className="mt-4 max-w-[640px] text-[16px] leading-[20px] text-ink-600 sm:text-[20px] sm:leading-[25px]">
          {intro}
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-3 sm:gap-2">
        {highlights.map((highlight, index) => (
          <figure key={`${highlight.src}-${index}`}>
            <div className="relative aspect-[3/4] overflow-hidden bg-[#efefef]">
              <Image
                src={highlight.src}
                alt={highlight.title || `Detail ${index + 1}`}
                fill
                sizes="(max-width: 639px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-body-lg text-black">
              <span className="font-bold uppercase">
                {String(index + 1).padStart(2, "0")} {highlight.title}
              </span>
              {highlight.text ? <span className="mt-2 block leading-[22px]">{highlight.text}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
