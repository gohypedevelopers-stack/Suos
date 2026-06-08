"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, X } from "lucide-react"

import { CartOfferProgress } from "@/components/cart/CartOfferProgress"
import { trendingProducts } from "@/components/product/productData"
import { CartRecommendationsCarousel } from "@/components/cart/CartRecommendationsCarousel"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"

type CartItem = {
  id: string
  image: string
  alt: string
  title: string
  size: string
}

const cartItems: CartItem[] = [
  {
    id: "cart-item-1",
    image: trendingProducts[0].image,
    alt: trendingProducts[0].alt,
    title: "NAME OF THE...",
    size: "XS",
  },
  {
    id: "cart-item-2",
    image: trendingProducts[2].image,
    alt: trendingProducts[2].alt,
    title: "NAME OF THE...",
    size: "XS",
  },
]

const promoStripText = "Additional Discount on Pre-paid | Free Return and Exchange"

const recommendations = [
  {
    id: "recommendation-1",
    image: trendingProducts[0].image,
    alt: trendingProducts[0].alt,
  },
  {
    id: "recommendation-2",
    image: trendingProducts[0].image,
    alt: trendingProducts[0].alt,
  },
  {
    id: "recommendation-3",
    image: trendingProducts[0].image,
    alt: trendingProducts[0].alt,
  },
]

function CartItemRow({ item }: { item: CartItem }) {
  return (
    <article className="grid grid-cols-[150px_minmax(0,1fr)] gap-4">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="150px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-between py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[0.95rem] font-normal uppercase leading-[1.15] tracking-[0.06em] text-white/95">
              {item.title}
            </h3>

            <div className="mt-3 flex items-center gap-4 text-[0.8rem] uppercase tracking-[0.04em] text-white/68">
              <span>{item.size}</span>
              <button
                type="button"
                className="transition-opacity hover:opacity-70"
              >
                Edit Size
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label={`Remove ${item.title}`}
            className="mt-0.5 text-[0.95rem] uppercase leading-none text-white/92 transition-opacity hover:opacity-70"
          >
            X
          </button>
        </div>

        <div className="mt-8 flex items-end justify-between">
          <div className="flex items-center gap-2 text-[1.05rem] leading-none">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="transition-opacity hover:opacity-70"
            >
              -
            </button>
            <span>1</span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="transition-opacity hover:opacity-70"
            >
              +
            </button>
          </div>

          <p className="text-[0.9rem] uppercase tracking-[0.08em] text-white/94">
            PRICE
          </p>
        </div>
      </div>
    </article>
  )
}

function PromoMarqueeRow() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10 whitespace-nowrap text-[0.72rem] tracking-[0.04em]">
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={`promo-${index}`} className="whitespace-nowrap">
          {promoStripText}
        </span>
      ))}
    </div>
  )
}

type CartSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="!z-[10000] bg-black/50 backdrop-blur-[1px]"
        className="!z-[10001] overflow-hidden border-l border-white/10 bg-black p-0 text-white shadow-[0_0_80px_rgba(0,0,0,0.45)] ease-in-out duration-300"
        style={{ width: "min(100vw, 420px)", maxWidth: "none" }}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white">
              <Check className="size-4 stroke-[2.4]" />
              <span>2 ITEM ADDED</span>
            </div>

            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/90 transition-opacity hover:opacity-60"
              >
                <span>CLOSE</span>
                <X className="size-4 stroke-[1.8]" />
              </button>
            </SheetClose>
          </div>

          <SheetTitle className="sr-only">Cart</SheetTitle>
          <SheetDescription className="sr-only">
            Your cart items, offers, recommendations, and checkout actions.
          </SheetDescription>

          <div className="flex-none px-5 py-5">
            <CartOfferProgress />
          </div>

          <div className="cart-item-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-5">
            <section className="space-y-5">
              {cartItems.map((item) => (
                <CartItemRow key={`scroll-${item.id}`} item={item} />
              ))}
            </section>
          </div>

          <div className="flex-none">
            <div className="overflow-hidden bg-white px-3 py-2 text-black">
              <div className="flex w-max items-center animate-[marquee_18s_linear_infinite] motion-reduce:animate-none [will-change:transform]">
                <PromoMarqueeRow />
                <PromoMarqueeRow />
              </div>
            </div>

            <div className="px-5 py-5">
              <CartRecommendationsCarousel items={recommendations} />

              <div className="mt-6 pb-2">
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center bg-white text-[1rem] font-semibold uppercase tracking-[0.08em] text-black transition-opacity hover:opacity-90"
                >
                  Checkout
                </button>

                <Link
                  href="/cart"
                  className="mt-3 block text-center text-[0.85rem] uppercase tracking-[0.08em] text-white underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  View Shopping Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
