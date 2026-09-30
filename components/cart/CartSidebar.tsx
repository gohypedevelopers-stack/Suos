"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, Minus, Plus, X } from "lucide-react"

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
import { useCart, type CartItem } from "@/lib/cart-context"

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
  const { removeFromCart, updateQuantity } = useCart()
  
  return (
    <article className="grid grid-cols-[90px_minmax(0,1fr)] gap-3.5 border-b border-white/10 pb-4">
      <Link
        href={item.slug ? `/products/${item.slug}` : "#"}
        className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]"
      >
        <Image
          src={item.image}
          alt={item.alt || item.title || "Cart product"}
          fill
          sizes="90px"
          className="object-cover object-center"
        />
      </Link>

      <div className="flex min-w-0 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={item.slug ? `/products/${item.slug}` : "#"}
              className="truncate block text-[13px] font-normal uppercase leading-[1.2] tracking-[0.04em] text-white/95 hover:opacity-80 transition-opacity"
            >
              {item.title || "NAME OF THE PRODUCT"}
            </Link>

            <div className="mt-1 flex items-center gap-3 text-[11px] uppercase tracking-[0.04em] text-white/60">
              <span>SIZE: <span className="text-white font-medium">{item.size}</span></span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id, item.size)}
            aria-label={`Remove ${item.title}`}
            className="shrink-0 p-1 text-white/60 transition-colors hover:text-white cursor-pointer"
          >
            <X aria-hidden="true" className="size-3.5 stroke-2" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center border border-white/20 bg-white/5">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex size-6 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-[12px] font-medium text-white">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
              aria-label="Increase quantity"
              className="flex size-6 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <p className="text-[13px] font-medium uppercase text-white/95">
            {item.price || "₹2,200"}
          </p>
        </div>
      </div>
    </article>
  )
}

function PromoMarqueeRow() {
  return (
    <div className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-[13px] font-normal uppercase tracking-[0.04em]">
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
  const { cart, totalItems } = useCart()

  const subtotal = cart.reduce((acc, item) => {
    const raw = (item.price || "0").replace(/[^\d.]/g, "")
    const num = parseFloat(raw) || 0
    return acc + num * (item.quantity || 1)
  }, 0)
  const subtotalFormatted = `₹${subtotal.toLocaleString("en-IN")}`

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
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2 text-[14px] font-normal uppercase text-white">
              <Check className="size-4 stroke-[2.4]" />
              <span>{totalItems} ITEM{totalItems !== 1 && "S"} ADDED</span>
            </div>

            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-normal uppercase text-white/80 transition-opacity hover:opacity-100"
              >
                <span>CLOSE</span>
                <X aria-hidden="true" className="size-4 stroke-2" />
              </button>
            </SheetClose>
          </div>

          <SheetTitle className="sr-only">Cart</SheetTitle>
          <SheetDescription className="sr-only">
            Your cart items, offers, recommendations, and checkout actions.
          </SheetDescription>

          {/* Scrollable Container with Offer, Cart Items, Marquee & Recommendations */}
          <div className="cart-item-scrollbar min-h-0 flex-1 overflow-y-auto">
            {/* Cart Offer Progress */}
            <div className="border-b border-white/10 px-5 py-4">
              <CartOfferProgress />
            </div>

            {/* Cart Items List */}
            <div className="px-5 py-4">
              {cart.length > 0 ? (
                <section className="space-y-4">
                  {cart.map((item) => (
                    <CartItemRow key={`scroll-${item.id}-${item.size}`} item={item} />
                  ))}
                </section>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-[13px] uppercase tracking-wider text-white/60">
                    Your cart is empty
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="mt-4 inline-block border border-white px-5 py-2 text-[12px] uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Promo Marquee Strip */}
            <div className="overflow-hidden bg-white py-2 text-black">
              <div className="flex w-max transform-gpu items-center animate-[marquee_30s_linear_infinite] motion-reduce:animate-none [will-change:transform]">
                <PromoMarqueeRow />
                <PromoMarqueeRow />
              </div>
            </div>

            {/* Recommendations (You May Also Like) in scroll body */}
            <div className="border-t border-white/10 px-5 py-5">
              <CartRecommendationsCarousel items={recommendations} />
            </div>
          </div>

          {/* Fixed Bottom Checkout Footer */}
          <div className="flex-none border-t border-white/10 bg-black px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-[13px] uppercase tracking-wider">
              <span className="text-white/70">Subtotal</span>
              <span className="text-[15px] font-medium text-white">{subtotalFormatted}</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => onOpenChange(false)}
              className="flex h-11 w-full items-center justify-center bg-white text-[14px] font-medium uppercase tracking-wider text-black transition-opacity hover:opacity-90"
            >
              Checkout
            </Link>

            <Link
              href="/cart"
              onClick={() => onOpenChange(false)}
              className="mt-2.5 block text-center text-[13px] font-normal uppercase tracking-wider text-white/80 underline underline-offset-4 transition-opacity hover:text-white"
            >
              View Shopping Cart
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
