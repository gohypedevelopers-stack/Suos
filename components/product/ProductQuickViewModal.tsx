"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { ButtonHTMLAttributes } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ProductDetail } from "@/components/product/productData"

type ProductQuickViewModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDetail
  gallery: string[]
  initialImageIndex?: number
}

function QuickViewColorSwatches({
  colors,
  selectedColor,
  onSelectColor,
}: {
  colors: ProductDetail["colors"]
  selectedColor: string
  onSelectColor: (colorName: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {colors.map((color) => {
        const isSelected = color.name === selectedColor

        return (
          <button
            key={color.name}
            type="button"
            aria-pressed={isSelected}
            aria-label={`Select ${color.name}`}
            onClick={() => onSelectColor(color.name)}
            className={cn(
              "flex h-[40px] w-[75px] cursor-pointer items-stretch justify-stretch bg-white transition-[box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
              isSelected
                ? "border-[2px] border-black p-[4px]"
                : "border-0 p-0"
            )}
          >
            <span
              className="block h-full w-full"
              style={{ backgroundColor: color.value }}
            />
          </button>
        )
      })}
    </div>
  )
}

function QuickViewSizeButton({
  active,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-[34px] cursor-pointer items-center justify-center border text-[13px] font-normal leading-none transition-[background-color,border-color,color,transform,font-weight] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
        active
          ? "border-black bg-[#ededed] font-[500] text-black"
          : "border-black/10 bg-white text-black hover:border-black hover:bg-black/[0.04]",
        "min-w-0 px-3"
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ProductQuickViewModal({
  open,
  onOpenChange,
  product,
  gallery,
  initialImageIndex = 0,
}: ProductQuickViewModalProps) {
  const [activeImageIndex] = useState(() =>
    Math.min(initialImageIndex, Math.max(gallery.length - 1, 0))
  )
  const [selectedColor, setSelectedColor] = useState(product.colorName)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[1] ?? product.sizes[0] ?? ""
  )

  useEffect(() => {
    if (!open) {
      return
    }

    const { body, documentElement } = document
    const previousBodyOverflow = body.style.overflow
    const previousHtmlOverflow = documentElement.style.overflow
    const previousBodyOverscrollBehavior = body.style.overscrollBehavior
    const previousHtmlOverscrollBehavior = documentElement.style.overscrollBehavior

    body.style.overflow = "hidden"
    documentElement.style.overflow = "hidden"
    body.style.overscrollBehavior = "none"
    documentElement.style.overscrollBehavior = "none"

    return () => {
      body.style.overflow = previousBodyOverflow
      documentElement.style.overflow = previousHtmlOverflow
      body.style.overscrollBehavior = previousBodyOverscrollBehavior
      documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior
    }
  }, [open])

  const galleryImages =
    gallery.length > 0 ? gallery : product.gallery.map((image) => image.src)

  const activeImage =
    galleryImages[activeImageIndex] ?? galleryImages[0] ?? product.gallery[0]?.src

  const scrollableGallery = [
    activeImage,
    ...galleryImages.filter((_, index) => index !== activeImageIndex),
  ].filter((image): image is string => Boolean(image))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/80 backdrop-blur-[1px]"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className="!w-[min(96vw,908px)] !max-w-none max-h-[calc(100dvh-1.25rem)] overflow-hidden rounded-none border-0 bg-white p-0 text-black ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{product.title} quick view</DialogTitle>
        <DialogDescription className="sr-only">
          Quick view dialog for {product.title}
        </DialogDescription>

        <div className="grid h-[min(88dvh,540px)] grid-cols-1 gap-0 p-3 lg:grid-cols-[353px_minmax(0,1fr)] lg:gap-10">
          <div
            aria-label={`${product.title} image gallery`}
            className="quick-view-gallery min-h-0 overflow-y-auto bg-[#111]"
            tabIndex={0}
          >
            <div className="flex flex-col gap-1">
              {scrollableGallery.map((image, index) => (
                  <figure
                    key={`${image}-${index}`}
                    className="relative aspect-[353/452] shrink-0 overflow-hidden bg-[#111]"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="348px"
                      className="object-cover object-center"
                    />
                  </figure>
                ))}
            </div>
          </div>

          <div className="quick-view-details relative min-h-0 overflow-y-auto px-0 pb-3 pt-5 lg:pr-2">
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close quick view"
                className="absolute right-0 top-0 inline-flex size-5 items-center justify-center leading-none text-black transition-opacity hover:opacity-70"
              >
                <X className="size-5 stroke-2" />
              </button>
            </DialogClose>

            <div className="pr-5">
  <p className="w-fit text-[13px] font-normal uppercase leading-[17px] tracking-normal text-black/45">
                {product.editLabel}
              </p>
              <h2 className="mt-1 font-heading text-[24px] font-normal uppercase leading-[0.95] tracking-[-0.06em]">
                {product.title}
              </h2>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-end gap-3">
      <span className="text-[17px] font-normal leading-[20px] text-black/45 line-through">
                    {product.originalPrice}
                  </span>
      <span className="font-sans text-[17px] font-[500] leading-[20px] tracking-normal">
                    {product.price}
                  </span>
                </div>

                <div className="flex items-end gap-2 text-black">
      <span className="text-[17px] font-normal uppercase leading-[20px] text-black/45">
                    {product.sold}
                  </span>
      <span className="text-[17px] font-normal leading-[20px] text-black/25">•</span>
      <span className="inline-flex items-end gap-1 text-[17px] font-[500] leading-[20px] text-black">
                    <Star className="size-5 fill-[#f2a33c] text-[#f2a33c]" />
                    {product.rating}
                  </span>
                </div>
              </div>

              <p className="mt-5 max-w-none text-justify font-sans text-[13px] font-normal uppercase leading-[1.35] text-black/65">
                {product.description}{" "}
                <Link
                  href="/products#details"
                  className="relative inline-block font-[500] leading-none text-black after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100"
                >
                  See More...
                </Link>
              </p>

              <section className="mt-[34px] space-y-3">
                <p className="text-[13px] font-normal uppercase text-black/45">
                  Color{" "}
                  <span className="font-[500] text-black">{selectedColor}</span>
                </p>

                <QuickViewColorSwatches
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              </section>

              <section className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-normal uppercase text-black/45">
                    Size{" "}
                    <span className="font-[500] text-black">{selectedSize}</span>
                  </p>
                  <Link
                    href="/products#size-guide"
                    className="group inline-flex flex-col items-start pb-0.5 text-[13px] font-normal uppercase leading-none text-black/45 transition-colors duration-200 hover:text-black focus-visible:text-black"
                  >
                    <span>View Size Chart</span>
                    <span
                      aria-hidden="true"
                      className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {product.sizes.map((size) => (
                    <QuickViewSizeButton
                      key={size}
                      active={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </QuickViewSizeButton>
                  ))}
                </div>
              </section>

              <button
                type="button"
                className="mt-12 flex h-10 w-full cursor-pointer items-center justify-center bg-black text-[13px] font-normal uppercase tracking-normal text-white transition-opacity hover:opacity-90"
              >
                Add To Cart
              </button>

              <div className="mt-3 text-center">
                <Link
                  href="/products"
                  className="group inline-flex flex-col items-start pb-0.5 text-[13px] font-normal uppercase leading-none tracking-normal text-black/55 transition-colors duration-200 hover:text-black focus-visible:text-black"
                >
                  <span>View Full Details</span>
                  <span
                    aria-hidden="true"
                    className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
