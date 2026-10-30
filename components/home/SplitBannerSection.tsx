import Image from "next/image"
import Link from "next/link"

import { bannerFocusProps } from "@/lib/banner-media"
import type { HomeEditorialBanner } from "@/lib/server/dal/banners"
import { cn } from "@/lib/utils"

/** `width` is the panel's share of the viewport on desktop, e.g. "61vw". */
function SplitPanel({ banner, width }: { banner: HomeEditorialBanner; width: string }) {
  const alt = banner.title || "SUOS editorial"
  const focus = bannerFocusProps(banner.desktopFocus, banner.mobileFocus, "md")

  const media = (
    <div data-reveal="zoom" className="hover-zoom relative aspect-[4/5] h-full w-full overflow-hidden bg-[#f3f0ea] md:aspect-auto">
      {banner.mobileImageUrl ? (
        <>
          <Image
            src={banner.mobileImageUrl}
            alt={alt}
            fill
            sizes="(max-width: 767px) 100vw, 1px"
            className={cn("object-cover object-center md:hidden", focus.className)}
            style={focus.style}
          />
          <Image
            src={banner.desktopImageUrl}
            alt={alt}
            fill
            sizes={`(max-width: 767px) 1px, ${width}`}
            className={cn("hidden object-cover object-center md:block", focus.className)}
            style={focus.style}
          />
        </>
      ) : (
        <Image src={banner.desktopImageUrl} alt={alt} fill sizes={`(max-width: 767px) 100vw, ${width}`} className={cn("object-cover object-center", focus.className)} style={focus.style} />
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
    <section className="reveal-stagger grid w-full grid-cols-1 bg-white md:aspect-[1440/777] md:grid-cols-[61fr_39fr]">
      <h2 className="sr-only">Editorial</h2>
      <SplitPanel banner={left} width="61vw" />
      <SplitPanel banner={right} width="39vw" />
    </section>
  )
}
