import type { Metadata } from "next"

import { AmountOffProductsEditor } from "@/components/admin-dashboard/amount-off-products-editor"
import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Create discount | SUOS Admin",
  description: "Create an amount-off-products discount for SUOS.",
}

export default function CreateDiscountPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset><AmountOffProductsEditor /></SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
