"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { ProductCard } from "@/components/product/productData"
import { syncCartAction } from "@/app/actions/cart"
import { track } from "@/lib/analytics-client"

export type CartItem = ProductCard & {
  size: string
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  isLoaded: boolean
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addToCart: (product: ProductCard, size: string) => void
  removeFromCart: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("suos-cart")
      if (saved) {
        setCart(JSON.parse(saved))
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage when cart changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("suos-cart", JSON.stringify(cart))
      } catch (e) {
        console.warn("Failed to save cart to localStorage", e)
      }
    }
  }, [cart, isLoaded])

  // Mirror the cart to the server for signed-in shoppers (abandoned checkouts).
  const hasSyncedRef = useRef(false)
  useEffect(() => {
    if (!isLoaded) return
    if (cart.length === 0 && !hasSyncedRef.current) return

    const timer = setTimeout(() => {
      hasSyncedRef.current = true
      void syncCartAction(
        cart.map((item) => ({ productId: item.id, size: item.size, quantity: item.quantity })),
      )
    }, 1500)

    return () => clearTimeout(timer)
  }, [cart, isLoaded])

  const addToCart = (product: ProductCard, size: string) => {
    const resolvedProduct: ProductCard = {
      ...product,
      title: product.title || "WASHED BLACK STRAIGHT FIT DENIM",
      price: product.price && product.price !== "N/A" ? product.price : "₹2,200",
      image: product.image || "/images/products/product1.png",
    }
    const resolvedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M")

    track("ADD_TO_CART", {
      name: resolvedProduct.title,
      payload: { productId: resolvedProduct.id, size: resolvedSize },
    })

    setCart((prev) => {
      const existing = prev.find((item) => item.id === resolvedProduct.id && item.size === resolvedSize)
      if (existing) {
        return prev.map((item) =>
          item.id === resolvedProduct.id && item.size === resolvedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...resolvedProduct, size: resolvedSize, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)))
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => !(item.id === id && item.size === size))
      }
      return prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, isLoaded, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
