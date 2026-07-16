import type { Metadata } from "next"
import Link from "next/link"
import {
  CalendarDays,
  ChevronDown,
  Download,
  MoreHorizontal,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Orders | SUOS Admin",
  description: "Manage SUOS orders and fulfillment.",
}

const orders = [
  ["#1004", "Jun 16 at 4:55 pm", "HARDEEP HARNAL", "₹8,258.82", "Payment pending", "1 item"],
  ["#1003", "Jun 16 at 3:34 pm", "MOHD KAIF", "₹5,307.88", "Paid", "2 items"],
  ["#1002", "May 8 at 2:05 pm", "No customer", "₹35,396.46", "Paid", "3 items"],
  ["#1001", "May 8 at 2:02 pm", "No customer", "₹23,597.64", "Paid", "2 items"],
]

const summary = [
  ["Orders", "0"],
  ["Items ordered", "0"],
  ["Returns", "₹0"],
  ["Orders fulfilled", "0"],
  ["Orders delivered", "0"],
  ["Order to fulfillment time", "—"],
]

export default function OrdersPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold"><Package className="size-4" /> Orders</h1>
              <div className="flex items-center gap-2">
                <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/5 px-3 text-xs font-medium hover:bg-black/10"><Download className="size-3.5" /> Export</button>
                <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/5 px-3 text-xs font-medium hover:bg-black/10">More actions <ChevronDown className="size-3.5" /></button>
                <Link href="/dashboard/orders/create-order" className="inline-flex h-8 items-center rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80">
                  Create order
                </Link>
              </div>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="grid grid-cols-2 divide-x divide-y divide-black/10 sm:grid-cols-3 lg:grid-cols-7 lg:divide-y-0">
                <div className="flex items-center gap-2 px-4 py-4 text-xs font-medium"><CalendarDays className="size-4" /> Today</div>
                {summary.map(([label, value]) => (
                  <div key={label} className="px-4 py-3">
                    <p className="text-xs font-medium text-black/65 underline decoration-dotted underline-offset-4">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value} <span className="font-normal text-black/45">—</span></p>
                    <div className="mt-2 h-0.5 w-11 bg-[#55c5f7]" />
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-black/10 px-4 py-3">
                <button type="button" className="inline-flex items-center gap-1 text-xs font-medium">All <ChevronDown className="size-3.5" /></button>
                <div className="flex min-w-52 flex-1 items-center gap-2 text-sm text-black/50"><Search className="size-4" /><input aria-label="Search and filter orders" placeholder="Search and filter" className="w-full bg-transparent outline-none placeholder:text-black/45" /></div>
                <button type="button" aria-label="Filter orders" className="rounded-md p-1.5 text-black/55 hover:bg-black/5"><SlidersHorizontal className="size-4" /></button>
                <button type="button" aria-label="More order options" className="rounded-md p-1.5 text-black/55 hover:bg-black/5"><MoreHorizontal className="size-4" /></button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left text-xs">
                  <thead className="bg-black/[0.025] text-black/65">
                    <tr>{["", "Order", "Date", "Customer", "Channel", "Total", "Payment status", "Fulfillment status", "Items", "Delivery status", "Delivery method", "Tags"].map((heading, index) => <th key={`${heading}-${index}`} className="border-b border-black/10 px-3 py-2.5 font-medium">{index === 0 ? <input type="checkbox" aria-label="Select all orders" /> : heading}</th>)}</tr>
                  </thead>
                  <tbody>
                    {orders.map(([order, date, customer, total, payment, items]) => (
                      <tr key={order} className="hover:bg-black/[0.02]">
                        <td className="border-b border-black/10 px-3 py-2.5"><input type="checkbox" aria-label={`Select ${order}`} /></td>
                        <td className="border-b border-black/10 px-3 py-2.5 font-medium">{order}</td>
                        <td className="border-b border-black/10 px-3 py-2.5">{date}</td>
                        <td className="border-b border-black/10 px-3 py-2.5">{customer}</td>
                        <td className="border-b border-black/10 px-3 py-2.5">EVRYDAE</td>
                        <td className="border-b border-black/10 px-3 py-2.5 text-right">{total}</td>
                        <td className="border-b border-black/10 px-3 py-2.5"><span className={`rounded-md px-2 py-1 ${payment === "Paid" ? "bg-black/10" : "bg-amber-200"}`}>{payment}</span></td>
                        <td className="border-b border-black/10 px-3 py-2.5"><span className="rounded-md bg-yellow-200 px-2 py-1">Unfulfilled</span></td>
                        <td className="border-b border-black/10 px-3 py-2.5">{items}</td>
                        <td className="border-b border-black/10 px-3 py-2.5">—</td>
                        <td className="border-b border-black/10 px-3 py-2.5">Standard</td>
                        <td className="border-b border-black/10 px-3 py-2.5">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
