"use client"

import Image from "next/image"

import { useSiteContent } from "@/lib/site-content-context"
import { cn } from "@/lib/utils"

/**
 * Product photo that cross-fades to a second photo while its card (the nearest
 * `.group`) is hovered: "show second image on hover". Follows the admin switch
 * Website content → Product page → "Show second image on hover". Touch screens
 * keep the first photo. Timing lives in globals.css (`.hover-swap-img`).
 */
export function HoverSwapImage({
  src,
  hoverSrc,
  alt,
  sizes,
  className,
  priority,
}: {
  src: string
  hoverSrc?: string | null
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}) {
  const { productPage } = useSiteContent()
  const second = productPage.showSecondImageOnHover && hoverSrc && hoverSrc !== src ? hoverSrc : null

  return (
    <>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("hover-swap-img object-cover", second && "hover-swap-img--first", className)} />
      {second ? (
        <Image
          src={second}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className={cn("hover-swap-img hover-swap-img--second object-cover", className)}
        />
      ) : null}
    </>
  )
}
