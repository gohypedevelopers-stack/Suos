import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import type { HomeEditorialBanner } from "@/lib/server/dal/banners"

type DenimPanelProps = {
  src: string
  alt: string
  mobileSrc?: string | null
  href?: string | null
  className?: string
  imageClassName?: string
  sizes?: string
}

function DenimPanel({
  src,
  alt,
  mobileSrc,
  href,
  className,
  imageClassName,
  sizes = "(max-width: 767px) 100vw, 50vw",
}: DenimPanelProps) {
  const content = (
    <div className={cn("relative overflow-hidden bg-[#f3f0ea]", className)}>
      {mobileSrc ? (
        <>
          <div className="relative block sm:hidden w-full h-full">
            <Image
              src={mobileSrc}
              alt={alt}
              fill
              sizes="100vw"
              className={cn("object-cover object-center", imageClassName)}
            />
          </div>
          <div className="relative hidden sm:block w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              className={cn("object-cover object-center", imageClassName)}
            />
          </div>
        </>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn("object-cover object-center", imageClassName)}
        />
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    )
  }

  return content
}

export function DenimEditorialSection({
  banners,
}: {
  banners?: HomeEditorialBanner[]
}) {
  const banner0 = banners?.find((b) => b.position === 0) || banners?.[0]
  const banner1 = banners?.find((b) => b.position === 1) || banners?.[1]
  const banner2 = banners?.find((b) => b.position === 2) || banners?.[2]

  const p0Src = banner0?.desktopImageUrl || "/images/products/product6.png"
  const p0Alt = banner0?.title || "Model sitting in a denim set on a chair"
  const p0Link = banner0?.ctaLink

  const p1Src = banner1?.desktopImageUrl || "/images/products/product7.png"
  const p1Alt = banner1?.title || "Model sitting in denim beside greenery"
  const p1Link = banner1?.ctaLink

  const p2Src = banner2?.desktopImageUrl || "/images/products/product8.png"
  const p2MobileSrc = banner2?.mobileImageUrl
  const p2Alt = banner2?.title || "Model reclining in a denim look across stacked screens"
  const p2Link = banner2?.ctaLink

  const bottomPanel = (
    <div className="relative overflow-hidden bg-[#f3f0ea] aspect-[17/9] md:aspect-[20/9]">
      {p2MobileSrc ? (
        <>
          <div className="relative block sm:hidden w-full h-full">
            <Image
              src={p2MobileSrc}
              alt={p2Alt}
              fill
              sizes="100vw"
              className="object-cover object-[center_44%]"
            />
          </div>
          <div className="relative hidden sm:block w-full h-full">
            <Image
              src={p2Src}
              alt={p2Alt}
              fill
              sizes="100vw"
              className="object-cover object-[center_44%]"
            />
          </div>
        </>
      ) : (
        <Image
          src={p2Src}
          alt={p2Alt}
          fill
          sizes="100vw"
          className="object-cover object-[center_44%]"
        />
      )}
    </div>
  )

  return (
    <section className="w-full bg-white text-black">
      <h2 className="sr-only">Skinny denims editorial</h2>

      <div className="grid grid-cols-1 gap-0 bg-white md:grid-cols-2">
        <DenimPanel
          src={p0Src}
          mobileSrc={banner0?.mobileImageUrl}
          alt={p0Alt}
          href={p0Link}
          className="aspect-square w-full"
          imageClassName="object-[center_22%]"
        />
        <DenimPanel
          src={p1Src}
          mobileSrc={banner1?.mobileImageUrl}
          alt={p1Alt}
          href={p1Link}
          className="aspect-square w-full"
          imageClassName="object-[center_32%]"
        />
      </div>

      {p2Link ? (
        <Link href={p2Link} className="block group">
          {bottomPanel}
        </Link>
      ) : (
        bottomPanel
      )}
    </section>
  )
}
