import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { CategoryEditor } from "@/components/admin-dashboard/category-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { defaultProductCategories } from "@/lib/product-categories"

export const metadata: Metadata = { title: "Edit category | SUOS Admin" }

export default async function EditCategoryPage({ params }: PageProps<"/dashboard/products/categories/[categoryId]">) {
  const { categoryId } = await params
  const category = defaultProductCategories.find((item) => item.id === categoryId)

  if (!category) notFound()

  return <TooltipProvider><SidebarProvider className="min-h-svh"><AppSidebar /><SidebarInset><CategoryEditor category={category} /></SidebarInset></SidebarProvider></TooltipProvider>
}
