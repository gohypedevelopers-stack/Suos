import type { Metadata } from "next"
import {
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Pencil,
  Tag,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { ProductAdditionalDetailsSection } from "@/components/admin-dashboard/product-additional-details-section"
import { ProductVariantsSection } from "@/components/admin-dashboard/product-variants-section"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Add product | SUOS Admin",
  description: "Create a new product in the SUOS admin dashboard.",
}

const inputClass = "h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none focus:border-black/50"
const selectClass = `${inputClass} appearance-none pr-8`

function Card({
  title,
  children,
  actions,
  className = "",
}: {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <section className={`overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <h2 className="text-sm font-semibold text-black/75">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  )
}

function SelectField({ value, label }: { value: string; label?: string }) {
  return (
    <label className="grid gap-1.5 text-sm text-black/75">
      {label && <span>{label}</span>}
      <span className="relative">
        <select aria-label={label ?? value} defaultValue={value} className={selectClass}>
          <option>{value}</option>
          <option>None</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-black/45" />
      </span>
    </label>
  )
}

function StatusSelect() {
  return (
    <Select defaultValue="active">
      <SelectTrigger aria-label="Status" className="w-full rounded-lg border-black/25 bg-white shadow-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="draft">Draft</SelectItem>
      </SelectContent>
    </Select>
  )
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-lg bg-black/[0.07] px-2.5 py-1.5 text-sm text-black/65", className)}>{children}</span>
}

function DescriptionEditor() {
  return (
    <div className="rounded-lg border border-black/30">
      <div
        aria-label="Product description"
        contentEditable
        data-placeholder="Write a product description"
        className="h-36 p-3 text-sm outline-none empty:before:pointer-events-none empty:before:content-[attr(data-placeholder)] empty:before:text-black/40"
        role="textbox"
      />
    </div>
  )
}

function ProductDetailsCard() {
  return (
    <Card title="">
      <div className="space-y-4 px-4 pb-4">
        <label className="grid gap-1.5 text-sm text-black/75">
          <span>Title</span>
          <input className={inputClass} placeholder="Short sleeve t-shirt" />
        </label>

        <div className="grid gap-1.5 text-sm text-black/75">
          <span>Description</span>
          <DescriptionEditor />
        </div>

        <div className="grid gap-1.5 text-sm text-black/75">
          <span>Media</span>
          <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-black/35 text-center">
            <div className="flex items-center gap-3 text-sm">
              <button type="button" className="rounded-lg border border-black/15 px-3 py-1.5 font-medium hover:bg-black/[0.03]">Upload new</button>
            </div>
            <span className="text-xs text-black/55">Accepts images and videos</span>
          </div>
        </div>

        <label className="grid gap-1.5 text-sm text-black/75">
          <span>Category</span>
          <SelectField value="Choose a product category" />
          <span className="text-xs text-black/60">Determines tax rates and adds metafields to improve search, filters, and cross-channel sales</span>
        </label>
      </div>
    </Card>
  )
}

function PricingCard() {
  return (
    <Card title="Price" className="mt-4">
      <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-black/75">
          <span>Price</span>
          <span className="relative block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/65">₹</span>
            <input aria-label="Price" defaultValue="0.00" className={`${inputClass} pl-7`} />
          </span>
        </label>
        <label className="grid gap-1.5 text-sm text-black/75">
          <span>Compare-at price</span>
          <span className="relative block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/65">₹</span>
            <input aria-label="Compare-at price" placeholder="0.00" className={`${inputClass} pl-7`} />
          </span>
        </label>
      </div>
    </Card>
  )
}

function InventoryCard() {
  return (
    <Card title="Inventory" className="mt-4">
      <div className="px-4 pb-4">
        <label className="grid gap-1.5 text-sm text-black/75">
          <span>Quantity</span>
          <input aria-label="Quantity" placeholder="0" className={inputClass} />
        </label>
      </div>
    </Card>
  )
}

export default function AddProductPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="mx-auto max-w-[968px]">
              <div className="flex items-center justify-between gap-3">
                <h1 className="flex items-center gap-2 text-lg font-semibold"><Tag className="size-4" /><ChevronRight className="size-4 text-black/45" />Add product</h1>
                <button type="button" disabled className="rounded-lg bg-black/15 px-5 py-2 text-sm font-medium text-white">Save</button>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_318px]">
                <div>
                  <ProductDetailsCard />
                  <PricingCard />
                  <InventoryCard />
                  <ProductVariantsSection />
                  <ProductAdditionalDetailsSection />
                  <Card title="Search engine listing" className="mt-4" actions={<Pencil className="size-4 text-black/55" />}><p className="px-4 pb-5 text-sm text-black/65">Add a title and description to see how this product might appear in a search engine listing</p></Card>
                </div>

                <aside className="space-y-4">
                  <Card title="Status"><div className="px-4 pb-4"><StatusSelect /></div></Card>
                  <Card title="Product organization"><div className="space-y-4 px-4 pb-4"><label className="grid gap-1.5 text-sm text-black/75"><span>Collections</span><div className="flex h-9 items-center rounded-lg border border-black/25 px-1.5"><Pill className="h-6 px-2 py-0"><CirclePlus className="size-3" />Add collections</Pill></div></label><label className="grid gap-1.5 text-sm text-black/75"><span>Tags</span><div className="flex h-9 items-center rounded-lg border border-black/25 px-1.5"><Pill className="h-6 px-2 py-0"><CirclePlus className="size-3" />Add tags</Pill></div></label></div></Card>
                </aside>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
