import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  Clipboard,
  Mail,
  Package,
  ShoppingCart,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PrintButton } from "./print-button"

export const metadata: Metadata = {
  title: "Abandoned checkout | SUOS Admin",
  description: "View abandoned checkout details.",
}

const checkoutRecords = [
  ["69953071382894", "Jun 16, 2026 at 5:22 pm"],
  ["69953053688174", "Jun 16, 2026 at 5:19 pm"],
  ["69953048936814", "Jun 16, 2026 at 5:14 pm"],
  ["69952995033454", "Jun 16, 2026 at 4:54 pm"],
  ["69952989233518", "Jun 16, 2026 at 4:52 pm"],
  ["69952886800750", "Jun 16, 2026 at 4:10 pm"],
  ["69952827851118", "Jun 16, 2026 at 3:45 pm"],
  ["69952828244334", "Jun 16, 2026 at 3:45 pm"],
  ["69952819528046", "Jun 16, 2026 at 3:43 pm"],
  ["69952775618926", "Jun 16, 2026 at 3:23 pm"],
  ["69919518884206", "Jun 9, 2026 at 2:40 pm"],
  ["69840284287342", "May 23, 2026 at 1:17 pm"],
  ["69783152001390", "May 8, 2026 at 2:06 pm"],
  ["69783109861742", "May 8, 2026 at 1:45 pm"],
] as const

function DetailCard({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`break-inside-avoid rounded-xl border border-black/10 bg-white p-4 shadow-sm print:shadow-none ${className}`}>
      <h2 className="text-sm font-semibold text-black/75">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function LabelValue({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)_auto] gap-4 py-1 text-sm">
      <span className="text-black/75">{label}</span>
      <span className={muted ? "text-black/55" : "text-black/70"}>{value}</span>
      <span className="text-right font-medium text-black/75">
        {label === "Discount" ? "-₹499.80" : label === "Shipping" ? "₹0.00" : label === "Estimated tax" ? "₹686.17" : "₹4,498.20"}
      </span>
    </div>
  )
}

export default async function AbandonedCheckoutDetailPage({
  params,
}: {
  params: Promise<{ checkoutId: string }>
}) {
  const { checkoutId } = await params
  const checkoutNumber = `#${checkoutId}`
  const checkoutIndex = checkoutRecords.findIndex(([id]) => id === checkoutId)
  const currentRecord = checkoutRecords[checkoutIndex === -1 ? 0 : checkoutIndex]
  const previousCheckout = checkoutRecords[checkoutIndex - 1]?.[0]
  const nextCheckout = checkoutRecords[checkoutIndex + 1]?.[0]

  const arrowButtonClass =
    "rounded-lg border border-black/5 bg-black/[0.04] p-2 text-black/70 hover:bg-black/10"
  const disabledArrowClass =
    "rounded-lg border border-black/5 bg-black/[0.04] p-2 text-black/25"

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <div className="print:hidden">
          <AppSidebar />
        </div>
        <SidebarInset className="print:bg-white print:shadow-none">
          <main className="min-h-full bg-[#f5f5f5] p-4 text-black print:bg-white print:p-0 sm:p-5">
            <div className="mx-auto max-w-[968px]">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <ShoppingCart className="size-4" />
                    <span>{checkoutNumber}</span>
                    <span className="rounded-full bg-amber-200 px-2 py-1 text-xs font-medium text-amber-900">
                      Not Recovered
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-black/55">India, {currentRecord[1]}</p>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <PrintButton />
                  {previousCheckout ? (
                    <Link
                      href={`/dashboard/orders/abandoned-checkouts/${previousCheckout}`}
                      aria-label="Previous checkout"
                      className={arrowButtonClass}
                    >
                      <ArrowUp className="size-3.5" />
                    </Link>
                  ) : (
                    <button type="button" disabled aria-label="Previous checkout" className={disabledArrowClass}>
                      <ArrowUp className="size-3.5" />
                    </button>
                  )}
                  {nextCheckout ? (
                    <Link
                      href={`/dashboard/orders/abandoned-checkouts/${nextCheckout}`}
                      aria-label="Next checkout"
                      className={arrowButtonClass}
                    >
                      <ArrowDown className="size-3.5" />
                    </Link>
                  ) : (
                    <button type="button" disabled aria-label="Next checkout" className={disabledArrowClass}>
                      <ArrowDown className="size-3.5" />
                    </button>
                  )}
                </div>
              </header>

              <div className="mt-6 grid gap-4 print:mt-4 print:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <DetailCard title="Checkout details">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-black/75">From EVRYDAE</p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03]"
                      >
                        <Clipboard className="size-3.5" />
                        Copy checkout URL
                      </button>
                    </div>

                    <div className="mt-4 rounded-lg border border-black/10 p-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex size-10 items-center justify-center rounded-lg border border-black/10 bg-black/[0.03]">
                          <Package className="size-4 text-black/65" />
                        </div>
                        <a href="#" className="min-w-0 flex-1 truncate text-black/75 underline underline-offset-2">
                          EVRYDAE VARSITY MESH POLO
                        </a>
                        <span className="text-black/75 line-through">₹2,499.00</span>
                        <span className="text-black/75">₹2,249.10×2</span>
                        <span className="font-medium text-black/75">₹4,498.20</span>
                      </div>
                      <span className="ml-[52px] mt-1 inline-flex rounded-full bg-black/10 px-2 py-0.5 text-xs text-black/65">S</span>
                    </div>

                    <div className="mt-3">
                      <LabelValue label="Discount" value="PACK2" />
                      <LabelValue label="Subtotal" value="2 items" />
                      <LabelValue label="Shipping" value="Standard (0.0 kg)" />
                      <LabelValue label="Estimated tax" value="IGST 18% (Included)" />
                      <div className="mt-1 border-b border-black/10 pb-2">
                        <LabelValue label="Total" value="" />
                      </div>
                      <div className="flex items-center justify-between pt-4 text-sm font-medium text-black/75">
                        <span>To be paid by customer</span>
                        <span>₹4,498.20</span>
                      </div>
                    </div>
                  </DetailCard>

                  <DetailCard title="Automations">
                    <p className="text-sm text-black/60">
                      Automations triggered by this abandoned checkout.
                    </p>
                    <div className="mt-4 overflow-hidden rounded-lg border border-black/10">
                      <div className="flex items-center justify-between gap-3 bg-black/[0.02] px-3 py-3 text-sm">
                        <span className="flex items-center gap-2"><Mail className="size-4 text-fuchsia-500" />You left items at checkout</span>
                        <span className="rounded-full bg-orange-200 px-2 py-1 text-xs font-medium text-orange-900">Not sent</span>
                      </div>
                    </div>
                  </DetailCard>

                  <DetailCard title="Notes">
                    <input
                      aria-label="Add a note to this checkout"
                      placeholder="Add a note to this checkout"
                      className="h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none placeholder:text-black/50"
                    />
                    <div className="mt-3 flex justify-end">
                      <button type="button" disabled className="rounded-lg bg-black/15 px-4 py-2 text-xs font-medium text-white">Save</button>
                    </div>
                  </DetailCard>
                </div>

                <DetailCard title="Customer" className="h-fit">
                  <a href="#" className="text-sm text-black/75 underline underline-offset-2">MOHD KAIF</a>
                  <p className="mt-1 text-sm text-black/55">No orders</p>

                  <h3 className="mt-5 text-sm font-semibold text-black/75">Contact information</h3>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <a href="mailto:hofece9230@synsky.com" className="text-sm text-blue-600">hofece9230@synsky.com</a>
                      <p className="mt-1 text-sm text-black/55">No account</p>
                    </div>
                    <Clipboard className="mt-0.5 size-4 text-black/45" />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-black/75">Shipping address</h3>
                  <div className="mt-2 flex items-start justify-between gap-3 text-sm leading-5 text-black/75">
                    <p>Mohd KAIF<br />Nizamuddin Station Rajput Samrat<br />Prithviraj Chauhan Marg Nagli Rajapur<br />Sarai Kale Khan<br />110013 New Delhi Delhi<br />India</p>
                    <Clipboard className="mt-0.5 size-4 shrink-0 text-black/45" />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-black/75">Billing address</h3>
                  <p className="mt-2 text-sm text-black/55">Same as shipping address</p>

                </DetailCard>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
