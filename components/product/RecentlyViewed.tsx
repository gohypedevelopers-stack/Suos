"use client"

import { HoverSwapImage } from "@/components/HoverSwapImage"
import Link from "next/link"
import { useEffect, useSyncExternalStore } from "react"

import { ScrollRow } from "@/components/ScrollRow"

type ViewedProduct = {
  id: string
  slug: string
  title: string
  image: string
  /** Second photo, cross-faded in on hover (missing on older stored items). */
  hoverImage?: string
  price: string
  line: string
}

const STORAGE_KEY = "suos:recently-viewed"
const MAX_STORED = 12
const SHOWN = 6

function readRaw(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]"
  } catch {
    return "[]"
  }
}

function parse(raw: string): ViewedProduct[] {
  try {
    const value = JSON.parse(raw)
    return Array.isArray(value) ? value.filter((item) => item && typeof item.slug === "string") : []
  } catch {
    return []
  }
}

// Same-tab writes don't fire "storage", so notify subscribers ourselves.
const listeners = new Set<() => void>()
function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

/**
 * Records the current product and shows the shopper's other recently viewed
 * products (stored only in their browser). Hidden until there's something to show.
 */
export function RecentlyViewed({ current }: { current: ViewedProduct }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]")
  const others = parse(raw).filter((item) => item.id !== current.id).slice(0, SHOWN)

  useEffect(() => {
    try {
      const next = [current, ...parse(readRaw()).filter((item) => item.id !== current.id)].slice(0, MAX_STORED)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      listeners.forEach((listener) => listener())
    } catch {
      // Storage can be blocked (private mode); the row simply doesn't show.
    }
    // Record once per product.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id])

  if (others.length === 0) return null

  return (
    // Same row, card widths, gaps, photo shape and type as "You May Also Like"
    // (components/home/RecommendedSection.tsx) so the two rows line up.
    <section className="w-full bg-white py-10 text-black md:py-16">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <h2 className="type-title">Recently Viewed</h2>
      </div>
      <ScrollRow
        className="mt-6 items-start gap-0.5 overscroll-x-contain px-3 sm:mt-8 sm:gap-1 sm:px-6 lg:px-8"
        label="Recently viewed"
      >
        {others.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.slug}`}
            className="group block w-[46vw] shrink-0 snap-start pb-2 sm:w-[34vw] sm:pb-2.5 md:w-[26vw] lg:w-[calc((100%-5*0.25rem)/6)]"
          >
            <div data-row-media className="relative aspect-[2/3] overflow-hidden bg-[#d6d1cb] sm:aspect-[234/342]">
              {item.image ? (
                <HoverSwapImage
                  src={item.image}
                  hoverSrc={item.hoverImage}
                  alt={item.title}
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 34vw, 17vw"
                />
              ) : null}
            </div>
            <div className="mt-2.5 flex flex-col gap-1.5 px-1.5 sm:px-2.5 md:mt-3">
              {item.line ? (
                <p className="truncate text-[11px] uppercase leading-none tracking-normal text-ink-400 md:text-[12px]">{item.line}</p>
              ) : null}
              <p className="truncate py-px text-[12px] font-normal uppercase leading-none tracking-normal text-ink-800 md:text-[13px]">
                {item.title}
              </p>
              <p className="text-[12px] leading-none tracking-normal text-black md:text-[14px]">{item.price}</p>
            </div>
          </Link>
        ))}
      </ScrollRow>
    </section>
  )
}
