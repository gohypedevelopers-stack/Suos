import Image from "next/image"
import Link from "next/link"
import { Check, X } from "lucide-react"

import { CartOfferProgress } from "@/components/cart/CartOfferProgress"
import { CartRecommendationsCarousel } from "@/components/cart/CartRecommendationsCarousel"
import { trendingProducts } from "@/components/product/productData"

export const metadata = {
  title: "Cart | SUOS",
  description: "Your shopping cart on SUOS.",
}

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

export default function CartPage() {
  return (
    <main className="fixed inset-0 z-[60] overflow-y-auto bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col px-4 py-5">
        <header className="flex items-center justify-between text-[0.78rem] uppercase tracking-[0.08em]">
          <div className="flex items-center gap-2">
            <Check className="size-4 stroke-[2.4]" />
            <span>2 ITEM ADDED</span>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <span>CLOSE</span>
            <X className="size-4 stroke-[2.4]" />
          </Link>
        </header>

        <section className="mt-7">
          <CartOfferProgress />
        </section>

        <section className="mt-8 space-y-6">
          {cartItems.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </section>

        <div className="mt-5 overflow-hidden bg-white px-3 py-2 text-black">
          <div className="whitespace-nowrap text-[0.72rem] uppercase tracking-[0.04em]">
            Additional Discount on Pre-paid | Free Return and Exchange |
            Additional Discount on Pre-paid | Free Return and Exchange
          </div>
        </div>

        <section className="mt-8">
          <CartRecommendationsCarousel items={recommendations} />
        </section>

        <div className="mt-8 pb-6">
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
    </main>
  )
}
