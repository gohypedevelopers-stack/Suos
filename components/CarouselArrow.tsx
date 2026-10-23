import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

/**
 * The one previous/next arrow used across the storefront (product rows,
 * product-card photos…): small white circle, thin chevron. Position it with
 * `className` (e.g. "absolute left-2 top-1/2 -translate-y-1/2").
 */
export function CarouselArrow({
  direction,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { direction: "prev" | "next" }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      className={cn(
        "z-20 flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow-sm ring-1 ring-black/10 transition-[background-color,opacity] duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
    </button>
  )
}
