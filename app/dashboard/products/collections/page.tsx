import type { Metadata } from "next"
import Image from "next/image"
import {
  ChevronsUpDown,
  Columns3,
  Link2,
  Plus,
  Search,
} from "lucide-react"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Collections | SUOS Admin",
  description: "Manage product collections in the SUOS admin dashboard.",
}

const collections = [
  ["SHOES", "product1.png", "110"],
  ["T-SHIRTS", "product2.png", "13"],
  ["CLOTHING", "product3.png", "31"],
  ["SANDALS", "product4.png", "37"],
  ["LOAFERS", "product5.png", "22"],
  ["BOOTS", "product6.png", "12"],
  ["MORE FROM EVRYDAE", "product7.png", "6"],
  ["NEW DROP", "product8.png", "13"],
  ["BEST SELLERS", "product9.png", "13"],
  ["JEANS", "product10.png", "2"],
  ["TROUSERS", "product11.png", "8"],
  ["KOREAN LOWERS", "product12.png", "5"],
  ["POLOS", "product13.png", "3"],
  ["SNEAKERS", "product14.png", "42"],
] as const

export default function CollectionsPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <Link2 className="size-4" />
                Collections
              </h1>

              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80"
              >
                <Plus className="size-3.5" />
                Add collection
              </button>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium"
                >
                  All
                  <ChevronsUpDown className="size-3.5" />
                </button>

                <label className="flex min-w-52 flex-1 items-center gap-2 text-sm text-black/50">
                  <Search className="size-4" />
                  <input
                    aria-label="Search and filter collections"
                    placeholder="Search and filter"
                    className="w-full bg-transparent outline-none placeholder:text-black/45"
                  />
                </label>

                <button
                  type="button"
                  aria-label="Choose collection columns"
                  className="rounded-md border-l border-black/10 pl-3 text-black/55 hover:text-black"
                >
                  <Columns3 className="size-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-left text-xs">
                  <thead className="bg-black/[0.025] text-black/65">
                    <tr>
                      <th className="w-12 border-b border-black/10 px-3 py-2.5 font-medium">
                        <input type="checkbox" aria-label="Select all collections" />
                      </th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">Title</th>
                      <th className="w-20 border-b border-black/10 px-3 py-2.5 font-medium">Products</th>
                      <th className="border-b border-black/10 px-3 py-2.5 font-medium">Product conditions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map(([title, image, products]) => (
                      <tr key={title} className="hover:bg-black/[0.02]">
                        <td className="border-b border-black/10 px-3 py-2.5">
                          <input type="checkbox" aria-label={`Select ${title}`} />
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5">
                          <div className="flex items-center gap-3 font-medium text-[#0c3152]">
                            <Image
                              src={`/images/products/${image}`}
                              alt=""
                              width={40}
                              height={40}
                              className="size-10 rounded-lg border border-black/10 object-cover"
                            />
                            {title}
                          </div>
                        </td>
                        <td className="border-b border-black/10 px-3 py-2.5">{products}</td>
                        <td className="border-b border-black/10 px-3 py-2.5" />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
