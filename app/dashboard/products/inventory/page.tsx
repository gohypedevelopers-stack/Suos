import type { Metadata } from "next"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Columns3,
  Download,
  Search,
  Upload,
  Warehouse,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Inventory | SUOS Admin",
  description: "Manage inventory levels for SUOS products.",
}

const inventoryRows = [
  ["A1", "product1.png", "5"],
  ["A1", "product1.png", "6"],
  ["A1", "product1.png", "7"],
  ["A1", "product1.png", "8"],
  ["A1", "product1.png", "9"],
  ["A1", "product1.png", "10"],
  ["A1", "product1.png", "11"],
  ["A1", "product1.png", "12"],
  ["A2", "product2.png", "5"],
  ["A2", "product2.png", "6"],
  ["A2", "product2.png", "7"],
  ["A2", "product2.png", "8"],
  ["A2", "product2.png", "9"],
  ["A2", "product2.png", "10"],
] as const

const inventoryHeaders = [
  "Unavailable",
  "Committed",
  "Available",
  "On hand",
  "Incoming",
]

export default function InventoryPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <Warehouse className="size-4" />
                Inventory
              </h1>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10"
                >
                  <Download className="size-3.5" />
                  Export
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10"
                >
                  <Upload className="size-3.5" />
                  Import
                </button>
              </div>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium"
                >
                  All
                  <ChevronsUpDown className="size-3.5" />
                </button>

                <label className="flex min-w-52 flex-1 items-center gap-2 text-sm text-black/50">
                  <Search className="size-4" />
                  <input
                    aria-label="Search and filter inventory"
                    placeholder="Search and filter"
                    className="w-full bg-transparent outline-none placeholder:text-black/45"
                  />
                </label>

                <button
                  type="button"
                  aria-label="Choose inventory columns"
                  className="rounded-md border-l border-black/10 pl-3 text-black/55 hover:text-black"
                >
                  <Columns3 className="size-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
                  <thead className="bg-black/[0.025] text-black/65">
                    <tr>
                      <th className="w-12 border-b border-black/10 px-3 py-2.5 font-medium">
                        <input type="checkbox" aria-label="Select all inventory items" />
                      </th>
                      <th className="min-w-[380px] border-b border-black/10 px-3 py-2.5 font-medium">Product</th>
                      <th className="min-w-[240px] border-b border-black/10 px-3 py-2.5 font-medium">SKU</th>
                      {inventoryHeaders.map((heading) => (
                        <th key={heading} className="border-b border-black/10 px-3 py-2.5 text-center font-medium underline decoration-dotted underline-offset-4">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryRows.map(([product, image, variant]) => (
                      <tr key={`${product}-${variant}`} className="hover:bg-black/[0.02]">
                        <td className="border-b border-black/10 px-3 py-2.5">
                          <input type="checkbox" aria-label={`Select ${product} ${variant}`} />
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <Image
                              src={`/images/products/${image}`}
                              alt=""
                              width={40}
                              height={40}
                              className="size-10 rounded-lg border border-black/10 object-cover"
                            />
                            <div className="grid gap-0.5 text-black/80">
                              <span>{product}</span>
                              <span className="w-fit rounded-full bg-black/10 px-2 py-0.5 text-xs text-black/70">
                                {variant}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5 text-black/70">No SKU</td>
                        {inventoryHeaders.map((heading) => (
                          <td key={heading} className="border-b border-black/10 px-3 py-2.5 text-center">
                            0
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-1 border-t border-black/10 px-3 py-2 text-xs text-black/60">
                <button
                  type="button"
                  aria-label="Previous page"
                  className="rounded-md bg-black/5 p-1 hover:bg-black/10"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  className="rounded-md bg-black/5 p-1 hover:bg-black/10"
                >
                  <ChevronRight className="size-4" />
                </button>
                <span className="ml-1">1–50</span>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
