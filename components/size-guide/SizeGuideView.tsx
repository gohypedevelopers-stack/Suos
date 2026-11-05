"use client"

import { useState } from "react"

import { JeansDiagram } from "@/components/size-guide/JeansDiagram"
import { SizeChartTable } from "@/components/size-guide/SizeChartTable"
import { FIT_OPTIONS, type FitType } from "@/components/size-guide/sizeChartData"
import { cn } from "@/lib/utils"

/** Fit tabs, jeans diagram and size table for the /size-guide page. */
export function SizeGuideView({ initialFit = "bootcut" }: { initialFit?: FitType }) {
  const [fit, setFit] = useState<FitType>(initialFit)

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10" role="tablist" aria-label="Denim fit">
        {FIT_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={fit === option.id}
            onClick={() => setFit(option.id)}
            className={cn(
              "h-10 min-w-[104px] cursor-pointer border border-black px-5 text-[12px] font-medium uppercase transition-colors sm:text-[13px]",
              fit === option.id ? "bg-black text-white" : "bg-white text-black hover:bg-black/5",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-start gap-10 md:mt-12 md:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] lg:gap-16">
        <JeansDiagram className="mx-auto max-w-[300px] md:max-w-[340px]" />
        <div role="tabpanel" aria-label={`${FIT_OPTIONS.find((option) => option.id === fit)?.label} fit sizes`}>
          <SizeChartTable fit={fit} />
        </div>
      </div>
    </>
  )
}
