"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"

import { sortOptions, type SortValue } from "@/components/collection/productSort"

export function CollectionSortDropdown({ value = "featured" }: { value?: SortValue }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState<SortValue>(value)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [prevValue, setPrevValue] = useState(value)
  if (prevValue !== value) {
    setPrevValue(value)
    setSelectedSort(value)
  }

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  function selectSort(next: SortValue) {
    setSelectedSort(next)
    setIsOpen(false)

    const params = new URLSearchParams(window.location.search)
    if (next === "featured") params.delete("sort")
    else params.set("sort", next)
    const query = params.toString()

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })
  }

  const selectedLabel =
    sortOptions.find((option) => option.value === selectedSort)?.label ?? "FEATURED"

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex items-center gap-1.5 text-[13px] font-normal uppercase leading-[1.4] tracking-[0.04em] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:text-[14px] ${isPending ? "opacity-60" : ""}`}
      >
        <span>SORT BY:</span>
        <span className="text-black">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 stroke-[1.5] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Sort products"
          className="absolute left-0 top-[calc(100%+10px)] z-50 min-w-[220px] border border-black bg-white p-1.5 text-[13px] text-black shadow-[0_12px_28px_rgba(0,0,0,0.12)] sm:text-[14px]"
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={selectedSort === option.value}
              onClick={() => selectSort(option.value)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left font-normal uppercase leading-[1.4] tracking-[0.04em] transition-colors hover:bg-black hover:text-white"
            >
              <span>{option.label}</span>
              {selectedSort === option.value ? (
                <Check aria-hidden="true" className="size-4 shrink-0 stroke-[1.75]" />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
