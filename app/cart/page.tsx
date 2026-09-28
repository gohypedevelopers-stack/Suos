import type { Metadata } from "next"

import { ShoppingBagPage } from "@/components/cart/ShoppingBagPage"

export const metadata: Metadata = {
  title: "Shopping Bag | SUOS",
  description: "Review and manage your SUOS shopping bag before checkout.",
}

export default function CartPage() {
  return <ShoppingBagPage />
}
