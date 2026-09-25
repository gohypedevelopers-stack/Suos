import type { Metadata } from "next"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { AdminOverview } from "@/components/admin-dashboard/AdminOverview"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAdminOverviewData } from "@/lib/server/dal/overview"

export const metadata: Metadata = {
  title: "Dashboard | SUOS Admin",
  description: "SUOS store performance and management overview.",
}

export default async function Page() {
  const initialOverview = await getAdminOverviewData()

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <AdminOverview initialData={initialOverview} />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
