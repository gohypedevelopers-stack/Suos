"use client"

import { usePathname } from "next/navigation"

import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { cn } from "@/lib/utils"

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/")
  const isAuthenticationRoute =
    pathname === "/signin" ||
    pathname.startsWith("/signin/") ||
    pathname === "/login" ||
    pathname.startsWith("/login/")

  return (
    <>
      {isAdminDashboard ? null : <SiteHeader />}
      <div
        className={cn(
          "flex flex-1 flex-col",
          !isAdminDashboard && "pt-[var(--header-stack-height)]"
        )}
      >
        {children}
      </div>
      {isAdminDashboard || isAuthenticationRoute ? null : <SiteFooter />}
    </>
  )
}
