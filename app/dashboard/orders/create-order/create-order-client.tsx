"use client"

import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  ClipboardPenLine,
  Edit3,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

const productGroups = [
  {
    name: "A1",
    variants: ["5", "6", "7", "8", "9", "10", "11", "12"],
  },
  {
    name: "A2",
    variants: ["5", "6", "7", "8"],
  },
]

function CardShell({
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
    <section className={`rounded-xl border border-black/10 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <h2 className="text-sm font-semibold text-black/75">{title}</h2>
        {actions}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </section>
  )
}

function ProductPickerModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-[18px] p-0"
        style={{
          width: "min(700px, calc(100vw - 1rem))",
          maxWidth: "none",
        }}
        overlayClassName="bg-black/35"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Select products</DialogTitle>
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 className="text-base font-semibold text-black">Select products</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close product picker"
            className="rounded-full p-1 text-black/45 hover:bg-black/5 hover:text-black"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-black/10 px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <label className="flex h-10 min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-black/20 bg-white px-3 text-sm text-black/55">
              <Search className="size-4 shrink-0" />
              <input
                aria-label="Search products"
                className="w-full bg-transparent outline-none placeholder:text-black/45"
                placeholder="Search products"
              />
            </label>
            <select
              aria-label="Search by"
              defaultValue="All"
              className="h-10 min-w-[180px] rounded-lg border border-black/20 bg-white px-3 text-sm outline-none"
            >
              <option>Search by All</option>
              <option>Search by title</option>
              <option>Search by SKU</option>
            </select>
          </div>

          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 rounded-full border border-dashed border-black/15 px-3 py-1.5 text-sm text-black/70 hover:bg-black/[0.02]"
          >
            Add filter <Plus className="size-3.5" />
          </button>
        </div>

        <div className="max-h-[44vh] overflow-y-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white text-xs text-black/60">
              <tr className="border-b border-black/10">
                <th className="w-10 border-b border-black/10 px-3 py-2.5">
                  <input type="checkbox" aria-label="Select all variants" />
                </th>
                <th className="border-b border-black/10 px-3 py-2.5 font-medium">Product</th>
                <th className="border-b border-black/10 px-3 py-2.5 font-medium">Available</th>
                <th className="border-b border-black/10 px-3 py-2.5 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody className="text-black/80">
              {productGroups.map((group) => (
                <FragmentRow key={group.name} group={group} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-black/10 px-4 py-3">
          <span className="rounded-md bg-black/5 px-3 py-2 text-sm font-medium text-black/35">
            0/500 variants selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-black/15 px-4 py-2 text-sm hover:bg-black/[0.02]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled
              className="rounded-lg bg-black/15 px-4 py-2 text-sm font-medium text-white"
            >
              Add
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AddCustomItemModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-[18px] p-0"
        style={{
          width: "min(620px, calc(100vw - 1rem))",
          maxWidth: "none",
        }}
        overlayClassName="bg-black/35"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Add custom item</DialogTitle>

        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 className="text-base font-semibold text-black">Add custom item</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close custom item modal"
            className="rounded-full p-1 text-black/45 hover:bg-black/5 hover:text-black"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-4 py-5">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_138px_138px]">
            <label className="grid gap-2">
              <span className="text-sm text-black/75">Item name</span>
              <input
                aria-label="Item name"
                className="h-10 rounded-lg border border-black/20 bg-white px-3 text-sm outline-none placeholder:text-black/35"
                placeholder=""
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-black/75">Price</span>
              <div className="flex h-10 items-center rounded-lg border border-black/20 bg-white px-3 text-sm">
                <span className="mr-2 text-black/55">₹</span>
                <input
                  aria-label="Price"
                  defaultValue="0.00"
                  className="min-w-0 w-full bg-transparent outline-none"
                />
              </div>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-black/75">Quantity</span>
              <input
                aria-label="Quantity"
                type="number"
                defaultValue={1}
                className="h-10 min-w-0 w-full rounded-lg border border-black/20 bg-white px-3 text-sm outline-none"
              />
            </label>
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex items-center gap-2 text-sm text-black/75">
              <input
                type="checkbox"
                defaultChecked
                className="size-4 rounded border-black/30 text-black"
              />
              Item is taxable
            </label>
            <label className="flex items-center gap-2 text-sm text-black/75">
              <input
                type="checkbox"
                defaultChecked
                className="size-4 rounded border-black/30 text-black"
              />
              Item is a physical product
            </label>
          </div>

          <div className="mt-5">
            <label className="grid gap-2">
              <span className="text-sm text-black/75">Item weight (optional)</span>
              <div className="flex gap-2">
                <input
                  aria-label="Item weight"
                  defaultValue="0"
                  className="h-10 w-[228px] max-w-full rounded-lg border border-black/20 bg-white px-3 text-sm outline-none"
                />
                <div className="relative">
                  <select
                    aria-label="Weight unit"
                    defaultValue="kg"
                    className="h-10 w-14 appearance-none rounded-lg border border-black/20 bg-white pl-2 pr-6 text-sm outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-black/75" />
                </div>
              </div>
            </label>
            <p className="mt-1 text-xs text-black/50">
              Used to calculate shipping rates accurately
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-black/10 px-4 py-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-black/15 px-4 py-2 text-sm hover:bg-black/[0.02]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled
            className="rounded-lg bg-black/15 px-4 py-2 text-sm font-medium text-white"
          >
            Add item
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FragmentRow({
  group,
}: {
  group: {
    name: string
    variants: string[]
  }
}) {
  return (
    <>
      <tr className="border-b border-black/10 bg-black/[0.01]">
        <td className="border-b border-black/10 px-3 py-3">
          <input type="checkbox" aria-label={`Select ${group.name}`} />
        </td>
        <td className="border-b border-black/10 px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-black/10 bg-white">
              <span className="text-[11px] font-semibold text-black/55">{group.name}</span>
            </div>
            <span className="font-medium text-black">{group.name}</span>
          </div>
        </td>
        <td className="border-b border-black/10 px-3 py-3" />
        <td className="border-b border-black/10 px-3 py-3" />
      </tr>
      {group.variants.map((variant) => (
        <tr key={`${group.name}-${variant}`} className="border-b border-black/10 hover:bg-black/[0.02]">
          <td className="border-b border-black/10 px-3 py-2.5">
            <input type="checkbox" aria-label={`Select ${group.name} variant ${variant}`} />
          </td>
          <td className="border-b border-black/10 px-3 py-2.5 pl-10 font-medium">{variant}</td>
          <td className="border-b border-black/10 px-3 py-2.5 text-black/70">10</td>
          <td className="border-b border-black/10 px-3 py-2.5 text-right font-medium">
            ₹7,999.00 INR
          </td>
        </tr>
      ))}
    </>
  )
}

export function CreateOrderClient() {
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false)
  const [isCustomItemOpen, setIsCustomItemOpen] = useState(false)

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ClipboardPenLine className="size-4" />
              <ChevronRight className="size-4 text-black/45" />
              <span>Create order</span>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-4">
                <CardShell
                  title="Products"
                  actions={
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsProductPickerOpen(true)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 px-3 text-xs font-medium hover:bg-black/[0.03]"
                      >
                        <Plus className="size-3.5" />
                        Add product
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomItemOpen(true)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 px-3 text-xs font-medium hover:bg-black/[0.03]"
                      >
                        <Plus className="size-3.5" />
                        Add custom item
                      </button>
                    </div>
                  }
                >
                  <div className="rounded-xl border border-black/10 bg-white p-5">
                    <div className="grid grid-cols-[1fr_auto] gap-3 text-sm">
                      <span>Subtotal</span>
                      <span>₹0.00</span>
                      <span className="text-black/40">Add discount</span>
                      <span className="text-black/40">—</span>
                      <span className="text-black/40">Add shipping or delivery</span>
                      <span className="text-black/40">—</span>
                      <span className="inline-flex items-center gap-1 text-black/40">
                        Estimated tax
                        <span className="inline-flex size-4 items-center justify-center rounded-full border border-black/25 text-[10px]">
                          i
                        </span>
                      </span>
                      <span className="text-black/70">Not calculated</span>
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">₹0.00</span>
                    </div>
                  </div>

                  <div className="border-t border-black/10 px-4 py-4 text-sm text-black/65">
                    Add a product to calculate total and view payment options
                  </div>
                </CardShell>
              </div>

              <aside className="space-y-4">
                <CardShell
                  title="Notes"
                  actions={
                    <button
                      type="button"
                      aria-label="Edit notes"
                      className="rounded-md p-1.5 text-black/45 hover:bg-black/[0.03]"
                    >
                      <Edit3 className="size-4" />
                    </button>
                  }
                >
                  <p className="text-sm text-black/65">No notes</p>
                </CardShell>

                <CardShell title="Customer">
                  <div className="space-y-3">
                    <label className="flex h-10 items-center gap-2 rounded-lg border border-black/20 bg-white px-3 text-sm text-black/55">
                      <Search className="size-4 shrink-0" />
                      <input
                        aria-label="Search or create a customer"
                        className="w-full bg-transparent outline-none placeholder:text-black/45"
                        placeholder="Search or create a customer"
                      />
                    </label>
                  </div>
                </CardShell>

                <CardShell
                  title="Markets"
                  actions={
                    <button
                      type="button"
                      aria-label="Manage markets"
                      className="rounded-md p-1.5 text-black/45 hover:bg-black/[0.03]"
                    >
                      <UserRound className="size-4" />
                    </button>
                  }
                >
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2 py-1 text-xs font-medium text-black/70">
                      <span className="size-3 rounded-full border border-black/30" />
                      India
                    </span>

                    <label className="grid gap-2 text-sm">
                      <span className="text-black/70">Currency</span>
                      <div className="flex h-10 items-center justify-between rounded-lg border border-black/20 bg-white px-3 text-sm text-black/75">
                        <span>Indian Rupee (INR ₹)</span>
                        <ChevronRight className="size-4 rotate-90 text-black/40" />
                      </div>
                    </label>
                  </div>
                </CardShell>

                <CardShell
                  title="Tags"
                  actions={
                    <button
                      type="button"
                      aria-label="Edit tags"
                      className="rounded-md p-1.5 text-black/45 hover:bg-black/[0.03]"
                    >
                      <Edit3 className="size-4" />
                    </button>
                  }
                >
                  <input
                    aria-label="Tags"
                    className="h-10 w-full rounded-lg border border-black/20 bg-white px-3 text-sm outline-none placeholder:text-black/35"
                    placeholder=""
                  />
                </CardShell>
              </aside>
            </div>
          </main>

          <ProductPickerModal
            open={isProductPickerOpen}
            onOpenChange={setIsProductPickerOpen}
          />
          <AddCustomItemModal
            open={isCustomItemOpen}
            onOpenChange={setIsCustomItemOpen}
          />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
