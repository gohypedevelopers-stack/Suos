"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

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

export function ProductCardView({
  product,
  expanded = false,
}: {
  product: ProductCard
  expanded?: boolean
}) {
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [prevImageIndex, setPrevImageIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const indicatorCount = Math.min(3, gallery.length)
  const activeIndicatorIndex =
    indicatorCount <= 1
      ? 0
      : gallery.length <= 3
      ? activeImageIndex
      : Math.min(
          indicatorCount - 1,
          Math.max(
            0,
            Math.round((activeImageIndex / (gallery.length - 1)) * (indicatorCount - 1))
          )
        )
  
  const { isInWishlist, toggleWishlist, setIsSidebarOpen } = useWishlist()
  const { addToCart, setIsCartOpen } = useCart()
  
  const isWished = isInWishlist(product.id)
  const activeImage = gallery[activeImageIndex] ?? product.image

  const changeImage = (newIndex: number) => {
    if (newIndex !== activeImageIndex && newIndex >= 0 && newIndex < gallery.length) {
      setPrevImageIndex(activeImageIndex)
      setActiveImageIndex(newIndex)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gallery.length <= 1) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (rect.width <= 0) return
    const fraction = Math.max(0, Math.min(x / rect.width, 0.999))
    const newIndex = Math.floor(fraction * gallery.length)
    changeImage(newIndex)
  }

  const handleMouseLeave = () => {
    changeImage(0)
  }

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gallery.length <= 1) return
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || gallery.length <= 1) return
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    touchStartRef.current = null

    // Require deliberate horizontal swipe of 30px that dominates vertical scroll
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        // Swipe left -> next image
        changeImage((activeImageIndex + 1) % gallery.length)
      } else {
        // Swipe right -> previous image
        changeImage((activeImageIndex - 1 + gallery.length) % gallery.length)
      }
    }
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
    const productToAdd: ProductCard = {
      ...product,
      title: product.title || "WASHED BLACK STRAIGHT FIT DENIM",
      price: displayPrice,
    }
    addToCart(productToAdd, size)
    setIsCartOpen(true)
  }

  const handleQuickView = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setQuickViewOpen(true)
  }

  const handleWishlistClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleWishlist(product)
    if (!isWished) {
      setIsSidebarOpen(true)
    }
  }

  const handleCartClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const sizeToAdd = selectedSize || (sizesList && sizesList.length > 0 ? sizesList[0] : "M")
    const productToAdd: ProductCard = {
      ...product,
      title: product.title || "WASHED BLACK STRAIGHT FIT DENIM",
      price: displayPrice,
    }
    addToCart(productToAdd, sizeToAdd)
    setIsCartOpen(true)
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
      className={cn(
        "group relative flex flex-col bg-white text-black p-0.5 sm:p-1 pb-2 sm:pb-2.5 transition-all duration-200 border hover:z-10",
        isExpanded ? "border-black z-10" : "border-transparent hover:border-black"
      )}
    >
      <div
        className="relative aspect-[2/3] sm:aspect-[330/440] w-full overflow-hidden bg-neutral-900 touch-pan-y select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {gallery.length > 0 ? (
          gallery.map((imgSrc, idx) => {
            const isActive = idx === activeImageIndex
            const isPrev = idx === prevImageIndex

            return (
              <Image
                key={`${product.id}-${idx}`}
                src={imgSrc}
                alt={product.alt || product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={cn(
                  "object-cover object-center group-hover:scale-[1.015]",
                  isActive
                    ? "z-10 opacity-100 transition-opacity duration-150 ease-out"
                    : isPrev
                    ? "z-[5] opacity-100 transition-none"
                    : "z-0 opacity-0 pointer-events-none transition-none"
                )}
                priority={idx < 2}
                loading={idx < 2 ? "eager" : "lazy"}
              />
            )
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
            <span className="text-xs uppercase text-neutral-400">No Image</span>
          </div>
        )}

        {/* Link to product detail page */}
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.title}`}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        />

        {/* Badge at Top-Left (Smaller and corner-aligned on mobile) */}
        <div className="pointer-events-none absolute left-1.5 top-1.5 sm:left-2.5 sm:top-2.5 z-20">
          <span className="inline-block bg-black px-1.5 py-[2.5px] sm:px-2.5 sm:py-1 text-[7.5px] sm:text-[10px] font-medium uppercase tracking-[0.08em] sm:tracking-[0.14em] text-white leading-none shadow-xs">
            {product.badge || "NEW ARRIVAL"}
          </span>
        </div>

        {/* Wishlist Button at Top-Right */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Toggle wishlist"
          title={isWished ? "Remove from wishlist" : "Add to wishlist"}
          className="pointer-events-auto absolute right-1.5 top-1.5 sm:right-2.5 sm:top-2.5 z-20 flex size-6 sm:size-8 items-center justify-center text-white transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <Heart
            className={cn(
              "size-3.5 sm:size-[18px] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
              isWished ? "fill-white stroke-white" : "fill-transparent stroke-white"
            )}
            strokeWidth={1.6}
          />
        </button>

        {/* Expand / Collapse Button (+ / -) in Bottom-Right Corner of Image - Mobile only */}
        <button
          type="button"
          aria-label={isExpanded ? "Collapse details" : "Expand size options"}
          onClick={toggleExpand}
          className="pointer-events-auto absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 z-20 flex md:hidden size-[22px] sm:size-6 items-center justify-center bg-white text-black shadow-xs transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative size-3 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "size-3 transition-transform duration-300 ease-out",
                isExpanded ? "rotate-180" : "rotate-0"
              )}
            >
              {/* Horizontal line (stays in place as the minus bar) */}
              <line x1="5" y1="12" x2="19" y2="12" />
              {/* Vertical line (rotates and collapses height to morph + into -) */}
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                className={cn(
                  "origin-center transition-all duration-300 ease-out",
                  isExpanded
                    ? "scale-y-0 opacity-0 rotate-90"
                    : "scale-y-100 opacity-100 rotate-0"
                )}
              />
            </svg>
          </div>
        </button>

        {/* Desktop Hover Quick View Button */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 sm:bottom-7 z-20 hidden md:flex items-center justify-center px-2 transition-[opacity,transform] duration-200 ease-out opacity-0 translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto"
        >
          <button
            type="button"
            onClick={handleQuickView}
            className="bg-black px-4 py-1.5 text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-white hover:bg-neutral-900 transition-colors cursor-pointer whitespace-nowrap shadow-md"
          >
            QUICK VIEW
          </button>
        </div>

        {/* Mobile Expanded Quick View Button */}
        {isExpanded && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-6.5 z-20 flex md:hidden items-center justify-center px-2">
            <button
              type="button"
              onClick={handleQuickView}
              className="bg-black px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white hover:bg-neutral-900 transition-colors cursor-pointer whitespace-nowrap shadow-md"
            >
              QUICK VIEW
            </button>
          </div>
        )}

        {/* Gallery Indicator Lines (Max 3 indicators, even if gallery has more images) */}
        {indicatorCount > 1 && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-2 sm:bottom-3 z-20 flex items-center justify-center gap-1 sm:gap-1.5 px-2">
            {Array.from({ length: indicatorCount }).map((_, dashIdx) => {
              const targetImageIndex = Math.round(
                (dashIdx / (indicatorCount - 1)) * (gallery.length - 1)
              )

              return (
                <button
                  key={dashIdx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    changeImage(targetImageIndex)
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation()
                    changeImage(targetImageIndex)
                  }}
                  className="group/ind flex items-center justify-center py-1.5 px-0.5 cursor-pointer"
                  aria-label={`Slide ${dashIdx + 1}`}
                >
                  <span
                    className={cn(
                      "block h-[0.5px] sm:h-[1px] transition-all duration-200 rounded-full",
                      dashIdx === activeIndicatorIndex
                        ? "w-[26px] sm:w-8 bg-white drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.5)]"
                        : "w-[26px] sm:w-8 bg-white/40 group-hover/ind:bg-white/70"
                    )}
                  />
                </button>
              )
            })}
          </div>
        )}

      </div>

      {/* Info Area Below Image */}
      <div className="mt-2.5 md:mt-3 flex flex-col">
        {/* Title row with icon */}
        <div className="flex items-center justify-between gap-1.5 md:gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="truncate text-[10px] md:text-[14px] font-normal uppercase tracking-normal md:tracking-tight text-black transition-opacity hover:opacity-70 leading-none md:leading-normal"
          >
            {product.title || "WASHED BLACK STRAIGHT FIT DENIM"}
          </Link>

          {/* Shopping Tote Bag Button */}
          <button
            type="button"
            onClick={handleCartClick}
            aria-label="Add to cart"
            title="Add to cart"
            className="shrink-0 cursor-pointer p-0.5 text-black transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[13px] md:size-[18px]"
            >
              <rect x="4.5" y="9" width="15" height="12" />
              <path d="M7.5 9a4.5 4.5 0 0 1 9 0" />
            </svg>
          </button>
        </div>

        {/* Subtitle row */}
        <p className="mt-1 truncate text-[9px] md:text-[12px] uppercase tracking-normal md:tracking-wider text-neutral-400 font-normal leading-none md:leading-normal">
          {subtitle}
        </p>

        {/* Pricing row */}
        <div className="mt-1.5 flex items-baseline gap-1.5 md:gap-2 flex-wrap text-[10px] md:text-[13px] leading-none md:leading-normal">
          {comparePriceStr ? (
            <span className="font-normal text-neutral-400 line-through text-[9px] md:text-[12px]">
              {comparePriceStr}
            </span>
          ) : null}
          <span className="font-normal md:font-semibold text-black">
            {displayPrice}
          </span>
          {discountPercent && discountPercent > 0 ? (
            <span className="text-[8.5px] md:text-[11px] font-normal uppercase tracking-wide text-red-500">
              SAVE {discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Size Selection Row (Figma Group 3 specs on mobile, original layout on desktop) */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
            isExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-1.5 md:pt-2.5">
              {sizesList.map((size) => {
                const isSelected = selectedSize === size
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => handleSelectSize(size, e)}
                    className={cn(
                      "flex min-w-[19px] h-[16px] px-1 items-center justify-center text-[8px] font-normal uppercase leading-none transition-colors cursor-pointer select-none md:min-w-[28px] md:h-7 md:px-1.5 md:text-[11px] md:leading-normal",
                      isSelected
                        ? "border border-black bg-neutral-100 text-black font-medium md:bg-white md:font-semibold"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:border-black"
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

      <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-0.5 sm:gap-1 md:grid-cols-2 lg:grid-cols-4 items-start">
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
