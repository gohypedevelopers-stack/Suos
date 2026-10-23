"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useSyncExternalStore } from "react"

import { ScrollRow } from "@/components/ScrollRow"

type ViewedProduct = {
  id: string
  slug: string
  title: string
  image: string
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
    <section className="w-full bg-white px-3 py-10 text-black sm:px-6 lg:px-8">
      <h2 className="text-h4 font-normal uppercase">Recently Viewed</h2>
      <ScrollRow className="mt-5 gap-2 pb-1" label="Recently viewed">
        {others.map((item) => (
          <Link key={item.id} href={`/products/${item.slug}`} className="group block w-[160px] shrink-0 snap-start sm:w-[200px]">
            <div data-row-media className="relative aspect-[3/4] overflow-hidden bg-[#efefef]">
              {item.image ? (
                <Image src={item.image} alt={item.title} fill sizes="200px" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              ) : null}
            </div>
            {item.line ? <p className="mt-2.5 truncate text-[12px] uppercase leading-none text-ink-400">{item.line}</p> : null}
            <p className="mt-1.5 truncate text-[13px] uppercase leading-none text-ink-800">{item.title}</p>
            <p className="mt-1.5 text-caption font-medium text-ink-900">{item.price}</p>
          </Link>
        ))}
      </ScrollRow>
    </section>
  )
}
