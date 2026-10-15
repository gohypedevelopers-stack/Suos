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
            <h3 className="text-white text-xs sm:text-xl md:text-2xl lg:text-3xl font-serif uppercase tracking-[0.12em] sm:tracking-[0.18em] drop-shadow-md leading-tight">
              {banner.title}
            </h3>
          ) : null}
          {banner.subtitle ? (
            <p className="mt-0.5 sm:mt-1 text-white/90 text-[8px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest font-light">
              {banner.subtitle}
            </p>
          ) : null}
          {banner.ctaText ? (
            <span className="mt-2 sm:mt-4 inline-flex items-center justify-center border border-white/85 bg-black/30 backdrop-blur-sm px-3 py-1 sm:px-5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-wider text-white shadow-sm transition group-hover/banner:bg-white/10">
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
