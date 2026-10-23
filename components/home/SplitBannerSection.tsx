import Image from "next/image"
import Link from "next/link"

import type { HomeEditorialBanner } from "@/lib/server/dal/banners"

/** `width` is the panel's share of the viewport on desktop, e.g. "61vw". */
function SplitPanel({ banner, width }: { banner: HomeEditorialBanner; width: string }) {
  const alt = banner.title || "SUOS editorial"

  const media = (
    <div className="relative aspect-[4/5] h-full w-full overflow-hidden bg-[#f3f0ea] md:aspect-auto">
      {banner.mobileImageUrl ? (
        <>
          <Image
            src={banner.mobileImageUrl}
            alt={alt}
            fill
            sizes="(max-width: 767px) 100vw, 1px"
            className="object-cover object-center md:hidden"
          />
          <Image
            src={banner.desktopImageUrl}
            alt={alt}
            fill
            sizes={`(max-width: 767px) 1px, ${width}`}
            className="hidden object-cover object-center md:block"
          />
        </>
      ) : (
        <Image src={banner.desktopImageUrl} alt={alt} fill sizes={`(max-width: 767px) 100vw, ${width}`} className="object-cover object-center" />
      )}
    </div>
  )

  const link = banner.ctaLink?.trim()
  if (!link) return media

  return (
    <Link href={link} aria-label={alt} className="block h-full">
      {media}
    </Link>
  )
}

/**
 * Two images side by side directly below the hero (Figma: wide chair shot on
 * the left, narrower stairs shot on the right). Hidden until both SPLIT slots
 * are uploaded in Banners.
 */
export function SplitBannerSection({ banners }: { banners?: HomeEditorialBanner[] }) {
  const left = banners?.find((b) => b.position === 0)
  const right = banners?.find((b) => b.position === 1)
  if (!left || !right) return null

  return (
    <section className="grid w-full grid-cols-1 bg-white md:aspect-[1440/777] md:grid-cols-[61fr_39fr]">
      <h2 className="sr-only">Editorial</h2>
      <SplitPanel banner={left} width="61vw" />
      <SplitPanel banner={right} width="39vw" />
    </section>
  )
}
