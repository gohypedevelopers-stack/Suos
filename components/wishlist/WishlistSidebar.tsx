"use client"

import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { toast } from "sonner"

import { CartIcon } from "@/components/icons/CartIcon"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { usePageContent } from "@/lib/site-content-context"

export function WishlistSidebar() {
  const page = usePageContent("wishlistPage")
  const { isSidebarOpen, setIsSidebarOpen, wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetContent
        className="flex flex-col gap-0 p-0 [&>button]:hidden"
        style={{ width: "min(100vw, max(480px, 32vw))", maxWidth: "none" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <SheetTitle className="font-heading text-[14px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black">
            Wishlist ({wishlist.length})
          </SheetTitle>
          <SheetClose className="inline-flex size-8 items-center justify-center rounded-none text-black transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
            <X className="size-4" />
            <span className="sr-only">Close wishlist</span>
          </SheetClose>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {wishlist.length > 0 ? (
            <div className="space-y-6">
              {wishlist.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-black/10 pb-6 last:border-b-0 last:pb-0">
                  <div className="relative aspect-[3/4] w-[104px] flex-none bg-[#f7f7f7]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="104px"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <Link 
                          href={`/products/${item.id}`}
                          onClick={() => setIsSidebarOpen(false)}
                          className="line-clamp-2 text-[14px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black hover:opacity-70"
                        >
                          {item.alt}
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="shrink-0 p-1 text-black/50 transition-colors hover:text-black"
                          aria-label="Remove from wishlist"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1.5 text-[13px] uppercase leading-[1.4] tracking-[0.04em] text-black/55">M / BLUE</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[14px] font-normal tracking-[0.04em]">₹5999</span>
                      <Button 
                        variant="default" 
                        className="h-9 gap-2 rounded-none px-4 text-[13px] font-normal uppercase tracking-[0.04em]"
                        onClick={() => {
                          addToCart(item, "M")
                          toast.success("Added to cart!")
                          removeFromWishlist(item.id)
                        }}
                      >
                        <CartIcon className="size-3.5" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="mb-5 text-[14px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black/55">
                {page.text("empty", "text")}
              </p>
              <Button asChild variant="outline" className="h-11 rounded-none px-6 text-[14px] font-normal uppercase tracking-[0.04em]" onClick={() => setIsSidebarOpen(false)}>
                <Link href="/">{page.text("empty", "button")}</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="border-t border-black/10 bg-white p-6">
            <Button
              asChild
              className="h-12 w-full rounded-none text-[14px] font-normal uppercase tracking-[0.04em]"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Link href="/wishlist">{page.text("sidebar", "viewAll")}</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
