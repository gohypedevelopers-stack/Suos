"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { type ProductCard } from "@/components/product/productData"

type WishlistContextType = {
  wishlist: ProductCard[]
  isLoaded: boolean
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  addToWishlist: (product: ProductCard) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (product: ProductCard) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductCard[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("wishlist")
    if (saved) {
      try {
        setWishlist(JSON.parse(saved))
      } catch (e) {}
    }
    setIsLoaded(true)
  }, [])

  // save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, isLoaded])

  const addToWishlist = (product: ProductCard) => {
    setWishlist(curr => {
      if (curr.find(p => p.id === product.id)) return curr
      return [...curr, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(curr => curr.filter(p => p.id !== productId))
  }

  const toggleWishlist = (product: ProductCard) => {
    if (wishlist.some(p => p.id === product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId)
  }

  const clearWishlist = () => setWishlist([])

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist,
        isLoaded,
        isSidebarOpen,
        setIsSidebarOpen,
        addToWishlist, 
        removeFromWishlist, 
        toggleWishlist,
        isInWishlist, 
        clearWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
