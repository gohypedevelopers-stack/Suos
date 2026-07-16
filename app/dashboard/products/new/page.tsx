import type { Metadata } from "next"
import {
  AlignLeft,
  Bold,
  Boxes,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Code2,
  ImageIcon,
  Info,
  Italic,
  Link as LinkIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  SlidersHorizontal,
  Tag,
  Table2,
  Underline,
  Video,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
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

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-lg bg-black/[0.07] px-2.5 py-1.5 text-sm text-black/65", className)}>{children}</span>
}

function DisclosureFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between border-t border-black/10 px-4 py-2.5">{children}<ChevronDown className="size-4 text-black/55" /></div>
}

function DescriptionEditor() {
  return (
    <div className="overflow-hidden rounded-lg border border-black/30">
      <div className="flex h-9 items-center gap-3 border-b border-black/10 bg-black/[0.025] px-3 text-black/60">
        <Sparkles className="size-4" />
        <span className="border-r border-black/15 pr-4 text-xs">Paragraph <ChevronDown className="ml-1 inline size-3" /></span>
        <Bold className="size-4" />
        <Italic className="size-4" />
        <Underline className="size-4" />
        <span className="border-r border-black/15 pr-3"><AlignLeft className="size-4" /></span>
        <LinkIcon className="size-4" />
        <ImageIcon className="size-4" />
        <Video className="size-4" />
        <Table2 className="size-4" />
        <MoreHorizontal className="size-4" />
        <Code2 className="ml-auto size-4" />
      </div>
      <div aria-label="Product description" contentEditable className="h-36 outline-none" role="textbox" />
    </div>
  )
}

function ProductDetailsCard() {
  return (
    <Card title="">
      <div className="space-y-4 px-4 pb-4">
        <label className="grid gap-1.5 text-sm text-black/75">
          <span>Title</span>
          <input className={inputClass} defaultValue="Short sleeve t-shirt" />
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
              <button type="button" className="font-medium hover:underline">Select existing</button>
            </div>
            <span className="text-xs text-black/55">Accepts images, videos, or 3D models</span>
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
      <div className="px-4 pb-4">
        <label className="relative block w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/65">₹</span>
          <input aria-label="Price" defaultValue="0.00" className={`${inputClass} pl-7`} />
        </label>
      </div>
      <DisclosureFooter>
        <div className="flex flex-wrap gap-2"><Pill>Compare-at</Pill><Pill>Unit price</Pill><Pill>Charge tax <b>Yes</b></Pill><Pill>Cost per item</Pill></div>
      </DisclosureFooter>
    </Card>
  )
}

function InventoryCard() {
  return (
    <Card title="Inventory" className="mt-4" actions={<span className="flex items-center gap-2 text-xs text-black/55">Inventory tracked <span className="inline-flex h-4 w-8 items-center rounded-full bg-black p-0.5"><span className="size-3 rounded-full bg-white" /></span></span>}>
      <div className="mx-4 overflow-hidden rounded-lg border border-black/10">
        <div className="grid grid-cols-[1fr_140px] bg-black/[0.025] px-3 py-2 text-xs font-medium text-[#0c3152]"><span>Quantity</span><span className="text-right">Quantity</span></div>
        <div className="grid grid-cols-[1fr_140px] items-center px-3 py-2 text-sm"><span>Chukkuwala</span><input aria-label="Quantity" defaultValue="0" className={inputClass} /></div>
      </div>
      <DisclosureFooter><div className="flex gap-2"><Pill>SKU</Pill><Pill>Barcode</Pill><Pill>Sell when out of stock <b>Off</b></Pill></div></DisclosureFooter>
    </Card>
  )
}

function ShippingCard() {
  return (
    <Card title="Shipping" className="mt-4" actions={<span className="flex items-center gap-2 text-xs text-black/55">Physical product <span className="inline-flex h-4 w-8 items-center rounded-full bg-black p-0.5"><span className="size-3 rounded-full bg-white" /></span></span>}>
      <div className="grid gap-4 px-4 pb-4 sm:grid-cols-[minmax(0,1fr)_170px]">
        <label className="grid gap-1.5 text-sm text-black/75"><span>Package <Info className="inline size-3.5 text-black/55" /></span><SelectField value="Store default • Sample box - 22 × 13.7 × 4.2 cm, 0 kg" /></label>
        <label className="grid gap-1.5 text-sm text-black/75"><span>Product weight</span><div className="flex gap-2"><input aria-label="Product weight" defaultValue="0.0" className={inputClass} /><SelectField value="kg" /></div></label>
      </div>
      <DisclosureFooter><div className="flex gap-2"><Pill>Country of origin</Pill><Pill>HS Code</Pill></div></DisclosureFooter>
    </Card>
  )
}

function ProductMetafieldsCard() {
  const fields = ["Bundle", "ORIGIN", "Materials", "Fabric Weight", "Shipping", "Size Chart JSON"]
  return (
    <Card title="Product metafields" className="mt-4" actions={<button type="button" className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium">Add definition</button>}>
      <div className="space-y-2 px-4 pb-4">
        {fields.map((field) => <label key={field} className="grid grid-cols-[180px_1fr] items-center gap-3 text-sm text-black/75"><span>{field}</span><input aria-label={field} className={inputClass} /></label>)}
      </div>
      <DisclosureFooter><Pill><Plus className="size-3.5" /> Disclosures</Pill></DisclosureFooter>
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
                  <ShippingCard />
                  <Card title="Variants" className="mt-4"><button type="button" className="flex items-center gap-1 px-4 pb-5 text-sm font-medium"><Plus className="size-4" /> Add options like size or color</button></Card>
                  <ProductMetafieldsCard />
                  <Card title="Search engine listing" className="mt-4" actions={<Pencil className="size-4 text-black/55" />}><p className="px-4 pb-5 text-sm text-black/65">Add a title and description to see how this product might appear in a search engine listing</p></Card>
                </div>

                <aside className="space-y-4">
                  <Card title="Status"><div className="px-4 pb-4"><SelectField value="Active" /></div></Card>
                  <Card title="Publishing" actions={<SlidersHorizontal className="size-4 text-black/55" />}><div className="px-4 pb-4"><p className="flex items-center gap-2 text-sm text-black/75"><Boxes className="size-4" />All channels</p></div></Card>
                  <Card title="Product organization" actions={<Info className="size-4 text-black/55" />}><div className="space-y-4 px-4 pb-4"><SelectField label="Type" value="None" /><SelectField label="Vendor" value="None" /><label className="grid gap-1.5 text-sm text-black/75"><span>Collections</span><div className="flex h-9 items-center rounded-lg border border-black/25 px-1.5"><Pill className="h-6 px-2 py-0"><CirclePlus className="size-3" />Add collections</Pill></div></label><label className="grid gap-1.5 text-sm text-black/75"><span>Tags</span><div className="flex h-9 items-center rounded-lg border border-black/25 px-1.5"><Pill className="h-6 px-2 py-0"><CirclePlus className="size-3" />Add tags</Pill></div></label></div></Card>
                  <Card title="Theme template"><div className="px-4 pb-4"><SelectField value="Default product" /></div></Card>
                </aside>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
