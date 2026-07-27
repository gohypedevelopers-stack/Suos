"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

const sortOptions = [
  "BESTSELLER",
  "NEWEST",
  "PRICE: LOW TO HIGH",
  "PRICE: HIGH TO LOW",
] as const

export function CollectionSortDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSort, setSelectedSort] =
    useState<(typeof sortOptions)[number]>("BESTSELLER")
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-1.5 text-[13px] font-normal uppercase tracking-[0.08em] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <span className="font-normal">SORT BY:</span>
        <span className="font-[500] text-black">{selectedSort}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 stroke-[1.9] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Sort collection"
          className="absolute left-0 top-[calc(100%+10px)] z-40 min-w-[220px] border border-black bg-white p-2 text-[13px] text-black shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
        >
          {sortOptions.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={selectedSort === option}
              onClick={() => {
                setSelectedSort(option)
                setIsOpen(false)
              }}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-left uppercase tracking-[0.06em] transition-colors hover:bg-black hover:text-white ${selectedSort === option ? "font-semibold" : "font-normal"}`}
            >
              <span>{option}</span>
              {selectedSort === option ? (
                <Check aria-hidden="true" className="size-4 shrink-0 stroke-[2]" />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
