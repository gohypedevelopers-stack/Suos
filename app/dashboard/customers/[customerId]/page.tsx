import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  AtSign,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Hash,
  Link2,
  MessageCircle,
  PackageOpen,
  Pencil,
  UserRound,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { CustomerActions } from "@/components/admin-dashboard/customer-actions"
import { customers } from "@/components/admin-dashboard/customer-data"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Customer | SUOS Admin",
  description: "Review a SUOS customer profile and activity.",
}

export function generateStaticParams() {
  return customers.map((customer) => ({ customerId: customer.id }))
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-black/10 bg-white shadow-sm ${className}`}>{children}</section>
}

function EditCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><div className="flex items-center justify-between px-4 pt-4"><h2 className="text-sm font-semibold">{title}</h2><button type="button" aria-label={`Edit ${title.toLowerCase()}`} className="rounded-md p-1 text-black/50 hover:bg-black/[0.04]"><Pencil className="size-4" /></button></div><div className="px-4 pb-4 pt-3 text-sm text-black/65">{children}</div></Card>
}

export default async function CustomerDetailPage({ params }: PageProps<"/dashboard/customers/[customerId]">) {
  const { customerId } = await params
  const currentCustomerIndex = customers.findIndex((entry) => entry.id === customerId)
  const customer = customers[currentCustomerIndex]
  if (!customer) notFound()
  const previousCustomer = customers[currentCustomerIndex - 1]
  const nextCustomer = customers[currentCustomerIndex + 1]

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="mx-auto max-w-[968px]">
              <header className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="flex items-center gap-1.5 text-lg font-semibold"><UserRound className="size-4" /><ChevronRight className="size-4 text-black/45" />{customer.email}</h1>
                <div className="flex items-center gap-2">{previousCustomer ? <Link href={`/dashboard/customers/${previousCustomer.id}`} aria-label="Previous customer" className="rounded-lg bg-black/[0.06] p-2 text-black/55 transition hover:bg-black/10 hover:text-black"><ChevronUp className="size-3.5" /></Link> : <span aria-disabled="true" className="rounded-lg bg-black/[0.04] p-2 text-black/25"><ChevronUp className="size-3.5" /></span>}{nextCustomer ? <Link href={`/dashboard/customers/${nextCustomer.id}`} aria-label="Next customer" className="rounded-lg bg-black/[0.06] p-2 text-black/55 transition hover:bg-black/10 hover:text-black"><ChevronDown className="size-3.5" /></Link> : <span aria-disabled="true" className="rounded-lg bg-black/[0.04] p-2 text-black/25"><ChevronDown className="size-3.5" /></span>}</div>
              </header>

              <Card className="mt-4 overflow-hidden"><div className="grid grid-cols-1 divide-y divide-black/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"><div className="px-4 py-4"><p className="text-sm font-medium text-black/75">Amount spent</p><p className="mt-1 text-sm font-semibold">{customer.amountSpent}</p></div><div className="px-4 py-4"><p className="text-sm font-medium text-black/75">Orders</p><p className="mt-1 text-sm font-semibold">{customer.orders}</p></div><div className="px-4 py-4"><p className="text-sm font-medium text-black/75">Customer since</p><p className="mt-1 text-sm font-semibold">{customer.customerSince}</p></div></div></Card>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_318px]">
                <div className="space-y-4">
                  <Card><div className="flex min-h-32 items-center justify-between gap-6 px-4 py-5"><div><h2 className="text-sm font-semibold">Last order placed</h2><p className="mt-3 text-sm text-black/60">{customer.orders ? "This customer’s latest order is available in their order history." : "This customer hasn’t placed any orders yet"}</p><Link href="/dashboard/orders/create-order" className="mt-3 inline-flex h-8 items-center rounded-lg border border-black/15 px-3 text-sm font-medium hover:bg-black/[0.03]">Create order</Link></div><div className="hidden size-20 shrink-0 items-center justify-center rounded-full bg-[#d6f2ee] text-[#319a90] sm:flex"><PackageOpen className="size-10" /></div></div></Card>
                  <div className="pt-5"><h2 className="text-sm font-semibold">Timeline</h2><Card className="mt-3 overflow-hidden"><div className="flex gap-3 px-4 py-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#865cff] text-sm font-semibold text-white">SK</div><div className="flex min-w-0 flex-1 items-center"><input aria-label="Leave a comment" placeholder="Leave a comment..." className="w-full bg-transparent text-sm outline-none placeholder:text-black/50" /></div></div><div className="flex items-center gap-3 border-t border-black/10 px-4 py-2 text-black/45"><MessageCircle className="size-4" /><AtSign className="size-4" /><Hash className="size-4" /><Link2 className="size-4" /><button type="button" disabled className="ml-auto rounded-lg bg-black/[0.06] px-3 py-1.5 text-xs font-medium text-black/35">Post</button></div></Card><div className="relative ml-5 mt-8 border-l border-black/10 pb-5 pl-8"><span className="absolute -left-1.5 top-16 size-3 rounded-full border-[3px] border-[#f5f5f5] bg-black/60" /><p className="text-xs text-black/55">Today</p><div className="mt-8 flex items-center justify-between gap-3 text-sm"><p>Customer profile was opened.</p><p className="text-xs text-black/55">5:33 PM</p></div></div></div>
                </div>

                <aside className="space-y-4"><Card><div className="flex items-center justify-between px-4 pt-4"><h2 className="text-sm font-semibold">Customer</h2><CustomerActions email={customer.email} name={customer.name} /></div><div className="space-y-5 px-4 pb-5 pt-4 text-sm"><div><h3 className="font-semibold">Contact information</h3><div className="mt-3 flex items-center justify-between gap-3"><a href={`mailto:${customer.email}`} className="truncate text-[#005BD3] hover:underline">{customer.email}</a><button type="button" aria-label="Copy email" className="text-black/55 hover:text-black"><Copy className="size-4" /></button></div><p className="mt-1 text-black/65">Will receive notifications in English</p></div><div><h3 className="font-semibold">Default address</h3><p className="mt-3 text-black/65">{customer.defaultAddress}</p></div><div><h3 className="font-semibold">Marketing subscriptions</h3><p className="mt-3 text-black/65">{customer.emailSubscription === "Subscribed" ? "Subscribed to email marketing" : "Not subscribed to any channels"}</p></div></div></Card><EditCard title="Notes">None</EditCard></aside>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
