"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { useWishlist } from "@/lib/wishlist-context"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, isLoaded } = useWishlist()

  if (!isLoaded) return null

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <h1 className="font-heading text-lg font-medium uppercase tracking-wider text-black">
          My Wishlist
        </h1>
        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          <Button 
            variant="default" 
            className="h-9 w-full rounded-none px-6 text-sm font-medium sm:w-auto"
          >
            Share Wishlist
          </Button>
          <Button
            variant="default"
            className="h-9 w-full rounded-none px-6 text-sm font-medium sm:w-auto"
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
                  className="mb-2 text-[11px] font-normal uppercase leading-snug tracking-wide text-black transition-colors hover:text-black/70"
                >
                  {product.alt.length > 60 ? product.alt.substring(0, 60) + "..." : product.alt}
                </Link>
                
                {/* Simulated Size / Color */}
                <p className="mb-2 text-[10px] font-normal uppercase tracking-wider text-black/50">
                  M / BLUE
                </p>

                {/* Price */}
                <p className="mb-4 text-[12px] font-medium text-black">
                  ₹5999
                </p>
              </div>

              {/* Actions */}
              <div className="mt-auto flex items-center justify-center gap-1">
                <Button
                  variant="default"
                  className="h-8 rounded-none px-4 text-xs font-medium"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  Remove
                </Button>
                <Button
                  variant="default"
                  className="h-8 rounded-none px-4 text-xs font-medium gap-1.5"
                >
                  <ShoppingBag className="size-3.5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-black/50">
            Your wishlist is empty
          </p>
          <Button asChild variant="outline" className="uppercase">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </main>
  )
}
