import type { ReactNode } from "react"

import { requireAdmin } from "@/lib/server/dal/auth"

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await requireAdmin()

  return children
}
