import { ShoppingBag, type LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The one "cart / add to cart" icon used across the storefront. It is the
 * same bag shown in the navbar, so every add-to-cart affordance matches.
 */
export function CartIcon({ className, strokeWidth = 1.7, ...props }: LucideProps) {
  return (
    <ShoppingBag
      aria-hidden="true"
      strokeWidth={strokeWidth}
      className={cn("size-[18px] shrink-0", className)}
      {...props}
    />
  )
}
