import type { Metadata } from "next"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { CollectionEditor } from "@/components/admin-dashboard/collection-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { listProductsForCollectionAssignment } from "@/lib/server/dal/collections"

export const metadata: Metadata = {
  title: "Add collection | SUOS Admin",
  description: "Create a product collection in the SUOS admin dashboard.",
}

export default async function AddCollectionPage() {
  const products = await listProductsForCollectionAssignment()

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset><CollectionEditor products={products} /></SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
