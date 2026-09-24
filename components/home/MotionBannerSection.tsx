import Image from "next/image"
import Link from "next/link"

import type { HomeBannerSectionItem } from "@/lib/server/dal/banners"

export function MotionBannerSection({
  banner,
}: {
  banner?: HomeBannerSectionItem | null
}) {
  if (!banner) return null

  const desktopImg = banner.desktopImageUrl || "/home-page-content/hero-2.png"
  const mobileImg = banner.mobileImageUrl || desktopImg
  const link = banner.ctaLink

  const content = (
    <section className="group/motion relative w-full aspect-[16/7] sm:aspect-[2172/724] min-h-[150px] sm:min-h-0 overflow-hidden bg-black">
      {/* Mobile image if separate */}
      {banner.mobileImageUrl ? (
        <>
          <div className="relative block sm:hidden w-full h-full">
            <Image
              src={mobileImg}
              alt={banner.title || "Editorial fashion banner"}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="relative hidden sm:block w-full h-full">
            <Image
              src={desktopImg}
              alt={banner.title || "Editorial fashion banner"}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </>
      ) : (
        <Image
          src={desktopImg}
          alt={banner?.title || "Editorial fashion banner"}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      )}

      {/* Optional Dark Overlay */}
      {banner?.overlayOpacity ? (
        <div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: banner.overlayOpacity / 100 }}
        />
      ) : null}

      {/* Optional Text / CTA Overlay */}
      {(banner?.title || banner?.ctaText) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-6 text-center z-10">
          {banner.title && (
            <h3 className="text-white text-xs sm:text-xl md:text-2xl lg:text-3xl font-serif uppercase tracking-[0.12em] sm:tracking-[0.18em] drop-shadow-md leading-tight">
              {banner.title}
            </h3>
          )}
          {banner.subtitle && (
            <p className="mt-0.5 sm:mt-1 text-white/90 text-[8px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest font-light">
              {banner.subtitle}
            </p>
          )}
          {banner.ctaText && (
            <span className="mt-2 sm:mt-4 inline-flex items-center justify-center border border-white/85 bg-black/30 backdrop-blur-sm px-3 py-1 sm:px-5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-wider text-white transition hover:bg-white/10 shadow-sm">
              {banner.ctaText}
            </span>
          )}
        </div>
      )}
    </section>
  )

  if (link && !banner?.ctaText) {
    return (
      <Link href={link} className="block cursor-pointer">
        {content}
      </Link>
    )
  }

  return content
}
