import type { Metadata } from "next"

import { CreateOrderClient } from "./create-order-client"

export const metadata: Metadata = {
  title: "Create order | SUOS Admin",
  description: "Create draft orders, add products, and configure payment details.",
}

export default function CreateOrderPage() {
  return <CreateOrderClient />
}
