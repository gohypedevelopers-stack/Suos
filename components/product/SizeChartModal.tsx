"use client"

import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, Check } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const fitOptions = [
  { id: "regular", label: "REGULAR FIT DENIM" },
  { id: "straight", label: "STRAIGHT FIT DENIM" },
  { id: "bootcut", label: "BOOTCUT FIT DENIM" },
] as const

const sizeChartData = {
  regular: {
    title: "REGULAR FIT DENIM",
    inches: [
      { size: "28", waist: "28", hip: "37", inseam: "31.25", length: "41.5" },
      { size: "30", waist: "30", hip: "39", inseam: "31", length: "41.5" },
      { size: "32", waist: "32", hip: "41", inseam: "30.75", length: "41.5" },
      { size: "34", waist: "34", hip: "43", inseam: "30.5", length: "41.5" },
      { size: "36", waist: "36", hip: "45", inseam: "30.25", length: "41.5" },
      { size: "38", waist: "38", hip: "47", inseam: "30", length: "41.5" },
    ],
    cm: [
      { size: "28", waist: "71.1", hip: "94", inseam: "79.4", length: "105.4" },
      { size: "30", waist: "76.2", hip: "99.1", inseam: "78.7", length: "105.4" },
      { size: "32", waist: "81.3", hip: "104.1", inseam: "78.1", length: "105.4" },
      { size: "34", waist: "86.4", hip: "109.2", inseam: "77.5", length: "105.4" },
      { size: "36", waist: "91.4", hip: "114.3", inseam: "76.8", length: "105.4" },
      { size: "38", waist: "96.5", hip: "119.4", inseam: "76.2", length: "105.4" },
    ],
  },
  bootcut: {
    title: "BOOTCUT FIT DENIM",
    inches: [
      { size: "28", waist: "29", hip: "37", inseam: "31.25", length: "41" },
      { size: "30", waist: "31", hip: "39", inseam: "31", length: "41" },
      { size: "32", waist: "33", hip: "41", inseam: "30.75", length: "41" },
      { size: "34", waist: "35", hip: "43", inseam: "30.5", length: "41" },
      { size: "36", waist: "37", hip: "45", inseam: "30.25", length: "41.5" },
      { size: "38", waist: "39", hip: "47", inseam: "30", length: "41" },
    ],
    cm: [
      { size: "28", waist: "73.7", hip: "94", inseam: "79.4", length: "104.1" },
      { size: "30", waist: "78.7", hip: "99.1", inseam: "78.7", length: "104.1" },
      { size: "32", waist: "83.8", hip: "104.1", inseam: "78.1", length: "104.1" },
      { size: "34", waist: "88.9", hip: "109.2", inseam: "77.5", length: "104.1" },
      { size: "36", waist: "94", hip: "114.3", inseam: "76.8", length: "104.1" },
      { size: "38", waist: "99.1", hip: "119.4", inseam: "76.2", length: "104.1" },
    ],
  },
  straight: {
    title: "STRAIGHT FIT DENIM",
    inches: [
      { size: "28", waist: "29", hip: "39", inseam: "32.5", length: "42.5" },
      { size: "30", waist: "31", hip: "41", inseam: "32.25", length: "42.5" },
      { size: "32", waist: "33", hip: "43", inseam: "32", length: "42.5" },
      { size: "34", waist: "35", hip: "45", inseam: "31.75", length: "42.5" },
      { size: "36", waist: "37", hip: "47", inseam: "31.5", length: "42.5" },
      { size: "38", waist: "39", hip: "49", inseam: "31.25", length: "42.5" },
    ],
    cm: [
      { size: "28", waist: "73.7", hip: "99.1", inseam: "82.5", length: "108" },
      { size: "30", waist: "78.7", hip: "104.1", inseam: "81.9", length: "108" },
      { size: "32", waist: "83.8", hip: "109.2", inseam: "81.3", length: "108" },
      { size: "34", waist: "88.9", hip: "114.3", inseam: "80.6", length: "108" },
      { size: "36", waist: "94", hip: "119.4", inseam: "80", length: "108" },
      { size: "38", waist: "99.1", hip: "124.5", inseam: "79.4", length: "108" },
    ],
  },
}

export function SizeChartModal({
  images,
  fitType,
  children,
}: {
  images?: string[]
  fitType?: "regular" | "bootcut" | "straight"
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [unit, setUnit] = useState<"inches" | "cm">("inches")
  const [selectedFit, setSelectedFit] = useState<"regular" | "bootcut" | "straight">(
    fitType || "regular"
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (fitType) {
      setSelectedFit(fitType)
    }
  }, [fitType])

  useEffect(() => {
    if (!dropdownOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDropdownOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [dropdownOpen])

  const chartData = sizeChartData[selectedFit] || (fitType ? sizeChartData[fitType] : sizeChartData.regular)

  if (!fitType && (!images || images.length === 0)) {
    return <>{children}</>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90dvh] w-[96vw] max-w-3xl flex-col overflow-hidden p-0 rounded-none sm:w-[90vw]">
        <DialogTitle className="sr-only">Product Size Guide</DialogTitle>
        <div className="flex-1 overflow-y-auto bg-white">
          {chartData ? (
            <div className="p-3.5 sm:p-8">
              <div className="mb-5 sm:mb-6 flex justify-center">
                <div ref={dropdownRef} className="relative inline-block max-w-full">
                  <button
                    type="button"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="listbox"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center justify-between gap-2.5 sm:gap-4 bg-[#fcf5d5] hover:bg-[#f6eeb8] transition-colors pl-4 sm:pl-7 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest border border-black cursor-pointer text-center"
                  >
                    <span>{sizeChartData[selectedFit].title}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 stroke-[2] ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      role="listbox"
                      aria-label="Denim fit options"
                      className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+4px)] z-50 w-full min-w-[210px] sm:min-w-[240px] border border-black bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
                    >
                      {fitOptions.map((option) => {
                        const isSelected = selectedFit === option.id
                        return (
                          <button
                            key={option.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSelectedFit(option.id)
                              setDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-left flex items-center justify-between border-b border-black/10 last:border-b-0 transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-black text-white"
                                : "text-black bg-white hover:bg-[#fcf5d5]"
                            }`}
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUnit("inches")}
                    className={`border border-black px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium uppercase transition-colors cursor-pointer ${
                      unit === "inches" ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    Inches
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("cm")}
                    className={`border border-black px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium uppercase transition-colors cursor-pointer ${
                      unit === "cm" ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    CM
                  </button>
                </div>

                <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">
                  Values in {unit === "inches" ? "Inches" : "Centimeters"}
                </span>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-center text-[11px] sm:text-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="border border-black p-1.5 sm:p-3 font-bold whitespace-nowrap">
                        <span className="sm:hidden">Size</span>
                        <span className="hidden sm:inline">SUOS Size</span>
                      </th>
                      <th className="border border-black p-1.5 sm:p-3 font-bold whitespace-nowrap">
                        <span className="sm:hidden">Waist</span>
                        <span className="hidden sm:inline">Garment Waist</span>
                      </th>
                      <th className="border border-black p-1.5 sm:p-3 font-bold whitespace-nowrap">
                        <span className="sm:hidden">Hip</span>
                        <span className="hidden sm:inline">Garment Hip</span>
                      </th>
                      <th className="border border-black p-1.5 sm:p-3 font-bold whitespace-nowrap">
                        Inseam
                      </th>
                      <th className="border border-black p-1.5 sm:p-3 font-bold whitespace-nowrap">
                        <span className="sm:hidden">Length</span>
                        <span className="hidden sm:inline">Full Length</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData[unit].map((row) => (
                      <tr key={row.size} className="even:bg-black/5">
                        <td className="border border-black p-1.5 sm:p-2.5 font-bold">{row.size}</td>
                        <td className="border border-black p-1.5 sm:p-2.5">{row.waist}</td>
                        <td className="border border-black p-1.5 sm:p-2.5">{row.hip}</td>
                        <td className="border border-black p-1.5 sm:p-2.5">{row.inseam}</td>
                        <td className="border border-black p-1.5 sm:p-2.5">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 sm:mt-6 border border-black p-3 sm:p-4 text-[11px] sm:text-xs leading-relaxed text-black/80">
                These are garment measurements, not body measurements. For the best fit,
                compare them with a similar pair of jeans you already own. Measurements may vary
                by up to 0.5 inch (1.3 cm) due to the manufacturing process.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {images?.map((img, i) => (
                <div key={i} className="relative w-full overflow-hidden" style={{ minHeight: "300px" }}>
                  <Image
                    src={img}
                    alt={`Size guide page ${i + 1}`}
                    width={1200}
                    height={1600}
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 1024px) 95vw, 1200px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-black/10 bg-white p-3 sm:p-4 sm:px-6">
          <Button asChild className="w-full rounded-none uppercase text-xs sm:text-sm h-11" size="lg">
            <Link href="/size-guide" onClick={() => setOpen(false)}>
              View Full Size Guide Page
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
