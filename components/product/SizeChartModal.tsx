"use client"

import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { useState } from "react"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { JeansDiagram } from "@/components/size-guide/JeansDiagram"
import { SizeChartTable } from "@/components/size-guide/SizeChartTable"
import { FIT_OPTIONS, type FitType } from "@/components/size-guide/sizeChartData"

/**
 * Product-page size chart (Figma "Size Guide" modal): product photo on the
 * left; unit toggle, the product's fit table, note and diagram on the right.
 */
export function SizeChartModal({
  fitType = "regular",
  image,
  children,
}: {
  fitType?: FitType
  image?: { src: string; alt: string }
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const fitLabel = FIT_OPTIONS.find((option) => option.id === fitType)?.label ?? ""

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[96vw] max-w-[880px] gap-0 overflow-hidden rounded-none p-0 sm:max-w-[880px]">
        <DialogTitle className="sr-only">{fitLabel} fit size chart</DialogTitle>
        <div className="grid max-h-[90dvh] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {image?.src ? (
            <div className="relative hidden bg-[#f3f3f3] md:block">
              <Image src={image.src} alt={image.alt} fill sizes="360px" className="object-cover object-center" />
            </div>
          ) : null}

          <div className={image?.src ? "overflow-y-auto p-5 pt-12 sm:p-7 sm:pt-12" : "overflow-y-auto p-5 pt-12 sm:p-7 sm:pt-12 md:col-span-2"}>
            <SizeChartTable fit={fitType} compact />
            <JeansDiagram compact className="mx-auto mt-6 max-w-[260px]" />
            <Link
              href="/size-guide"
              onClick={() => setOpen(false)}
              className="mt-4 inline-block text-[11px] uppercase text-black/60 underline underline-offset-4 transition-colors hover:text-black"
            >
              View full size guide
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
