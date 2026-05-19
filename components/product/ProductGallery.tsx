import Image from "next/image"

import { cn } from "@/lib/utils"
import type { ProductImage } from "@/components/product/productData"

export function ProductGallery({
  images,
}: {
  images: ProductImage[]
}) {
  return (
    <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
      {images.map((image, index) => (
        <figure
          key={`${image.src}-${index}`}
          className="relative aspect-[13/16] overflow-hidden bg-[#efefef]"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index < 2}
            sizes="(max-width: 768px) 50vw, (max-width: 1279px) 30vw, 20vw"
            style={
              image.objectPosition
                ? { objectPosition: image.objectPosition }
                : undefined
            }
            className={cn("object-cover")}
          />
        </figure>
      ))}
    </div>
  )
}
