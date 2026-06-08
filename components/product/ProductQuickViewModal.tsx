"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react"
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
              "flex h-[40px] w-[75px] items-stretch justify-stretch bg-white transition-[box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
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
        "inline-flex h-10 items-center justify-center border text-[22px] font-medium leading-none transition-[background-color,border-color,color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
        active
          ? "border-black bg-black text-white"
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
  const [activeImageIndex, setActiveImageIndex] = useState(() =>
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

  const handlePreviousImage = () => {
    if (galleryImages.length === 0) {
      return
    }

    setActiveImageIndex(
      (currentIndex) =>
        (currentIndex - 1 + galleryImages.length) % galleryImages.length
    )
  }

  const handleNextImage = () => {
    if (galleryImages.length === 0) {
      return
    }

    setActiveImageIndex((currentIndex) => (currentIndex + 1) % galleryImages.length)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/80 backdrop-blur-[1px]"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className="!gap-0 !w-[min(96vw,956px)] !max-w-none max-h-[calc(100dvh-1.25rem)] overflow-hidden rounded-none border-0 bg-white p-0 text-black ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{product.title} quick view</DialogTitle>
        <DialogDescription className="sr-only">
          Quick view dialog for {product.title}
        </DialogDescription>

        <div className="grid h-[min(88dvh,520px)] grid-cols-1 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <div className="relative min-h-[360px] bg-[#111] lg:min-h-0">
            <Image
              key={`${activeImage ?? ""}-${activeImageIndex}`}
              src={activeImage ?? product.gallery[0]?.src ?? ""}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover object-center"
            />

            {galleryImages.length > 1 ? (
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-3 text-white">
                <button
                    type="button"
                    aria-label="Previous image"
                    onClick={handlePreviousImage}
                    className="inline-flex size-10 items-center justify-center text-white/90 transition-opacity hover:opacity-70"
                  >
                  <ChevronLeft className="size-7 stroke-[1.8]" />
                </button>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={handleNextImage}
                  className="inline-flex size-10 items-center justify-center text-white/90 transition-opacity hover:opacity-70"
                >
                  <ChevronRight className="size-7 stroke-[1.8]" />
                </button>
              </div>
            ) : null}

            <div className="absolute bottom-3 left-3 bg-white/75 px-2 py-1 text-[0.85rem] font-medium text-black">
              {galleryImages.length > 0 ? activeImageIndex + 1 : 1}/
              {galleryImages.length || 1}
            </div>
          </div>

          <div className="relative min-h-0 overflow-hidden px-5 py-3.5 sm:px-6 sm:py-3.5 lg:px-7 lg:py-4">
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close quick view"
                className="absolute right-4 top-3 inline-flex size-8 items-center justify-center text-[1.1rem] font-semibold leading-none text-black transition-opacity hover:opacity-70"
              >
                <X className="size-5 stroke-[2.1]" />
              </button>
            </DialogClose>

            <div className="space-y-2.5 pr-3">
              <p className="text-[14px] font-normal uppercase tracking-[0.22em] text-black/45">
                {product.editLabel}
              </p>
              <h2 className="font-heading text-[40px] font-normal uppercase leading-[0.95] tracking-[-0.06em]">
                {product.title}
              </h2>

              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-end gap-3">
                  <span className="text-[18px] font-normal leading-none text-black/45 line-through">
                    {product.originalPrice}
                  </span>
                  <span className="font-heading text-[22px] font-medium leading-none tracking-[-0.04em]">
                    {product.price}
                  </span>
                </div>

                <div className="flex items-end gap-2 text-black">
                  <span className="text-[16px] font-normal leading-none text-black/45">
                    {product.sold}
                  </span>
                  <span className="text-black/25">•</span>
                  <span className="inline-flex items-center gap-1 text-[22px] font-medium leading-none text-black">
                    <Star className="size-5 fill-[#f2a33c] text-[#f2a33c]" />
                    {product.rating}
                  </span>
                </div>
              </div>

              <p className="max-w-[36rem] font-sans text-[16px] font-normal leading-[1.5] text-black/65">
                {product.description}{" "}
                <Link
                  href="/products#details"
                  className="font-medium text-black"
                >
                  See More....
                </Link>
              </p>

              <section className="space-y-3">
                <p className="text-[22px] font-medium text-black/45">
                  Color:{" "}
                  <span className="font-medium text-black">{selectedColor}</span>
                </p>

                <QuickViewColorSwatches
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[18px] font-normal text-black/45">
                    Size:{" "}
                    <span className="font-normal text-black">{selectedSize}</span>
                  </p>
                  <Link
                    href="/products#size-guide"
                    className="text-[18px] font-normal text-black/45 underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    View Size Chart
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
                className="flex h-12 w-full items-center justify-center bg-black text-[22px] font-medium uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
              >
                Add To Cart
              </button>

              <div className="pt-0 text-center">
                <Link
                  href="/products"
                  className="text-[16px] font-normal uppercase tracking-[0.08em] text-black/55 underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
