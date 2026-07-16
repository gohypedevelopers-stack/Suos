import type { Metadata } from "next"
import {
  BadgePercent,
  Box,
  ChevronDown,
  Download,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  UserRound,
  Truck,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Discounts | SUOS Admin",
  description: "Manage discounts and automatic offers for SUOS.",
}

const discounts = [
  {
    title: "PACK3",
    subtitle: "20% off POLOS • Minimum quantity of 3",
    status: "Active",
    method: "Automatic",
    eligibility: "All customers",
    type: "Amount off product",
    used: 0,
  },
  {
    title: "PACK2",
    subtitle: "10% off 2 collections • Minimum quantity of 2",
    status: "Active",
    method: "Automatic",
    eligibility: "All customers",
    type: "Amount off product",
    used: 1,
  },
  {
    title: "SUMMER10",
    subtitle: "10% off SNEAKERS",
    status: "Active",
    method: "Code",
    eligibility: "All customers",
    type: "Amount off product",
    used: 0,
  },
]

export default function DiscountsPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <BadgePercent className="size-4" />
                Discounts
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
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"
                >
                  Create discount
                </button>
              </div>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-black/10 px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-black/80"
                >
                  All <ChevronDown className="size-3.5" />
                </button>
                <div className="flex min-w-52 flex-1 items-center gap-2 text-sm text-black/50">
                  <Search className="size-4" />
                  <input
                    aria-label="Search and filter discounts"
                    placeholder="Search and filter"
                    className="w-full bg-transparent outline-none placeholder:text-black/45"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Filter discounts"
                  className="rounded-md p-1.5 text-black/55 hover:bg-black/5"
                >
                  <SlidersHorizontal className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="More discount options"
                  className="rounded-md p-1.5 text-black/55 hover:bg-black/5"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
                  <thead className="bg-black/[0.025] text-black/65">
                    <tr>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        <input type="checkbox" aria-label="Select all discounts" />
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Title
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Status
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Method
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Eligibility
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Type
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Combinations
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 text-right font-medium">
                        Used
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {discounts.map((discount) => (
                      <tr key={discount.title} className="hover:bg-black/[0.02]">
                        <td className="border-b border-black/10 px-3 py-3">
                          <input
                            type="checkbox"
                            aria-label={`Select ${discount.title}`}
                          />
                        </td>
                        <td className="border-b border-black/10 px-3 py-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold">{discount.title}</p>
                            <p className="text-xs text-black/80">{discount.subtitle}</p>
                          </div>
                        </td>
                        <td className="border-b border-black/10 px-3 py-3">
                          <span className="rounded-full bg-emerald-200 px-2 py-1 text-emerald-900">
                            {discount.status}
                          </span>
                        </td>
                        <td className="border-b border-black/10 px-3 py-3">
                          {discount.method}
                        </td>
                        <td className="border-b border-black/10 px-3 py-3">
                          <span className="inline-flex items-center gap-2">
                            <UserRound className="size-3.5 text-black/70" />
                            {discount.eligibility}
                          </span>
                        </td>
                        <td className="border-b border-black/10 px-3 py-3">
                          <span className="inline-flex items-center gap-2">
                            <BadgePercent className="size-3.5 text-black/70" />
                            {discount.type}
                          </span>
                        </td>
                        <td className="border-b border-black/10 px-3 py-3">
                          <span className="inline-flex items-center gap-2 text-black/30">
                            <BadgePercent className="size-3.5" />
                            <Box className="size-3.5" />
                            <Truck className="size-3.5" />
                          </span>
                        </td>
                        <td className="border-b border-black/10 px-3 py-3 text-right">
                          {discount.used}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="mt-6 text-center text-sm text-black/65">
              Learn more about discounts
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
