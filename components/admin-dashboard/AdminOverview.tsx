"use client"

import { useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react"

const salesData = [
  { date: "Jun 15", current: 0, previous: 0 },
  { date: "Jun 18", current: 2, previous: 1 },
  { date: "Jun 21", current: 0, previous: 1 },
  { date: "Jun 24", current: 4, previous: 2 },
  { date: "Jun 27", current: 6, previous: 3 },
  { date: "Jun 30", current: 5, previous: 2 },
  { date: "Jul 3", current: 4, previous: 2 },
  { date: "Jul 6", current: 0, previous: 3 },
  { date: "Jul 9", current: 18, previous: 8 },
  { date: "Jul 12", current: 4, previous: 3 },
  { date: "Jul 15", current: 1, previous: 1 },
]

const metrics = [
  { label: "Sessions", value: "58", change: "↘ 9%", active: true },
  { label: "Total sales", value: "₹8,258", change: "—" },
  { label: "Orders", value: "1", change: "—" },
  { label: "Conversion rate", value: "3.44%", change: "—" },
]

const miniGraphPoints: Record<string, string> = {
  Sessions: "0,18 5,18 8,6 11,18 20,18 24,12 28,18 34,18 38,8 42,18 54,18",
  "Total sales": "0,18 4,18 7,6 10,18 22,18 27,14 31,18 54,18",
  Orders: "0,18 4,18 8,5 11,18 22,18 26,13 30,18 54,18",
  "Conversion rate": "0,18 6,18 9,9 13,18 24,18 29,14 33,18 54,18",
}

function MiniSparkline({ metric }: { metric: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 54 20"
      className="pointer-events-none absolute bottom-2 right-3 h-5 w-14"
      preserveAspectRatio="none"
    >
      <polyline
        points={miniGraphPoints[metric]}
        fill="none"
        stroke="#08a7f5"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function AdminOverview() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [rangeLabel, setRangeLabel] = useState("Last 30 days")
  const [selectedMetric, setSelectedMetric] = useState("Sessions")
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <section className="relative flex min-w-0 flex-1 flex-col gap-4 bg-[#f5f5f5] p-4 pt-6">
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-black">
            {greeting}, Admin
          </h1>
          <p className="mt-0.5 text-xs text-black/55">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <button
          type="button"
          aria-expanded={isDatePickerOpen}
          onClick={() => setIsDatePickerOpen((open) => !open)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/25 bg-white px-2.5 text-xs font-medium text-black/75 shadow-sm transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
        >
          <CalendarDays className="size-3.5 text-black/65" />
          {rangeLabel}
          <ChevronDown className="size-3.5 text-black/55" />
        </button>

        {isDatePickerOpen ? (
          <div className="absolute right-0 top-10 z-30 flex w-[min(680px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-black/15 bg-white shadow-xl">
            <div className="hidden w-40 shrink-0 border-r border-black/10 bg-[#fafafa] p-2 sm:block">
              {["Today", "Yesterday", "Last 7 days", "Last 30 days", "Quarter to date", "Custom range"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setRangeLabel(option)
                    setIsDatePickerOpen(false)
                  }}
                  className={`w-full rounded-md px-2 py-2 text-left text-xs transition-colors hover:bg-black/5 ${
                    option === rangeLabel ? "bg-black/10 font-medium" : "text-black/70"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="min-w-0 flex-1 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-black/70">Last</span>
                <input aria-label="Number of days" defaultValue="30" className="h-8 w-20 rounded-md border border-black/20 px-2 outline-none focus:border-black/50" />
                <select aria-label="Date unit" defaultValue="Days" className="h-8 rounded-md border border-black/20 bg-white px-2 outline-none focus:border-black/50">
                  <option>Days</option>
                  <option>Weeks</option>
                  <option>Months</option>
                </select>
                <label className="inline-flex items-center gap-1.5 text-black/70">
                  <input type="checkbox" defaultChecked className="accent-black" /> Include today
                </label>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-6 text-xs text-black/75">
                {["June 2026", "July 2026"].map((month) => (
                  <div key={month}>
                    <p className="mb-3 text-center font-semibold">{month}</p>
                    <div className="grid grid-cols-7 gap-y-2 text-center text-black/60">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="text-[10px]">{day}</span>)}
                      {Array.from({ length: 35 }, (_, index) => {
                        const day = index - (month === "June 2026" ? 0 : 1)
                        return <span key={index} className={day === 15 ? "rounded bg-black px-1 py-0.5 text-white" : "px-1 py-0.5"}>{day > 0 && day < 31 ? day : ""}</span>
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-2 border-t border-black/10 pt-3">
                <button type="button" onClick={() => setIsDatePickerOpen(false)} className="rounded-md border border-black/20 px-3 py-1.5 text-xs">Cancel</button>
                <button type="button" onClick={() => setIsDatePickerOpen(false)} className="rounded-md bg-black px-3 py-1.5 text-xs text-white">Apply</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative rounded-xl border border-black/10 bg-white p-2 shadow-sm sm:p-3">
        <button
          type="button"
          aria-label={isExpanded ? "Collapse overview" : "Expand overview"}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="absolute right-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-md text-black/50 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
        >
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <div className="grid grid-cols-2 gap-2 pr-8 sm:grid-cols-4">
          {metrics.map((metric) => (
            <button
              type="button"
              key={metric.label}
              aria-pressed={selectedMetric === metric.label}
              onClick={() => setSelectedMetric(metric.label)}
              className={`relative min-h-14 rounded-lg px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25 ${
                selectedMetric === metric.label
                  ? "bg-[#f0f0f0]"
                  : "bg-white hover:bg-black/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-black/75">{metric.label}</p>
                {selectedMetric === metric.label ? <span className="text-sm text-black/45">↗</span> : null}
              </div>
              <p className="mt-1 text-sm font-semibold text-black">
                {metric.value} <span className="font-normal text-black/55">{metric.change}</span>
              </p>
              {!isExpanded ? <MiniSparkline metric={metric.label} /> : null}
            </button>
          ))}
        </div>

        {isExpanded ? <div className="mt-4 h-[220px] min-w-0 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={220}
            initialDimension={{ width: 320, height: 220 }}
          >
            <LineChart data={salesData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e5e5e5" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                domain={[0, 40]}
                ticks={[0, 20, 40]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 11 }}
                width={28}
              />
              <Tooltip
                cursor={{ stroke: "#d4d4d4", strokeDasharray: "3 3" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#8bd4f5"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#08a7f5"
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> : null}

        {isExpanded ? <div className="flex justify-center gap-5 pt-2 text-[11px] text-black/55">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#08a7f5]" /> Jun 15–Jul 15, 2026
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#8bd4f5]" /> May 15–Jun 14, 2026
          </span>
        </div> : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium">
          <span aria-hidden>▣</span> 4 orders to fulfil
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium">
          <span aria-hidden>▱</span> 1 payment to capture
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent orders</h2>
            <button type="button" className="text-xs text-black/55 underline underline-offset-2 hover:text-black">
              View all
            </button>
          </div>
          <div className="mt-3 divide-y divide-black/10">
            {["#SUOS-1048", "#SUOS-1047", "#SUOS-1046"].map((order, index) => (
              <button key={order} type="button" className="flex w-full items-center justify-between gap-3 py-3 text-left text-xs hover:bg-black/[0.02]">
                <span className="font-medium">{order}</span>
                <span className="text-black/55">{index === 0 ? "Processing" : "Delivered"}</span>
                <span className="font-medium">₹{index === 0 ? "2,800" : index === 1 ? "5,600" : "1,950"}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Top products</h2>
          <div className="mt-3 space-y-3">
            {["Bootcut Denim", "Panelled Overshirt", "Relaxed Trousers"].map((product, index) => (
              <div key={product} className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-black/70">{product}</span>
                <span className="shrink-0 font-medium">{[24, 18, 12][index]} sold</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Quick actions</h2>
          <div className="mt-3 grid gap-2">
            {["Add product", "Manage collection", "View customers"].map((action) => (
              <button key={action} type="button" className="rounded-md border border-black/15 px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-black hover:text-white">
                {action}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Store health</h2>
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-semibold">98%</p>
          <p className="mt-1 text-xs text-black/55">All systems operational</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10">
            <div className="h-full w-[98%] rounded-full bg-emerald-500" />
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Traffic sources</h2>
          <div className="mt-3 space-y-2.5 text-xs">
            {[['Direct', '46%'], ['Instagram', '32%'], ['Search', '22%']].map(([source, value]) => (
              <div key={source}>
                <div className="flex justify-between text-black/70"><span>{source}</span><span className="font-medium text-black">{value}</span></div>
                <div className="mt-1 h-1 rounded-full bg-black/10"><div className="h-full rounded-full bg-[#08a7f5]" style={{ width: value }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Inventory alerts</h2>
          <div className="mt-3 space-y-3 text-xs">
            <div className="flex items-center justify-between"><span className="text-black/70">Low stock</span><span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800">6 items</span></div>
            <div className="flex items-center justify-between"><span className="text-black/70">Out of stock</span><span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-800">2 items</span></div>
            <button type="button" className="pt-1 text-black/55 underline underline-offset-2 hover:text-black">Review inventory</button>
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Customer snapshot</h2>
          <p className="mt-3 text-2xl font-semibold">1,284</p>
          <p className="mt-1 text-xs text-black/55">Total customers</p>
          <p className="mt-3 text-xs font-medium text-emerald-700">↗ 12.4% this period</p>
        </section>
      </div>

    </section>
  )
}
