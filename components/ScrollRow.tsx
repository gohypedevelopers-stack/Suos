"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { CarouselArrow } from "@/components/CarouselArrow"
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
  // Centre of the item photos (marked data-row-media), so arrows sit mid-photo.
  const [arrowTop, setArrowTop] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      setCanLeft(el.scrollLeft > 4)
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
      const media = el.querySelector<HTMLElement>("[data-row-media]")
      if (media) {
        const top = media.getBoundingClientRect().top - el.getBoundingClientRect().top
        setArrowTop(top + media.offsetHeight / 2)
      }
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

  const arrowClass = "absolute hidden -translate-y-1/2 md:flex"
  const arrowStyle = { top: arrowTop ?? "50%" }

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
        <CarouselArrow direction="prev" aria-label="Scroll left" onClick={() => step(-1)} className={cn(arrowClass, "left-2")} style={arrowStyle} />
      ) : null}
      {canRight ? (
        <CarouselArrow direction="next" aria-label="Scroll right" onClick={() => step(1)} className={cn(arrowClass, "right-2")} style={arrowStyle} />
      ) : null}
    </div>
  )
}
