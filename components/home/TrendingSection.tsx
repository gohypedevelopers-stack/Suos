"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Plus, Minus, ShoppingBag, Bookmark } from "lucide-react"

import { cn } from "@/lib/utils"
import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import type { ProductDetail } from "@/components/product/productData"

export type ProductCard = {
  id: string
  title: string
  slug: string
  image: string
  alt: string
  badge?: string
  sizes: string[]
  swatches: string[]
  gallery: string[]
  price: string | null
  compareAtPrice?: string | null
  description?: string | null
  category?: { name: string; slug: string } | null
}

function cardToProductDetail(card: ProductCard): ProductDetail {
  const galleryImages = (card.gallery?.length ? card.gallery : [card.image]).map((src) => ({
    src,
    alt: card.alt || card.title,
    objectPosition: "center 36%",
  }))

  return {
    id: card.id,
    slug: card.slug,
    editLabel: card.category?.name?.toUpperCase() || "SUOS",
    title: card.title,
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: card.title },
    ],
    originalPrice: card.compareAtPrice || null,
    price: card.price || "N/A",
    sold: "1,238 Sold",
    rating: "4.5",
    description: card.description || "",
    detailsBody: card.description || "",
    careNotes: [
      "Machine wash cold, inside out.",
      "Do not bleach or tumble dry.",
      "Hang dry to preserve the drape.",
      "Steam lightly to refresh the finish.",
    ],
    shippingNotes: [
      "Standard delivery in 2-4 business days.",
      "Free exchange within 14 days.",
      "Cash on delivery available on select pin codes.",
    ],
    colorName: "Selected",
    colors: card.swatches.map((swatch, idx) => ({
      name: `Color ${idx + 1}`,
      value: swatch,
    })),
    sizes: card.sizes?.length ? card.sizes : ["28", "32", "36", "42"],
    gallery: galleryImages,
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "14 days", icon: "exchange" },
      { label: "Secure checkout", detail: "COD available", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
    completeLook: galleryImages.slice(0, 3),
    fitType: "regular",
  }
}

const tabs = [
  { label: "ALL", active: false },
  { label: "WOMEN", active: false },
  { label: "MEN", active: true },
] as const

const hoverSizes = ["28", "32", "36", "42"]

function ColorSwatches({ swatches }: { swatches: string[] }) {
  return (
    <div className="flex items-start gap-1">
      {swatches.map((swatch) => (
        <span
          key={swatch}
          className="group/swatch relative inline-flex cursor-pointer flex-col items-center pb-0.5 pointer-events-auto"
        >
          <span
            className="size-[15px] border border-black/10"
            style={{ backgroundColor: swatch }}
          />
          <span
            aria-hidden="true"
            className="mt-[3px] h-px w-full origin-left scale-x-0 bg-black/55 transition-transform duration-200 group-hover/swatch:scale-x-100"
          />
        </span>
      ))}
    </div>
  )
}

function SizeMarker({ size }: { size: string }) {
  return (
    <span className="group/size relative inline-flex cursor-pointer flex-col items-center pb-0.5 pointer-events-auto">
      <span className="flex h-[15px] items-center justify-center leading-none">{size}</span>
      <span
        aria-hidden="true"
        className="mt-[1px] h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 group-hover/size:scale-x-100"
      />
    </span>
  )
}

export function ProductCardView({
  product,
  expanded = false,
}: {
  product: ProductCard
  expanded?: boolean
}) {
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  
  const { isInWishlist, toggleWishlist, setIsSidebarOpen } = useWishlist()
  const { addToCart, setIsCartOpen } = useCart()
  
  const isWished = isInWishlist(product.id)
  const activeImage = gallery[activeImageIndex] ?? product.image
  const hasGalleryControls = gallery.length > 1

  const handlePreviousImage = () => {
    setActiveImageIndex(
      (currentIndex) => (currentIndex - 1 + gallery.length) % gallery.length
    )
  }

  const handleNextImage = () => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % gallery.length)
  }

  const toggleExpand = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  const handleSelectSize = (size: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedSize(size)
    addToCart(product, size)
    setIsCartOpen(true)
  }

  const handleQuickView = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setQuickViewOpen(true)
  }

  const handleTitleIconClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (isExpanded) {
      setIsCartOpen(true)
    } else {
      toggleWishlist(product)
      if (!isWished) {
        setIsSidebarOpen(true)
      }
    }
  }

  // Price calculations
  const displayPrice = product.price && product.price !== "N/A" ? product.price : "₹2,200"
  const numPrice = parseInt(displayPrice.replace(/[^\d]/g, "") || "2200", 10)
  
  // Calculate compare price if not provided
  const comparePriceStr = product.compareAtPrice
    ? product.compareAtPrice
    : `₹${(Math.round((numPrice * 1.35) / 100) * 100).toLocaleString("en-IN")}`
  const numCompare = parseInt(comparePriceStr.replace(/[^\d]/g, "") || "3200", 10)
  
  const discountPercent =
    numCompare > numPrice
      ? Math.round(((numCompare - numPrice) / numCompare) * 100)
      : 10

  const subtitle = product.category?.name
    ? `ORIGINALS 001 - ${product.category.name.toUpperCase()}`
    : "ORIGINALS 001 - AFTER DARK"

  const sizesList =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["6", "8", "10", "14", "18", "20"]

  return (
    <article
      className="group relative flex flex-col bg-white text-black p-2 sm:p-2.5 transition-colors duration-200"
    >
      <div className="relative aspect-[330/440] w-full overflow-hidden bg-neutral-100">
        {activeImage ? (
          <Image
            key={`${product.id}-${activeImageIndex}`}
            src={activeImage}
            alt={product.alt || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <span className="text-xs uppercase text-neutral-400">No Image</span>
          </div>
        )}

        {/* Link to product detail page */}
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.title}`}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        />

        {/* Badge at Top-Left */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-20">
          <span className="inline-block bg-black px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-white leading-none">
            {product.badge || "NEW ARRIVAL"}
          </span>
        </div>

        {/* Expand / Collapse Button (+ / -) in Bottom-Right Corner of Image */}
        <button
          type="button"
          aria-label={isExpanded ? "Collapse details" : "Expand size options"}
          onClick={toggleExpand}
          className="pointer-events-auto absolute bottom-0 right-0 z-20 flex size-8 sm:size-9 items-center justify-center bg-white text-black shadow-sm transition-colors hover:bg-neutral-100 cursor-pointer"
        >
          {isExpanded ? (
            <Minus className="size-4 stroke-[2.2]" />
          ) : (
            <Plus className="size-4 stroke-[2.2]" />
          )}
        </button>

        {/* Expanded Mode: QUICK VIEW & Gallery Indicators in Center Bottom */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-10 sm:bottom-11 z-20 flex flex-col items-center justify-center gap-1.5 px-2 transition-[opacity,transform] duration-200 ease-out",
            isExpanded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1.5 pointer-events-none"
          )}
        >
          <button
            type="button"
            onClick={handleQuickView}
            tabIndex={isExpanded ? 0 : -1}
            className={cn(
              "bg-black px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-white shadow-md hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap",
              isExpanded ? "pointer-events-auto" : "pointer-events-none"
            )}
          >
            QUICK VIEW
          </button>

          {gallery.length > 1 && (
            <div
              className={cn(
                "flex items-center justify-center gap-1 transition-opacity duration-200",
                isExpanded ? "pointer-events-auto" : "pointer-events-none"
              )}
            >
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  tabIndex={isExpanded ? 0 : -1}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveImageIndex(idx)
                  }}
                  className={cn(
                    "h-[2px] transition-colors cursor-pointer",
                    idx === activeImageIndex
                      ? "w-5 bg-black"
                      : "w-3 bg-black/30 hover:bg-black/60"
                  )}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Gallery Prev / Next Arrows on Hover */}
        {hasGalleryControls && (
          <div className="pointer-events-none absolute inset-x-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              aria-label="Previous product image"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                handlePreviousImage()
              }}
              className="pointer-events-auto flex size-7 items-center justify-center bg-white/80 text-black shadow transition-colors hover:bg-white cursor-pointer"
            >
              <ChevronLeft className="size-4" strokeWidth={2.2} />
            </button>

            <button
              type="button"
              aria-label="Next product image"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                handleNextImage()
              }}
              className="pointer-events-auto flex size-7 items-center justify-center bg-white/80 text-black shadow transition-colors hover:bg-white cursor-pointer"
            >
              <ChevronRight className="size-4" strokeWidth={2.2} />
            </button>
          </div>
        )}
      </div>

      {/* Info Area Below Image */}
      <div className="mt-2.5 flex flex-col">
        {/* Title row with icon */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="truncate text-[13px] sm:text-[14px] font-normal uppercase tracking-tight text-black transition-opacity hover:opacity-70"
          >
            {product.title || "WASHED BLACK STRAIGHT FIT DENIM"}
          </Link>

          <button
            type="button"
            onClick={handleTitleIconClick}
            aria-label={isExpanded ? "View Cart" : "Toggle wishlist"}
            className="flex-shrink-0 cursor-pointer p-0.5 text-black transition-transform hover:scale-110"
          >
            {isExpanded ? (
              <ShoppingBag className="size-4 stroke-[1.8]" />
            ) : (
              <Bookmark
                className={cn(
                  "size-4",
                  isWished ? "fill-black stroke-black" : "stroke-black"
                )}
                strokeWidth={1.8}
              />
            )}
          </button>
        </div>

        {/* Subtitle row */}
        <p className="mt-0.5 truncate text-[11px] sm:text-[12px] uppercase tracking-wider text-neutral-500 font-normal">
          {subtitle}
        </p>

        {/* Pricing row (stable, no layout shift or jitter) */}
        <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap text-[12px] sm:text-[14px]">
          <span className="font-semibold text-black">
            {displayPrice}
          </span>
          <span className="font-normal text-neutral-400 line-through text-[11px] sm:text-[13px]">
            {comparePriceStr}
          </span>
          {discountPercent && discountPercent > 0 ? (
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-red-600">
              SAVE {discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Size Selection Row (Smooth, jitter-free accordion animation) */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-2 sm:pt-2.5">
              {sizesList.map((size) => {
                const isSelected = selectedSize === size
                return (
                  <button
                    key={size}
                    type="button"
                    tabIndex={isExpanded ? 0 : -1}
                    onClick={(e) => handleSelectSize(size, e)}
                    className={cn(
                      "flex min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-1 sm:px-1.5 items-center justify-center text-[10px] sm:text-[12px] font-medium uppercase border transition-colors cursor-pointer",
                      isSelected
                        ? "border-black ring-1 ring-black bg-white text-black font-semibold"
                        : "border-neutral-300 bg-white text-neutral-800 hover:border-black"
                    )}
                    title={`Select size ${size} and add to cart`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <ProductQuickViewModal
        key={`${product.id}-${quickViewOpen ? "open" : "closed"}-${activeImageIndex}`}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        product={cardToProductDetail(product)}
        gallery={gallery}
        initialImageIndex={activeImageIndex}
      />
    </article>
  )
}

export function TrendingSection({ products = [] }: { products?: ProductCard[] }) {
  return (
    <section className="w-full bg-white px-3 sm:px-6 lg:px-8 py-10 md:py-16 text-black">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-heading text-[22px] sm:text-[24px] font-normal uppercase leading-none tracking-[-0.04em]">
          Trending
        </h2>

        <div className="flex items-center gap-5 sm:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              aria-pressed={tab.active}
              className={cn(
                "group inline-flex flex-col items-start pb-0.5 text-[12px] sm:text-[13px] font-normal uppercase leading-none tracking-normal transition-opacity hover:opacity-70"
              )}
            >
              <span>{tab.label}</span>
              <span
                aria-hidden="true"
                className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100"
              />
            </button>
          ))}
        </div>

      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCardView key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/collections"
          className="inline-flex h-9 items-center justify-center border border-black px-5 text-[13px] font-normal uppercase tracking-normal transition-colors hover:bg-black hover:text-white"
        >
          View All
        </Link>
      </div>
    </section>
  )
}
