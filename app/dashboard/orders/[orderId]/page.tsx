import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Package } from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { OrderDetailActions } from "@/components/admin-dashboard/order-detail-actions"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getOrderForAdmin } from "@/lib/server/dal/orders"

export const metadata: Metadata = {
  title: "Order | SUOS Admin",
  description: "Review a SUOS order and fulfilment status.",
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">{children}</section>
}

function money(value: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function paymentLabel(status: "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED") {
  if (status === "PENDING") return "Payment pending"
  if (status === "CANCELLED") return "Voided"
  return "Paid"
}

function fulfillmentLabel(status: "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED") {
  if (status === "FULFILLED") return "Fulfilled"
  if (status === "CANCELLED") return "Cancelled"
  return "Unfulfilled"
}

export default async function OrderDetailPage({
  params,
}: PageProps<"/dashboard/orders/[orderId]">) {
  const { orderId } = await params
  const order = await getOrderForAdmin(orderId)
  if (!order) notFound()

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="w-full"><header className="flex flex-wrap items-center justify-between gap-3"><div><Link href="/dashboard/orders" className="text-xs font-medium text-black/55 transition hover:text-black hover:underline">Orders</Link><h1 className="mt-1 flex items-center gap-1.5 text-lg font-semibold"><Package className="size-4" /><ChevronRight className="size-4 text-black/45" />Order #{order.number}</h1></div><OrderDetailActions order={order} /></header>
              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-4"><Card><div className="border-b border-black/10 px-4 py-4"><h2 className="text-sm font-semibold">Items</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] border-collapse text-left text-sm"><thead className="bg-black/[0.025] text-xs text-black/60"><tr><th className="border-b border-black/10 px-4 py-2.5 font-medium">Product</th><th className="border-b border-black/10 px-4 py-2.5 text-center font-medium">Quantity</th><th className="border-b border-black/10 px-4 py-2.5 text-right font-medium">Price</th><th className="border-b border-black/10 px-4 py-2.5 text-right font-medium">Total</th></tr></thead><tbody>{order.items.map((item) => <tr key={item.id}><td className="border-b border-black/10 px-4 py-3"><p className="font-medium">{item.title}</p><p className="mt-1 font-mono text-xs text-black/50">{item.sku}</p></td><td className="border-b border-black/10 px-4 py-3 text-center">{item.quantity}</td><td className="border-b border-black/10 px-4 py-3 text-right">{money(item.unitPrice, order.currency)}</td><td className="border-b border-black/10 px-4 py-3 text-right font-medium">{money(item.total, order.currency)}</td></tr>)}</tbody></table></div><div className="ml-auto max-w-xs space-y-2 px-4 py-4 text-sm"><div className="flex justify-between text-black/65"><span>Subtotal</span><span>{money(order.subtotal, order.currency)}</span></div><div className="flex justify-between text-black/65"><span>Discount</span><span>{money(order.discount, order.currency)}</span></div><div className="flex justify-between text-black/65"><span>Shipping</span><span>{money(order.shipping, order.currency)}</span></div><div className="flex justify-between border-t border-black/10 pt-2 font-semibold"><span>Total</span><span>{money(order.total, order.currency)}</span></div></div></Card></div>
                <aside className="space-y-4"><Card><div className="border-b border-black/10 px-4 py-4"><h2 className="text-sm font-semibold">Order status</h2></div><dl className="space-y-4 px-4 py-4 text-sm"><div className="flex items-center justify-between gap-3"><dt className="text-black/60">Payment</dt><dd className="font-medium">{paymentLabel(order.status)}</dd></div><div className="flex items-center justify-between gap-3"><dt className="text-black/60">Fulfillment</dt><dd className="font-medium">{fulfillmentLabel(order.status)}</dd></div><div className="flex items-center justify-between gap-3"><dt className="text-black/60">Created</dt><dd className="text-right font-medium">{formatDate(order.createdAt)}</dd></div></dl></Card><Card><div className="border-b border-black/10 px-4 py-4"><h2 className="text-sm font-semibold">Customer</h2></div><div className="px-4 py-4 text-sm">{order.customer ? <><Link href={`/dashboard/customers/${order.customer.id}`} className="font-semibold text-[#0c3152] hover:underline">{order.customer.name}</Link><a href={`mailto:${order.email}`} className="mt-2 block text-black/60 hover:underline">{order.email}</a></> : <><p className="font-semibold">Guest customer</p><a href={`mailto:${order.email}`} className="mt-2 block text-black/60 hover:underline">{order.email}</a></>}</div></Card></aside>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
