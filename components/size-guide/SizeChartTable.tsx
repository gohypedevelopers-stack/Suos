"use client"

import { useState } from "react"

import { SIZE_CHARTS, type FitType } from "@/components/size-guide/sizeChartData"
import { useSiteContent } from "@/lib/site-content-context"
import { cn } from "@/lib/utils"

const HEADERS = [
  { full: "SUOS Size", short: "Size" },
  { full: "Garment Waist", short: "Waist" },
  { full: "Garment Hip", short: "Hip" },
  { full: "Inseam", short: "Inseam" },
  { full: "Full Length", short: "Length" },
]

/** Inches / CM toggle, the measurement table for one fit, and the fit note (Figma "Size Guide"). */
export function SizeChartTable({ fit, compact = false }: { fit: FitType; compact?: boolean }) {
  const [unit, setUnit] = useState<"inches" | "cm">("inches")
  const { sizeGuide } = useSiteContent()
  const rows = SIZE_CHARTS[fit][unit]

  const cell = compact ? "px-1.5 py-1.5 sm:py-2" : "px-2 py-2.5 sm:py-3"

  return (
    <div className={cn("text-black", compact ? "text-[11px] sm:text-[12px]" : "text-[12px] sm:text-[14px]")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex" role="group" aria-label="Measurement unit">
          {(["inches", "cm"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setUnit(value)}
              aria-pressed={unit === value}
              className={cn(
                "cursor-pointer border border-black font-medium uppercase transition-colors",
                compact ? "h-7 min-w-[58px] px-3 text-[10px]" : "h-9 min-w-[72px] px-4 text-[12px]",
                value === "cm" && "-ml-px",
                unit === value ? "bg-black text-white" : "bg-white text-black hover:bg-black/5",
              )}
            >
              {value === "inches" ? "Inches" : "CM"}
            </button>
          ))}
        </div>
        <span className={cn("uppercase text-black/55", compact ? "text-[9px]" : "text-[11px]")}>
          Values in {unit === "inches" ? "inches" : "cm"}
        </span>
      </div>

      <div className={cn("w-full overflow-x-auto", compact ? "mt-3" : "mt-5")}>
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              {HEADERS.map((header) => (
                <th key={header.full} scope="col" className={cn("border border-black/30 font-medium", cell)}>
                  <span className="sm:hidden">{header.short}</span>
                  <span className="hidden sm:inline">{header.full}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.size}>
                <th scope="row" className={cn("border border-black/30 font-medium", cell)}>{row.size}</th>
                <td className={cn("border border-black/30", cell)}>{row.waist}</td>
                <td className={cn("border border-black/30", cell)}>{row.hip}</td>
                <td className={cn("border border-black/30", cell)}>{row.inseam}</td>
                <td className={cn("border border-black/30", cell)}>{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sizeGuide.note ? (
        <p
          className={cn(
            "border border-black/30 leading-relaxed text-black/75",
            compact ? "mt-3 p-2.5 text-[10px] sm:text-[11px]" : "mt-6 p-4 text-[12px] sm:text-[13px]",
          )}
        >
          {sizeGuide.note}
        </p>
      ) : null}
    </div>
  )
}
