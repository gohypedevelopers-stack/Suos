import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { AdminOverview } from "@/components/admin-dashboard/AdminOverview"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <AdminOverview />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
