"use client"

import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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
      { size: "36", waist: "37", hip: "45", inseam: "30.25", length: "41" },
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
  }
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

  const chartData = fitType ? sizeChartData[fitType] : null

  if (!chartData && (!images || images.length === 0)) {
    return <>{children}</>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90dvh] w-[90vw] max-w-4xl flex-col overflow-hidden p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">Product Size Guide</DialogTitle>
        <div className="flex-1 overflow-y-auto bg-white">
          {chartData ? (
            <div className="p-6 sm:p-10">
              <div className="mb-8 text-center">
                <h3 className="inline-block bg-[#fcf5d5] px-10 py-2 text-lg font-bold uppercase tracking-widest border border-black">{chartData.title}</h3>
              </div>
              
              <div className="mb-6 flex justify-start gap-4">
                <button
                  type="button"
                  onClick={() => setUnit("inches")}
                  className={`border border-black px-6 py-2 text-sm font-medium uppercase transition-colors ${
                    unit === "inches" ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"
                  }`}
                >
                  Inches
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={`border border-black px-6 py-2 text-sm font-medium uppercase transition-colors ${
                    unit === "cm" ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"
                  }`}
                >
                  CM
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse text-center text-sm">
                  <thead>
                    <tr className="bg-white">
                      <th className="border border-black p-3 font-bold">SUOS Size</th>
                      <th className="border border-black p-3 font-bold">
                        Garment Waist {unit === "cm" && "(cm)"}
                      </th>
                      <th className="border border-black p-3 font-bold">
                        Garment Hip {unit === "cm" && "(cm)"}
                      </th>
                      <th className="border border-black p-3 font-bold">
                        Inseam {unit === "cm" && "(cm)"}
                      </th>
                      <th className="border border-black p-3 font-bold">
                        Full Length {unit === "cm" && "(cm)"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData[unit].map((row) => (
                      <tr key={row.size} className="even:bg-black/5">
                        <td className="border border-black p-3">{row.size}</td>
                        <td className="border border-black p-3">{row.waist}</td>
                        <td className="border border-black p-3">{row.hip}</td>
                        <td className="border border-black p-3">{row.inseam}</td>
                        <td className="border border-black p-3">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 border border-black p-4 text-sm leading-relaxed text-black/80">
                These are garment measurements, not body measurements. For the best fit,
                compare them with a similar pair of jeans you already own. Measurements may vary
                by up to 0.5 inch due to the manufacturing process.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {images?.map((img, i) => (
                <div key={i} className="relative w-full overflow-hidden" style={{ minHeight: "500px" }}>
                  <Image
                    src={img}
                    alt={`Size guide page ${i + 1}`}
                    width={1200}
                    height={1600}
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 1024px) 90vw, 1200px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-black/10 bg-white p-4 sm:px-6">
          <Button asChild className="w-full rounded-none uppercase" size="lg">
            <Link href="/size-guide" onClick={() => setOpen(false)}>
              View Full Size Guide Page
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
