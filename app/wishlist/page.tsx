"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CartIcon } from "@/components/icons/CartIcon"

import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { usePageContent } from "@/lib/site-content-context"

export default function WishlistPage() {
  const page = usePageContent("wishlistPage")
  const { wishlist, removeFromWishlist, clearWishlist, isLoaded } = useWishlist()
  const { addToCart, setIsCartOpen } = useCart()

  if (!isLoaded) return null

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <h1 className="font-heading text-[20px] font-normal uppercase leading-[1.15] tracking-[0.02em] text-black sm:text-[24px]">
          {page.text("header", "heading")}
        </h1>
        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          {page.show("share") ? (
            <Button
              variant="default"
              className="h-10 w-full rounded-none px-6 text-[13px] font-normal uppercase tracking-[0.04em] sm:w-auto"
            >
              {page.text("share", "label")}
            </Button>
          ) : null}
          <Button
            variant="default"
            className="h-10 w-full rounded-none px-6 text-[13px] font-normal uppercase tracking-[0.04em] sm:w-auto"
            onClick={clearWishlist}
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <div key={product.id} className="group flex flex-col pb-8">
              {/* Product Image */}
              <Link
                href={`/products/${product.id}`}
                className="relative mb-4 aspect-[3/4] w-full overflow-hidden bg-[#f7f7f7]"
              >
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </Link>

              {/* Product Info */}
              <div className="flex flex-col items-center text-center px-4">
                <Link
                  href={`/products/${product.id}`}
                  className="mb-1 text-[14px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black transition-colors hover:text-black/70"
                >
                  {product.alt.length > 60 ? product.alt.substring(0, 60) + "..." : product.alt}
                </Link>
                
                {/* Simulated Size / Color */}
                <p className="mb-1.5 text-[12px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black/50">
                  M / BLUE
                </p>

                {/* Price */}
                <p className="mb-4 text-[14px] font-normal tracking-[0.04em] text-black">
                  ₹5999
                </p>
              </div>

              {/* Actions */}
              <div className="mt-auto flex items-center justify-center gap-1">
                <Button
                  variant="default"
                  className="h-10 rounded-none px-4 text-[13px] font-normal uppercase tracking-[0.04em]"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  Remove
                </Button>
                <Button
                  variant="default"
                  className="h-10 cursor-pointer gap-1.5 rounded-none px-4 text-[13px] font-normal uppercase tracking-[0.04em]"
                  onClick={() => {
                    addToCart(product, "M")
                    setIsCartOpen(true)
                  }}
                >
                  <CartIcon className="size-3.5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="mb-5 text-[14px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black/55">
            {page.text("empty", "text")}
          </p>
          <Button asChild variant="outline" className="h-11 rounded-none px-6 text-[14px] font-normal uppercase tracking-[0.04em]">
            <Link href="/">{page.text("empty", "button")}</Link>
          </Button>
        </div>
      )}
    </main>
  )
}
