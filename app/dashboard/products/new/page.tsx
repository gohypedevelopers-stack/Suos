import type { Metadata } from "next"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { ProductEditor } from "@/components/admin-dashboard/product-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { listCategoryOptionsForAdmin } from "@/lib/server/dal/categories"
import { listCollectionOptionsForAdmin } from "@/lib/server/dal/products"

export const metadata: Metadata = {
  title: "Add product | SUOS Admin",
  description: "Create a new product in the SUOS admin dashboard.",
}

export default async function AddProductPage() {
  const [categories, collections] = await Promise.all([
    listCategoryOptionsForAdmin(),
    listCollectionOptionsForAdmin(),
  ])

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <ProductEditor categories={categories} collections={collections} />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
