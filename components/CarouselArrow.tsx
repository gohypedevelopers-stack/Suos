import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

/**
 * The one previous/next arrow used across the storefront (product rows,
 * product-card photos…): a bare white chevron with a soft shadow so it reads
 * on light photos too. Position it with `className`
 * (e.g. "absolute left-2 top-1/2 -translate-y-1/2").
 */
export function CarouselArrow({
  direction,
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { direction: "prev" | "next"; size?: "sm" | "md" }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      className={cn(
        "z-20 flex cursor-pointer items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] transition-[opacity,scale] duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        size === "sm" ? "size-8" : "size-10",
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className={size === "sm" ? "size-5" : "size-6"} strokeWidth={1.75} />
    </button>
  )
}
