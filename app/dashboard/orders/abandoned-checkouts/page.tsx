import type { Metadata } from "next"
import Link from "next/link"
import {
  ChevronDown,
  Download,
  LayoutGrid,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Abandoned checkouts | SUOS Admin",
  description: "Review abandoned checkouts and recovery status.",
}

const abandonedCheckouts = [
  ["#69953071382894", "Jun 16 at 5:22 pm", "MOHD KAIF", "India", "Not recovered", "₹4,498.20"],
  ["#69953053688174", "Jun 16 at 5:19 pm", "MOHD KAIF", "India", "Not recovered", "₹4,498.20"],
  ["#69953048936814", "Jun 16 at 5:14 pm", "MOHD KAIF", "India", "Not recovered", "₹2,948.82"],
  ["#69952995033454", "Jun 16 at 4:54 pm", "MOHD KAIF", "India", "Not recovered", "₹5,307.88"],
  ["#69952989233518", "Jun 16 at 4:52 pm", "MOHD KAIF", "India", "Not recovered", "₹5,307.88"],
  ["#69952886800750", "Jun 16 at 4:10 pm", "MOHD KAIF", "India", "Not recovered", "₹5,307.88"],
  ["#69952827851118", "Jun 16 at 3:45 pm", "MOHD KAIF", "India", "Not recovered", "₹5,307.88"],
  ["#69952828244334", "Jun 16 at 3:45 pm", "MOHD KAIF", "India", "Not recovered", "₹5,307.88"],
  ["#69952819528046", "Jun 16 at 3:43 pm", "MOHD KAIF", "India", "Not recovered", "₹5,307.88"],
  ["#69952775618926", "Jun 16 at 3:23 pm", "MOHD KAIF", "India", "Not recovered", "₹5,307.88"],
  ["#69919518884206", "Jun 9 at 2:40 pm", "HARDEEP HARNAL", "India", "Not recovered", "₹2,358.82"],
  ["#69840284287342", "May 23 at 1:17 pm", "", "India", "Not recovered", "₹11,798.82"],
  ["#69783152001390", "May 8 at 2:06 pm", "", "India", "Not recovered", "₹23,597.64"],
  ["#69783109861742", "May 8 at 1:45 pm", "", "India", "Not recovered", "₹10,498.95"],
]

export default function AbandonedCheckoutsPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingCart className="size-4" />
                Abandoned checkouts
              </h1>

              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"
              >
                <Download className="size-3.5" />
                Export
              </button>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-black/10 px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium"
                >
                  All <ChevronDown className="size-3.5" />
                </button>
                <div className="flex min-w-52 flex-1 items-center gap-2 text-sm text-black/50">
                  <Search className="size-4" />
                  <input
                    aria-label="Search and filter abandoned checkouts"
                    placeholder="Search and filter"
                    className="w-full bg-transparent outline-none placeholder:text-black/45"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Filter abandoned checkouts"
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
                <table className="w-full min-w-[1200px] border-collapse text-left text-xs">
                  <thead className="bg-black/[0.025] text-black/65">
                    <tr>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        <input type="checkbox" aria-label="Select all abandoned checkouts" />
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Checkout
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Created
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Customer name
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Region
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        Recovery status
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 text-right font-medium">
                        Total price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {abandonedCheckouts.map(([checkout, created, customer, region, status, total]) => (
                      <tr key={`${checkout}-${created}`} className="hover:bg-black/[0.02]">
                        <td className="border-b border-black/10 px-3 py-2.5">
                          <input type="checkbox" aria-label={`Select ${checkout}`} />
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5 font-medium">
                          <Link
                            href={`/dashboard/orders/abandoned-checkouts/${checkout.slice(1)}`}
                            className="hover:underline"
                          >
                            {checkout}
                          </Link>
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5">
                          {created}
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5">
                          {customer || "—"}
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5">
                          {region}
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5">
                          <span className="rounded-full bg-amber-200 px-2 py-1 text-amber-900">
                            {status}
                          </span>
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5 text-right">
                          {total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="mt-6 text-center text-sm text-black/65">
              Learn more about abandoned checkouts
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
