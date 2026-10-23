"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Horizontal product row that works with a mouse as well as touch: arrow
 * buttons (shown only when there's more to see) and click-and-drag. Touch
 * devices keep native swipe. The scrollbar stays hidden, as in the design.
 */
export function ScrollRow({
  children,
  className,
  label,
}: {
  children: ReactNode
  /** Classes for the scrolling flex container (gap, padding…). */
  className?: string
  label?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      setCanLeft(el.scrollLeft > 4)
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    // ResizeObserver fires once on observe, which sets the initial state.
    const observer = new ResizeObserver(update)
    observer.observe(el)
    el.addEventListener("scroll", update, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", update)
    }
  }, [])

  const step = (direction: 1 | -1) => {
    const el = ref.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" })
  }

  const arrow = "absolute top-1/3 z-10 hidden size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black shadow-md ring-1 ring-black/10 transition hover:bg-white md:flex"

  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false }
        }}
        onPointerMove={(e) => {
          const d = drag.current
          const el = ref.current
          if (!d || !el) return
          const dx = e.clientX - d.x
          if (!d.moved && Math.abs(dx) < 5) return
          if (!d.moved) {
            d.moved = true
            el.style.scrollSnapType = "none"
            el.setPointerCapture(e.pointerId)
          }
          el.scrollLeft = d.left - dx
        }}
        onPointerUp={() => {
          const el = ref.current
          if (el) el.style.scrollSnapType = ""
          // Let the click that ends a drag through only if it wasn't a drag.
          setTimeout(() => (drag.current = null), 0)
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>
      {canLeft ? (
        <button type="button" aria-label="Scroll left" onClick={() => step(-1)} className={cn(arrow, "left-2")}>
          <ChevronLeft className="size-5" strokeWidth={1.6} />
        </button>
      ) : null}
      {canRight ? (
        <button type="button" aria-label="Scroll right" onClick={() => step(1)} className={cn(arrow, "right-2")}>
          <ChevronRight className="size-5" strokeWidth={1.6} />
        </button>
      ) : null}
    </div>
  )
}
