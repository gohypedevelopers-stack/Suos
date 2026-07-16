import type { Metadata } from "next"
import {
  ArrowDownUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileChartColumn,
  Search,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Reports | SUOS Admin",
  description: "Browse store analytics reports.",
}

const reports = [
  ["Sessions over time", "Acquisition"],
  ["Sessions by location", "Acquisition"],
  ["Sessions by referrer", "Acquisition"],
  ["Sessions by social referrer", "Acquisition"],
  ["Visitors over time", "Acquisition"],
  ["Visitors right now", "Acquisition"],
  ["Bounce rate over time", "Behavior"],
  ["Checkout conversion rate over time", "Behavior"],
  ["Conversion rate breakdown", "Behavior"],
  ["Conversion rate over time", "Behavior"],
  ["Customer behavior", "Behavior"],
  ["Product recommendation conversions over time", "Behavior"],
  ["Product recommendations with low engagement", "Behavior"],
  ["Search conversions over time", "Behavior"],
  ["Searches by search query", "Behavior"],
  ["Searches with no clicks", "Behavior"],
  ["Searches with no results", "Behavior"],
  ["Sessions by device type", "Behavior"],
  ["Sessions by landing page", "Behavior"],
  ["Shop Campaign ROAS", "Behavior"],
] as const

export default function ReportsPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <FileChartColumn className="size-4" />
                Reports
              </h1>

              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"
              >
                New exploration
              </button>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-black/10 px-4 py-2">
                <Search className="size-4 text-black/50" />
                <input
                  aria-label="Search reports"
                  placeholder="Search reports"
                  className="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-black/50"
                />
                <button
                  type="button"
                  aria-label="Sort reports"
                  className="rounded-lg border border-black/10 p-1.5 text-black/55 hover:bg-black/[0.03]"
                >
                  <ArrowDownUp className="size-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 border-b border-black/10 px-4 py-2">
                <button type="button" className="inline-flex items-center gap-1 rounded-full border border-dashed border-black/15 px-2.5 py-1 text-xs text-black/70">
                  Created by
                  <ChevronDown className="size-3.5" />
                </button>
                <button type="button" className="inline-flex items-center gap-1 rounded-full border border-dashed border-black/15 px-2.5 py-1 text-xs text-black/70">
                  Category
                  <ChevronDown className="size-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                  <thead className="bg-black/[0.025] text-xs text-black/65">
                    <tr>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">Name</th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">Category</th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                        <span className="inline-flex items-center gap-1">Last viewed <ChevronDown className="size-3.5 rotate-180" /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(([name, category]) => (
                      <tr key={name} className="hover:bg-black/[0.02]">
                        <td className="border-b border-black/10 px-3 py-2 text-black/80">{name}</td>
                        <td className="border-b border-black/10 px-3 py-2">
                          <span className="rounded-full bg-black/[0.07] px-2 py-1 text-xs text-black/60">{category}</span>
                        </td>
                        <td className="border-b border-black/10 px-3 py-2 text-black/75">Jul 15, 2026</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-1 border-t border-black/10 px-3 py-2 text-xs text-black/60">
                <button type="button" aria-label="Previous page" className="rounded-md bg-black/5 p-1 hover:bg-black/10"><ChevronLeft className="size-4" /></button>
                <button type="button" aria-label="Next page" className="rounded-md bg-black/5 p-1 hover:bg-black/10"><ChevronRight className="size-4" /></button>
                <span className="ml-1">1–50</span>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
