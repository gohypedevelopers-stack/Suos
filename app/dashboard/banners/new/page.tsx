import { Suspense } from "react"
import type { Metadata } from "next"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { BannerEditor } from "@/components/admin-dashboard/banner-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Add Banner | SUOS Admin",
  description: "Create and publish a new homepage banner.",
}

export default function NewBannerPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <Suspense fallback={<div className="p-8 text-xs text-neutral-500">Loading banner editor...</div>}>
            <BannerEditor />
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
