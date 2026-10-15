import Image from "next/image"

import { isVideoMedia } from "@/lib/banner-media"
import { cn } from "@/lib/utils"

/** Fills its (relative) parent with the banner image or a muted looping video. */
export function BannerMediaPreview({
  src,
  alt,
  sizes,
  className,
}: {
  src: string
  alt: string
  sizes?: string
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
        aria-label={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
    )
  }

  return <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} />
}
