import type { Metadata } from "next"
import Link from "next/link"
import { BadgePlus, ShoppingBag } from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Drafts | SUOS Admin",
  description: "Create draft orders and invoices in SUOS.",
}

function DraftIllustration() {
  return (
    <div className="relative mx-auto size-44 sm:size-52" aria-hidden="true">
      <div className="absolute inset-3 rounded-full bg-black/[0.04]" />
      <div className="absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4f4f4]" />
      <div className="absolute left-1/2 top-[52%] h-12 w-36 -translate-x-1/2 rounded-b-[999px] bg-[#3aa6a1]" />

      <div className="absolute left-1/2 top-[14%] h-32 w-24 -translate-x-1/2 rounded-t-md bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <div className="absolute right-0 top-0 h-7 w-7 rotate-45 translate-x-1 -translate-y-1 bg-[#ececec]" />
        <div className="absolute left-2 top-3 h-12 w-12 rounded-sm bg-black/5">
          <div className="absolute left-1.5 top-1.5 h-7 w-9 rounded-sm bg-[#ea6a57]" />
          <div className="absolute left-[10px] top-1.5 h-2 w-4 rounded-b-sm bg-[#d94d3b]" />
        </div>
        <div className="absolute right-2 top-9 h-1.5 w-9 rounded-full bg-black/15" />
        <div className="absolute right-2 top-12 flex gap-1.5">
          <span className="size-2 rounded-full bg-[#d94d3b]" />
          <span className="size-2 rounded-full bg-black/10" />
          <span className="size-2 rounded-full bg-black/10" />
        </div>
        <div className="absolute left-2 top-20 h-1.5 w-5 rounded-full bg-black/10" />
        <div className="absolute left-8 top-20 h-1.5 w-5 rounded-full bg-black/10" />
        <div className="absolute left-2 top-24 h-1.5 w-10 rounded-full bg-black/10" />
        <div className="absolute right-2 top-20 h-1.5 w-5 rounded-full bg-black/10" />
        <div className="absolute right-2 top-24 h-1.5 w-7 rounded-full bg-black/10" />
        <div className="absolute bottom-4 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-white" />
      </div>
    </div>
  )
}

export default function DraftsPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <BadgePlus className="size-4" />
                Drafts
              </h1>
            </div>

            <section className="mt-3 flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="max-w-md px-6 py-16 text-center">
                <DraftIllustration />

                <h2 className="mt-8 text-base font-semibold text-black/80">
                  Manually create orders and invoices
                </h2>

                <p className="mt-2 text-sm leading-5 text-black/65">
                  Use draft orders to take orders over the phone, email invoices to
                  customers, and collect payments.
                </p>

                <Link
                  href="/dashboard/orders/create-order"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white hover:bg-black/80"
                >
                  <ShoppingBag className="size-3.5" />
                  Create draft order
                </Link>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
