"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ChevronRight,
  CirclePlus,
  FolderTree,
  ImagePlus,
  Search,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  defaultProductCategories,
  type ProductCategory,
} from "@/lib/product-categories"

const inputClass =
  "h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none focus:border-black/50"

type CatalogProduct = {
  id: string
  title: string
  sku: string
  price: string
  image: string
}

const catalogProducts: CatalogProduct[] = [
  { id: "jean-01", title: "High Rise Straight Jeans", sku: "SUOS-W-101", price: "₹2,999", image: "product1.png" },
  { id: "dress-01", title: "Satin Slip Dress", sku: "SUOS-W-116", price: "₹3,499", image: "product2.png" },
  { id: "top-01", title: "Ribbed Essential Top", sku: "SUOS-W-122", price: "₹1,499", image: "product3.png" },
  { id: "jacket-01", title: "Oversized Denim Jacket", sku: "SUOS-W-134", price: "₹4,299", image: "product4.png" },
  { id: "shirt-01", title: "Relaxed Cotton Shirt", sku: "SUOS-M-208", price: "₹2,299", image: "product5.png" },
  { id: "jean-02", title: "Utility Carpenter Jeans", sku: "SUOS-M-214", price: "₹3,199", image: "product6.png" },
  { id: "tee-01", title: "Heavyweight Logo Tee", sku: "SUOS-M-221", price: "₹1,799", image: "product7.png" },
  { id: "bag-01", title: "Mini Shoulder Bag", sku: "SUOS-A-302", price: "₹2,599", image: "product8.png" },
]

const categoryProductIds: Record<string, string[]> = {
  women: ["jean-01", "dress-01", "top-01", "jacket-01"],
  men: ["shirt-01", "jean-02", "tee-01"],
  jeans: ["jean-01", "jean-02", "jacket-01"],
  "t-shirts": ["tee-01", "top-01"],
  dresses: ["dress-01"],
  accessories: ["bag-01"],
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <h2 className="text-sm font-semibold text-black/75">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function CategoryEditor({ category }: { category?: ProductCategory }) {
  const isNew = !category
  const [title, setTitle] = useState(category?.title ?? "")
  const [slug, setSlug] = useState(category?.slug ?? "")
  const [parentId, setParentId] = useState(category?.parentId ?? "")
  const [visible, setVisible] = useState(category?.visible ?? true)
  const [status, setStatus] = useState(category?.visible === false ? "draft" : "active")
  const [saved, setSaved] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [productQuery, setProductQuery] = useState("")
  const [assignedProductIds, setAssignedProductIds] = useState(
    () => (category ? categoryProductIds[category.id] ?? [] : [])
  )
  const [draftProductIds, setDraftProductIds] = useState<string[]>([])

  const assignedProducts = catalogProducts.filter((product) =>
    assignedProductIds.includes(product.id)
  )
  const pickerProducts = catalogProducts.filter((product) =>
    product.title.toLowerCase().includes(productQuery.trim().toLowerCase())
  )

  const openPicker = () => {
    setDraftProductIds(assignedProductIds)
    setProductQuery("")
    setPickerOpen(true)
  }

  const toggleDraftProduct = (productId: string) => {
    setDraftProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    )
  }

  return (
    <main className="min-h-full bg-[#f5f5f5] p-4 text-black sm:p-5">
      <div className="mx-auto max-w-[968px]">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="flex items-center gap-1.5 text-lg font-semibold">
            <FolderTree className="size-4" />
            <ChevronRight className="size-4 text-black/45" />
            {isNew ? "Add category" : "Edit category"}
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/products/categories" className="inline-flex h-8 items-center rounded-lg bg-black/[0.06] px-3 text-xs font-medium transition hover:bg-black/10">Discard</Link>
            <button type="button" disabled={!title.trim()} onClick={() => setSaved(true)} className="inline-flex h-8 items-center rounded-lg bg-black px-3 text-xs font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/15">{saved ? "Saved" : "Save"}</button>
          </div>
        </header>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_318px]">
          <div className="space-y-4">
            <SectionCard title="Category information">
              <div className="space-y-4 px-4 pb-4">
                <label className="grid gap-1.5 text-sm text-black/75"><span>Title</span><input value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false) }} placeholder="e.g. Denim" className={inputClass} /></label>
                <label className="grid gap-1.5 text-sm text-black/75"><span>Description</span><textarea rows={6} placeholder="Describe this category for customers and search engines" className="w-full resize-none rounded-lg border border-black/25 bg-white p-3 text-sm outline-none focus:border-black/50" /></label>
                <div className="grid gap-1.5 text-sm text-black/75"><span>Category image</span><button type="button" className="flex h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-black/35 text-sm text-black/65 transition hover:bg-black/[0.02]"><ImagePlus className="size-4" /><span>Upload image</span></button><span className="text-xs text-black/55">Shown in category cards and storefront navigation.</span></div>
              </div>
            </SectionCard>

            <SectionCard
              title="Products"
              action={<button type="button" onClick={openPicker} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white transition hover:bg-black/80"><CirclePlus className="size-3.5" />Add products</button>}
            >
              <div className="border-t border-black/10">
                <div className="flex items-center justify-between px-4 py-3 text-xs text-black/60"><span>{assignedProducts.length} products currently assigned</span>{!isNew && category ? <span>{category.productCount} total products</span> : null}</div>
                {assignedProducts.length ? <div className="divide-y divide-black/10">{assignedProducts.map((product) => <div key={product.id} className="flex items-center gap-3 px-4 py-3"><Image src={`/images/products/${product.image}`} alt="" width={44} height={44} className="size-11 rounded-lg border border-black/10 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.title}</p><p className="mt-0.5 text-xs text-black/55">{product.sku} · {product.price}</p></div><button type="button" onClick={() => { setAssignedProductIds((current) => current.filter((id) => id !== product.id)); setSaved(false) }} className="rounded-md px-2 py-1 text-xs font-medium text-black/55 transition hover:bg-red-50 hover:text-red-600">Remove</button></div>)}</div> : <div className="px-4 py-10 text-center"><p className="text-sm font-medium">No products added yet</p><p className="mt-1 text-xs text-black/55">Add products to make this category available to customers.</p></div>}
              </div>
            </SectionCard>

            <SectionCard title="Search engine listing"><div className="space-y-4 px-4 pb-4"><label className="grid gap-1.5 text-sm text-black/75"><span>URL handle</span><span className="flex h-9 items-center overflow-hidden rounded-lg border border-black/25 bg-white focus-within:border-black/50"><span className="border-r border-black/10 px-3 text-sm text-black/45">/categories/</span><input value={slug} onChange={(event) => { setSlug(event.target.value); setSaved(false) }} placeholder={slugify(title) || "denim"} className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" /></span></label><p className="text-xs text-black/55">A clear handle makes the category easier to find and share.</p></div></SectionCard>
          </div>

          <aside className="space-y-4">
            <SectionCard title="Status"><div className="px-4 pb-4"><Select value={status} onValueChange={(value) => { setStatus(value); setSaved(false) }}><SelectTrigger className="w-full rounded-lg border-black/25 !bg-white text-black shadow-none"><SelectValue /></SelectTrigger><SelectContent position="popper" className="bg-white text-black"><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent></Select></div></SectionCard>
            <SectionCard title="Category organization"><div className="space-y-4 px-4 pb-4"><div className="grid gap-1.5 text-sm text-black/75"><span>Parent category</span><Select value={parentId || "root"} onValueChange={(value) => { setParentId(value === "root" ? "" : value); setSaved(false) }}><SelectTrigger className="w-full rounded-lg border-black/25 !bg-white text-black shadow-none"><SelectValue /></SelectTrigger><SelectContent position="popper" className="bg-white text-black"><SelectItem value="root">No parent category</SelectItem>{defaultProductCategories.filter((option) => option.id !== category?.id).map((option) => <SelectItem key={option.id} value={option.id}>{option.title}</SelectItem>)}</SelectContent></Select></div><label className="flex items-center justify-between gap-3 rounded-lg border border-black/10 px-3 py-2.5 text-sm"><span><span className="block font-medium">Store visibility</span><span className="mt-0.5 block text-xs text-black/55">Customers can browse this category.</span></span><Switch checked={visible} onCheckedChange={(checked) => { setVisible(checked); setSaved(false) }} aria-label="Toggle store visibility" /></label></div></SectionCard>
            <SectionCard title="Category summary"><div className="space-y-3 px-4 pb-4 text-sm"><div className="flex items-center justify-between"><span className="text-black/60">Products added</span><span className="font-semibold">{assignedProducts.length}</span></div><div className="flex items-center justify-between"><span className="text-black/60">Storefront</span><span className="font-medium">{visible ? "Visible" : "Hidden"}</span></div><div className="flex items-center justify-between"><span className="text-black/60">Status</span><span className="font-medium capitalize">{status}</span></div></div></SectionCard>
          </aside>
        </div>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:!w-[620px] sm:!max-w-[620px]" overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-[1px]">
          <DialogHeader className="border-b border-black/10 px-5 py-4"><DialogTitle className="text-base font-semibold">Add products</DialogTitle><DialogDescription>Select the products that belong to this category.</DialogDescription></DialogHeader>
          <div className="border-b border-black/10 p-4"><label className="flex h-9 items-center gap-2 rounded-lg border border-black/20 bg-white px-3 text-sm text-black/55 focus-within:border-black/50"><Search className="size-4" /><input autoFocus value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="Search products" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/40" /></label></div>
          <div className="max-h-[380px] overflow-y-auto">{pickerProducts.map((product) => <label key={product.id} className="flex cursor-pointer items-center gap-3 border-b border-black/[0.08] px-4 py-2.5 transition hover:bg-black/[0.025]"><input type="checkbox" checked={draftProductIds.includes(product.id)} onChange={() => toggleDraftProduct(product.id)} className="size-4 rounded accent-black" /><Image src={`/images/products/${product.image}`} alt="" width={40} height={40} className="size-10 rounded-lg border border-black/10 object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{product.title}</span><span className="mt-0.5 block text-xs text-black/55">{product.sku} · {product.price}</span></span></label>)}</div>
          <DialogFooter className="flex-row items-center justify-between border-t border-black/10 px-4 py-3 sm:justify-between"><span className="text-xs text-black/55">{draftProductIds.length} selected</span><div className="flex gap-2"><button type="button" onClick={() => setPickerOpen(false)} className="h-8 rounded-lg border border-black/15 px-3 text-sm font-medium hover:bg-black/[0.03]">Cancel</button><button type="button" onClick={() => { setAssignedProductIds(draftProductIds); setPickerOpen(false); setSaved(false) }} className="h-8 rounded-lg bg-black px-3 text-sm font-medium text-white hover:bg-black/80">Add products</button></div></DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
