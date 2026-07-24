import type { Metadata } from "next"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { CategoryEditor } from "@/components/admin-dashboard/category-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = { title: "Add category | SUOS Admin" }

export default function NewCategoryPage() {
  return <TooltipProvider><SidebarProvider className="min-h-svh"><AppSidebar /><SidebarInset><CategoryEditor /></SidebarInset></SidebarProvider></TooltipProvider>
}
