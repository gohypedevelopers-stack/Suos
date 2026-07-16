import type { Metadata } from "next"
import {
  Download,
  LayoutGrid,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
  UserRound,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Customers | SUOS Admin",
  description: "Review customer profiles, orders, and spending in SUOS.",
}

const customers = [
  {
    name: "MOHD KAIF",
    emailSubscription: "Not subscribed",
    location: "New Delhi DL, India",
    orders: 0,
    amountSpent: "₹0.00",
  },
  {
    name: "HARDEEP HARNAL",
    emailSubscription: "Subscribed",
    location: "MOHALI PB, India",
    orders: 1,
    amountSpent: "₹8,258.82",
  },
]

export default function CustomersPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <UserRound className="size-4" />
                Customers
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
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"
                >
                  <Plus className="size-3.5" />
                  Add customer
                </button>
              </div>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-black/10 px-4 py-3">
                <div className="flex min-w-52 flex-1 items-center gap-2 text-sm text-black/50">
                  <Search className="size-4" />
                  <input
                    aria-label="Search customers"
                    placeholder="Search customers"
                    className="w-full bg-transparent outline-none placeholder:text-black/45"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Adjust customer filters"
                  className="rounded-md p-1.5 text-black/55 hover:bg-black/5"
                >
                  <SlidersHorizontal className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="View options"
                  className="rounded-md p-1.5 text-black/55 hover:bg-black/5"
                >
                  <LayoutGrid className="size-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left text-xs">
                  <thead className="bg-black/[0.025] text-black/65">
                    <tr>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        <input type="checkbox" aria-label="Select all customers" />
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Customer name
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Email subscription
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Location
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 text-right font-medium">
                        Orders
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 text-right font-medium">
                        Amount spent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.name} className="hover:bg-black/[0.02]">
                        <td className="border-b border-black/10 px-3 py-2">
                          <input
                            type="checkbox"
                            aria-label={`Select ${customer.name}`}
                          />
                        </td>
                        <td className="border-b border-black/10 px-3 py-2">
                          <span className="font-medium">{customer.name}</span>
                        </td>
                        <td className="border-b border-black/10 px-3 py-2">
                          <span
                            className={`rounded-full px-2 py-1 ${
                              customer.emailSubscription === "Not subscribed"
                                ? "bg-black/5 text-black/70"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {customer.emailSubscription}
                          </span>
                        </td>
                        <td className="border-b border-black/10 px-3 py-2">
                          {customer.location}
                        </td>
                        <td className="border-b border-black/10 px-3 py-2 text-right">
                          {customer.orders}
                        </td>
                        <td className="border-b border-black/10 px-3 py-2 text-right">
                          {customer.amountSpent}
                        </td>
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
