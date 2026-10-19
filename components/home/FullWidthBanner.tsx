import Image from "next/image"
import Link from "next/link"

import { isVideoMedia } from "@/lib/banner-media"
import type { HomeBannerSectionItem } from "@/lib/server/dal/banners"
import { cn } from "@/lib/utils"

function BannerMedia({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  if (isVideoMedia(src)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={alt}
        className={cn("absolute inset-0 h-full w-full object-cover object-center", className)}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      className={cn("object-cover object-center", className)}
    />
  )
}

/**
 * Full-width homepage banner. The whole banner is one link to `ctaLink`;
 * the optional button sits on top and goes to the same place.
 */
export function FullWidthBanner({
  banner,
  fallbackSrc,
  defaultAlt,
  className,
}: {
  banner: HomeBannerSectionItem
  fallbackSrc: string
  defaultAlt: string
  className?: string
}) {
  const desktopSrc = banner.desktopImageUrl || fallbackSrc
  const alt = banner.title || defaultAlt
  const link = banner.ctaLink?.trim()

  const content = (
    <section className={cn("group/banner relative w-full overflow-hidden bg-black", className)}>
      {banner.mobileImageUrl ? (
        <>
          <div className="absolute inset-0 sm:hidden">
            <BannerMedia src={banner.mobileImageUrl} alt={alt} />
          </div>
          <div className="absolute inset-0 hidden sm:block">
            <BannerMedia src={desktopSrc} alt={alt} />
          </div>
        </>
      ) : (
        <BannerMedia src={desktopSrc} alt={alt} />
      )}

      {banner.overlayOpacity ? (
        <div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: banner.overlayOpacity / 100 }}
        />
      ) : null}

      {banner.title || banner.subtitle || banner.ctaText ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center sm:p-6">
          {banner.title ? (
            <h3 className="font-heading text-[16px] font-normal uppercase leading-[1.15] tracking-[0.04em] text-white drop-shadow-md sm:text-[22px] lg:text-[28px]">
              {banner.title}
            </h3>
          ) : null}
          {banner.subtitle ? (
            <p className="mt-1.5 text-[11px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-white/90 sm:mt-2 sm:text-[13px] md:text-[14px]">
              {banner.subtitle}
            </p>
          ) : null}
          {banner.ctaText ? (
            <span className="mt-3 inline-flex h-9 items-center justify-center border border-white/85 bg-black/30 px-4 text-[12px] font-normal uppercase leading-none tracking-[0.04em] text-white shadow-sm backdrop-blur-sm transition group-hover/banner:bg-white/10 sm:mt-5 sm:h-11 sm:px-6 sm:text-[14px]">
              {banner.ctaText}
            </span>
          ) : null}
        </div>
      ) : null}
    </section>
  )

  if (!link) return content

  return (
    <Link
      href={link}
      aria-label={banner.ctaText ? `${banner.ctaText}${banner.title ? ` – ${banner.title}` : ""}` : alt}
      className="block cursor-pointer"
    >
      {content}
    </Link>
  )
}
