"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ChevronsUpDown,
  Columns3,
  FolderTree,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { defaultProductCategories } from "@/lib/product-categories"

export function CategoryManager() {
  const [categories, setCategories] = useState(defaultProductCategories)
  const [query, setQuery] = useState("")
  const visibleCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(query.trim().toLowerCase())
  )
  const parentTitle = (parentId: string | null) =>
    categories.find((category) => category.id === parentId)?.title ?? "—"

  return (
    <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <FolderTree className="size-4" />
          Categories
        </h1>
        <Link
          href="/dashboard/products/categories/new"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white transition hover:bg-black/80"
        >
          <Plus className="size-3.5" />
          Add category
        </Link>
      </div>

      <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
          <button type="button" className="inline-flex items-center gap-1 text-xs font-medium">
            All
            <ChevronsUpDown className="size-3.5" />
          </button>
          <label className="flex min-w-52 flex-1 items-center gap-2 text-sm text-black/50">
            <Search className="size-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search and filter categories"
              placeholder="Search and filter"
              className="w-full bg-transparent outline-none placeholder:text-black/45"
            />
          </label>
          <button
            type="button"
            aria-label="Choose category columns"
            className="rounded-md border-l border-black/10 pl-3 text-black/55 transition hover:text-black"
          >
            <Columns3 className="size-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-xs">
            <thead className="bg-black/[0.025] text-black/65">
              <tr>
                <th className="w-12 border-b border-black/10 px-3 py-2.5 font-medium"><input type="checkbox" aria-label="Select all categories" /></th>
                <th className="border-b border-black/10 px-3 py-2.5 font-medium">Category</th>
                <th className="border-b border-black/10 px-3 py-2.5 font-medium">Parent</th>
                <th className="w-20 border-b border-black/10 px-3 py-2.5 font-medium">Products</th>
                <th className="w-40 border-b border-black/10 px-3 py-2.5 font-medium">Store visibility</th>
                <th className="w-24 border-b border-black/10 px-3 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {visibleCategories.map((category) => (
                <tr key={category.id} className="hover:bg-black/[0.02]">
                  <td className="border-b border-black/10 px-3 py-2.5"><input type="checkbox" aria-label={`Select ${category.title}`} /></td>
                  <td className="border-b border-black/10 px-3 py-2.5">
                    <Link href={`/dashboard/products/categories/${category.id}`} className="flex items-center gap-3 font-medium text-[#0c3152] hover:underline">
                      <span className="flex size-10 items-center justify-center rounded-lg border border-black/10 bg-black/[0.04] text-xs font-semibold text-black/60">{category.title.slice(0, 1)}</span>
                      <span><span className="block">{category.title}</span><span className="mt-1 block text-[11px] font-normal text-black/45">/categories/{category.slug}</span></span>
                    </Link>
                  </td>
                  <td className="border-b border-black/10 px-3 py-2.5 text-black/65">{parentTitle(category.parentId)}</td>
                  <td className="border-b border-black/10 px-3 py-2.5 text-black/65">{category.productCount}</td>
                  <td className="border-b border-black/10 px-3 py-2.5">
                    <div className="flex items-center gap-2"><Switch checked={category.visible} onCheckedChange={(checked) => setCategories((current) => current.map((item) => item.id === category.id ? { ...item, visible: checked } : item))} aria-label={`Toggle ${category.title} visibility`} /><span className="text-black/60">{category.visible ? "Visible" : "Hidden"}</span></div>
                  </td>
                  <td className="border-b border-black/10 px-3 py-2.5">
                    <div className="flex items-center gap-1"><Link href={`/dashboard/products/categories/${category.id}`} aria-label={`Edit ${category.title}`} className="rounded-md p-1.5 text-black/50 transition hover:bg-black/[0.06] hover:text-black"><Pencil className="size-3.5" /></Link><button type="button" onClick={() => setCategories((current) => current.filter((item) => item.id !== category.id))} aria-label={`Delete ${category.title}`} className="rounded-md p-1.5 text-black/50 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="size-3.5" /></button></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleCategories.length === 0 ? <p className="px-4 py-12 text-center text-sm text-black/55">No categories match your search.</p> : null}
      </section>
    </main>
  )
}
