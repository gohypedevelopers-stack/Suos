import type { Metadata } from "next"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { TaxesManager } from "@/components/admin-dashboard/taxes-manager"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getMonthlyGstAnalytics } from "@/lib/server/dal/taxes"

export const metadata: Metadata = {
  title: "Taxes & GST | SUOS Admin",
  description: "Manage GST & IGST prices, origin state, and monitor monthly tax generation.",
}

export default async function TaxesPage() {
  const analytics = await getMonthlyGstAnalytics()

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <TaxesManager initialAnalytics={analytics} />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
