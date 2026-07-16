import type { Metadata } from "next"
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  DollarSign,
  MoreHorizontal,
  Plus,
  Target,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Analytics | SUOS Admin",
  description: "Review sales and store performance analytics.",
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <p className="w-fit border-b border-dotted border-black/55 text-sm font-medium text-black/75">
        {title}
      </p>
      <p className="mt-1 text-lg font-semibold text-black/75">
        {value} <span className="font-normal text-black/40">—</span>
      </p>
      <div className="mt-2 h-0.5 w-11 bg-[#55c5f7]" />
    </section>
  )
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-xl border border-black/10 bg-white p-4 shadow-sm ${className}`}>
      <h2 className="w-fit border-b border-dotted border-black/55 text-sm font-medium text-black/75">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function EmptyReport({ title }: { title: string }) {
  return (
    <Panel title={title} className="min-h-[254px]">
      <div className="flex min-h-[190px] items-center justify-center text-sm text-black/60">
        No data for this date range
      </div>
    </Panel>
  )
}

function SalesChart({ title, value }: { title: string; value: string }) {
  return (
    <Panel title={title} className="min-h-[390px]">
      <p className="text-xl font-semibold text-black/75">
        {value} <span className="font-normal text-black/40">—</span>
      </p>
      <div className="relative mt-3 h-[270px]">
        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
        <div className="absolute inset-x-0 top-1/2 border-t border-black/5" />
        <div className="absolute inset-x-0 bottom-7 border-t border-black/5" />
        <span className="absolute left-0 top-[-8px] text-[11px] text-black/50">₹10</span>
        <span className="absolute left-0 top-[calc(50%-8px)] text-[11px] text-black/50">₹5</span>
        <span className="absolute bottom-[19px] left-0 text-[11px] text-black/50">₹0</span>
        <svg
          viewBox="0 0 1000 220"
          preserveAspectRatio="none"
          className="absolute inset-x-12 bottom-7 h-[220px] w-[calc(100%-6rem)]"
          aria-label="Empty sales chart"
          role="img"
        >
          <path d="M0 219 H560" fill="none" stroke="#18a8ef" strokeWidth="2" />
          <path d="M560 219 H1000" fill="none" stroke="#8ed5f6" strokeDasharray="4 4" strokeWidth="2" />
        </svg>
        <div className="absolute inset-x-8 bottom-0 flex justify-between text-[11px] text-black/50">
          <span>12 AM</span>
          <span>2 AM</span>
          <span>4 AM</span>
          <span>6 AM</span>
          <span>8 AM</span>
          <span>10 AM</span>
          <span>12 PM</span>
          <span>2 PM</span>
          <span>4 PM</span>
          <span>6 PM</span>
          <span>8 PM</span>
          <span>10 PM</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-5 text-xs text-black/55">
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#18a8ef]" />Jul 16, 2026</span>
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#8ed5f6]" />Jul 15, 2026</span>
      </div>
    </Panel>
  )
}

function ConversionBreakdownPanel() {
  return (
    <Panel title="Conversion rate breakdown" className="min-h-[390px]">
      <p className="text-xl font-semibold text-black/75">0% <span className="font-normal text-black/40">—</span></p>
      <div className="mt-4 grid grid-cols-4 divide-x divide-black/10">
        {["Sessions", "Added to cart", "Reached checkout", "Completed checkout"].map((label) => (
          <div key={label} className="min-w-0 px-2 first:pl-0 last:pr-0">
            <p className="truncate text-xs text-black/75">{label}</p>
            <p className="mt-1 text-sm text-black/75">0%</p>
            <p className="text-xs text-black/55">0% <span className="text-black/40">—</span></p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function SessionsByDevicePanel() {
  return (
    <Panel title="Sessions by device type" className="min-h-[345px]">
      <div className="flex min-h-[275px] items-center justify-center gap-8">
        <div className="flex size-56 items-center justify-center rounded-full border-[26px] border-black/[0.07]">
          <div className="text-center">
            <p className="text-3xl font-semibold text-black/80">0</p>
            <p className="text-sm text-black/55">—</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-black/55">
          <span className="size-3 rounded-sm bg-[#18a8ef]" />
          Desktop
          <span className="ml-5">0</span>
        </div>
      </div>
    </Panel>
  )
}

function SessionsByLocationPanel() {
  return (
    <Panel title="Sessions by location" className="min-h-[345px]">
      <div className="space-y-5">
        {["India · Punjab · Mohali", "India · Karnataka · Bengaluru"].map((location) => (
          <div key={location}>
            <p className="text-xs text-black/55">{location}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-black/55">
              <span>0</span>
              <div className="h-14 flex-1 border-l border-[#18a8ef] bg-[#75c5e5]" />
              <span>1</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function CohortPanel() {
  const cohorts = ["Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"]
  return (
    <Panel title="Customer cohort analysis" className="min-h-[390px]">
      <div className="overflow-hidden text-xs">
        <div className="grid grid-cols-[100px_70px_minmax(0,1fr)] gap-2 text-black/65">
          <span>Cohort</span><span>Customers</span><span className="text-center">Months</span>
        </div>
        <div className="mt-2 space-y-0.5">
          {cohorts.map((cohort, rowIndex) => (
            <div key={cohort} className="grid grid-cols-[100px_70px_minmax(0,1fr)] gap-2">
              <span className="py-2 text-black/70">{cohort}</span>
              <span className="py-2 text-center text-black/70">{rowIndex === cohorts.length - 1 ? "1" : "0"}</span>
              <div className="grid grid-cols-8 overflow-hidden rounded-r-lg bg-[#f7f8fc]">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span key={index} className={`py-2 text-center text-blue-900 ${index >= 8 - rowIndex ? "bg-white" : ""}`}>0%</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

function LandingPagesPanel() {
  return (
    <Panel title="Sessions by landing page" className="min-h-[390px]">
      <div className="space-y-2 pt-6">
        {["/checkouts/cn/hWNEV5QZToiKuLtCrDGNnzRE/en-in", "/checkouts/cn/hWNEVS1YFUPiCTo1V0YSCLSO/en-in"].map((page) => (
          <div key={page} className="flex items-center justify-between gap-3 rounded-lg px-1 py-5 text-sm even:bg-black/[0.03]">
            <span className="truncate text-black/75">Checkout · {page}</span>
            <span className="shrink-0 font-medium text-black/75">0 <span className="ml-3 text-black/40">—</span></span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function ReferralBarsPanel({ title }: { title: string }) {
  return (
    <Panel title={title} className="min-h-[345px]">
      <div className="space-y-5 pt-3">
        {["Direct · None · Mohali", "Direct · None · Bengaluru"].map((label, index) => (
          <div key={label}>
            <p className="text-xs text-black/55">{label}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-black/55">
              <span>0</span>
              <div className={`h-14 flex-1 ${index === 0 ? "bg-[#d8eef7]" : "bg-[#75c5e5]"}`} />
              <span>1</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function SellThroughPanel() {
  const products = ["S31 · 7 · None", "B1 · 10 · None", "S6 · 6 · None", "B2 · 8 · None", "A1 · 6 · None"]
  return (
    <Panel title="Products by sell-through rate" className="min-h-[345px]">
      <div className="space-y-4 pt-2">
        {products.map((product) => (
          <div key={product} className="text-xs text-black/60">
            <p>{product}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-5 border-l-2 border-[#18a8ef]" />
              <span>0%</span>
              <span className="text-black/40">—</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export default function AnalyticsPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="size-4" />
                Analytics
              </h1>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="More analytics actions"
                  className="rounded-lg bg-black/[0.06] p-2 text-black/65 hover:bg-black/10"
                >
                  <MoreHorizontal className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10"
                >
                  Try targets
                  <ChevronDown className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"
                >
                  <Plus className="size-3.5" />
                  New exploration
                </button>
              </div>
            </header>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-medium">
                <CalendarDays className="size-3.5" />
                Today
                <ChevronDown className="size-3.5" />
              </button>
              <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-medium">
                <CalendarDays className="size-3.5" />
                Jul 15, 2026
                <ChevronDown className="size-3.5" />
              </button>
              <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-medium">
                <DollarSign className="size-3.5" />
                INR ₹
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Gross sales" value="₹0.00" />
              <MetricCard title="Returning customer rate" value="0%" />
              <MetricCard title="Orders fulfilled" value="0" />
              <MetricCard title="Orders" value="0" />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
              <SalesChart title="Total sales over time" value="₹0.00" />
              <Panel title="Total sales breakdown" className="min-h-[390px]">
                <div className="space-y-1">
                  {["Gross sales", "Discounts", "Returns", "Net sales", "Shipping charges", "Return fees", "Taxes", "Total sales"].map((label, index) => (
                    <div key={label} className={`flex items-center justify-between rounded-lg px-2 py-3 text-sm ${index % 2 === 1 ? "bg-black/[0.035]" : ""}`}>
                      <span className="text-blue-600">{label}</span>
                      <span className="font-medium text-black/75">₹0.00 <span className="ml-3 text-black/40">—</span></span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <EmptyReport title="Total sales by sales channel" />
              <SalesChart title="Average order value over time" value="₹0.00" />
              <EmptyReport title="Total sales by product" />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(300px,1fr)]">
              <SalesChart title="Sessions over time" value="0" />
              <SalesChart title="Conversion rate over time" value="0%" />
              <ConversionBreakdownPanel />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <SessionsByDevicePanel />
              <SessionsByLocationPanel />
              <EmptyReport title="Total sales by social referrer" />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
              <CohortPanel />
              <LandingPagesPanel />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <EmptyReport title="Sessions by social referrer" />
              <EmptyReport title="Total sales by referrer" />
              <EmptyReport title="Performance by referring channel" />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <ReferralBarsPanel title="Sessions by referrer" />
              <EmptyReport title="Total sales by POS location" />
              <SellThroughPanel />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <EmptyReport title="POS staff sales total" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 pb-2 text-xs text-black/50">
              <Target className="size-3.5" />
              Analytics updates as your store receives activity
              <CircleHelp className="size-3.5" />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
