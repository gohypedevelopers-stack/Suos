"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, X } from "lucide-react"
import { toast } from "sonner"

import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

export function WishlistSidebar() {
  const { isSidebarOpen, setIsSidebarOpen, wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <SheetTitle className="font-heading text-lg font-medium uppercase tracking-wider text-black">
            Wishlist ({wishlist.length})
          </SheetTitle>
          <SheetClose className="inline-flex size-8 items-center justify-center rounded-none text-black transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
            <X className="size-4" />
            <span className="sr-only">Close wishlist</span>
          </SheetClose>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {wishlist.length > 0 ? (
            <div className="space-y-6">
              {wishlist.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative aspect-[3/4] w-24 flex-none bg-[#f7f7f7]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <Link 
                          href={`/products/${item.id}`}
                          onClick={() => setIsSidebarOpen(false)}
                          className="text-xs font-normal uppercase leading-snug tracking-wide text-black hover:opacity-70"
                        >
                          {item.alt.length > 40 ? item.alt.substring(0, 40) + "..." : item.alt}
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-black/50 hover:text-black transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-[10px] uppercase text-black/50">M / BLUE</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium">₹5999</span>
                      <Button 
                        variant="default" 
                        className="h-8 rounded-none px-3 text-[10px] uppercase gap-1.5"
                        onClick={() => {
                          addToCart(item, "M")
                          toast.success("Added to cart!")
                          removeFromWishlist(item.id)
                        }}
                      >
                        <ShoppingBag className="size-3" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-wide text-black/50">
                Your wishlist is empty
              </p>
              <Button asChild variant="outline" className="uppercase" onClick={() => setIsSidebarOpen(false)}>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="border-t border-black/10 bg-white p-6">
            <Button
              asChild
              className="w-full rounded-none h-12 text-sm font-medium uppercase tracking-wider"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Link href="/wishlist">View Full Wishlist</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
