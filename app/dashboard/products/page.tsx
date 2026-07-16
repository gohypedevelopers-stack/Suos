import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Tag,
  Upload,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Products | SUOS Admin",
  description: "Manage SUOS products, collections, and inventory.",
}

const products = [
  ["S37", "product1.png", "80 in stock for 8 variants", "Sandals"],
  ["S36", "product2.png", "80 in stock for 8 variants", "Sandals"],
  ["S35", "product3.png", "80 in stock for 8 variants", "Sandals"],
  ["S34", "product4.png", "80 in stock for 8 variants", "Sandals"],
  ["S33", "product5.png", "80 in stock for 8 variants", "Uncategorized"],
  ["S32", "product6.png", "80 in stock for 8 variants", "Sandals"],
  ["S31", "product7.png", "70 in stock for 8 variants", "Sandals"],
  ["S30", "product8.png", "80 in stock for 8 variants", "Sandals"],
  ["S29", "product9.png", "70 in stock for 7 variants", "Sandals"],
  ["L11", "product10.png", "60 in stock for 6 variants", "Uncategorized"],
  ["L10", "product11.png", "59 in stock for 6 variants", "Flats"],
  ["L9", "product12.png", "60 in stock for 6 variants", "Flats"],
]

export default function ProductsPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold"><Tag className="size-4" /> Products</h1>
              <div className="flex items-center gap-2">
                <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10"><Download className="size-3.5" /> Export</button>
                <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10"><Upload className="size-3.5" /> Import</button>
                <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10">More actions <ChevronDown className="size-3.5" /></button>
                <Link href="/dashboard/products/new" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"><Plus className="size-3.5" /> Add product</Link>
              </div>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="grid grid-cols-2 divide-x divide-y divide-black/10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0">
                <div className="flex items-center gap-2 px-4 py-4 text-xs font-medium"><CalendarDays className="size-4" /> 30 days</div>
                <div className="px-4 py-3"><p className="text-xs font-medium text-black/65 underline decoration-dotted underline-offset-4">Average sell-through rate</p><p className="mt-1 text-sm font-semibold">0.01% <span className="font-normal text-black/45">—</span></p><div className="mt-2 h-0.5 w-11 bg-[#55c5f7]" /></div>
                <div className="px-4 py-3"><p className="text-xs font-medium text-black/65 underline decoration-dotted underline-offset-4">Products by days of inventory remaining</p><p className="mt-1 text-sm text-black/55">No data</p></div>
                <div className="px-4 py-3"><p className="text-xs font-medium text-black/65 underline decoration-dotted underline-offset-4">ABC product analysis</p><p className="mt-1 text-sm font-semibold">₹0.00 <span className="font-normal text-black/55">C</span></p><div className="mt-2 h-0.5 w-11 bg-[#55c5f7]" /></div>
              </div>
            </section>

            <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-black/10 px-4 py-3">
                <button type="button" className="inline-flex items-center gap-1 text-xs font-medium">All <ChevronDown className="size-3.5" /></button>
                <div className="flex min-w-52 flex-1 items-center gap-2 text-sm text-black/50"><Search className="size-4" /><input aria-label="Search and filter products" placeholder="Search and filter" className="w-full bg-transparent outline-none placeholder:text-black/45" /></div>
                <button type="button" aria-label="Filter products" className="rounded-md p-1.5 text-black/55 hover:bg-black/5"><SlidersHorizontal className="size-4" /></button>
                <button type="button" aria-label="More product options" className="rounded-md p-1.5 text-black/55 hover:bg-black/5"><MoreHorizontal className="size-4" /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
                  <thead className="bg-black/[0.025] text-black/65"><tr>{["", "Product", "Status", "Inventory", "Category", "Channels", "Product type", "Vendor"].map((heading, index) => <th key={`${heading}-${index}`} className="border-b border-black/10 px-3 py-2.5 font-medium">{index === 0 ? <input type="checkbox" aria-label="Select all products" /> : heading}</th>)}</tr></thead>
                  <tbody>{products.map(([name, image, inventory, category]) => <tr key={name} className="hover:bg-black/[0.02]"><td className="border-b border-black/10 px-3 py-2"><input type="checkbox" aria-label={`Select ${name}`} /></td><td className="border-b border-black/10 px-3 py-2"><div className="flex items-center gap-3 font-medium"><Image src={`/images/products/${image}`} alt="" width={40} height={40} className="size-10 rounded-md border border-black/10 object-cover" />{name}</div></td><td className="border-b border-black/10 px-3 py-2"><span className="rounded-full bg-emerald-200 px-2 py-1 text-emerald-900">Active</span></td><td className="border-b border-black/10 px-3 py-2">{inventory}</td><td className="border-b border-black/10 px-3 py-2">{category}</td><td className="border-b border-black/10 px-3 py-2">4</td><td className="border-b border-black/10 px-3 py-2">—</td><td className="border-b border-black/10 px-3 py-2">EVRYDAE</td></tr>)}</tbody>
                </table>
              </div>
              <div className="flex items-center gap-1 border-t border-black/10 px-3 py-2 text-xs text-black/60"><button type="button" aria-label="Previous page" className="rounded-md bg-black/5 p-1 hover:bg-black/10"><ChevronLeft className="size-4" /></button><button type="button" aria-label="Next page" className="rounded-md bg-black/5 p-1 hover:bg-black/10"><ChevronRight className="size-4" /></button><span className="ml-1">1–50</span></div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
