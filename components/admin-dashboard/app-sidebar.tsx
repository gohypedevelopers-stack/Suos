"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/components/admin-dashboard/nav-main"
import { NavUser } from "@/components/admin-dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  HomeIcon,
  BadgePercentIcon,
  InboxIcon,
  ChartNoAxesCombinedIcon,
  PackageIcon,
  UsersRoundIcon,
} from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: <InboxIcon />,
      items: [
        {
          title: "Drafts",
          url: "/dashboard/orders/drafts",
        },
        {
          title: "Abandoned checkouts",
          url: "/dashboard/orders/abandoned-checkouts",
        },
      ],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: <PackageIcon />,
      items: [
        { title: "Collections", url: "/dashboard/products/collections" },
        { title: "Inventory", url: "/dashboard/products/inventory" },
      ],
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: <UsersRoundIcon />,
    },
    {
      title: "Discounts",
      url: "/dashboard/discounts",
      icon: <BadgePercentIcon />,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: <ChartNoAxesCombinedIcon />,
      items: [
        {
          title: "Reports",
          url: "/dashboard/analytics/reports",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 group-data-[collapsible=icon]:px-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            <Image
              src="/logo.svg"
              alt="SUOS"
              width={24}
              height={24}
              className="size-5 object-contain invert"
            />
          </div>
          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">SUOS</span>
            <span className="truncate text-xs text-sidebar-foreground/65">
              Admin Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
