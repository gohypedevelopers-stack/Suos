import type { Metadata } from "next"

import { ShippingReturnsPolicy } from "@/components/legal/ShippingReturnsPolicy"

export const metadata: Metadata = {
  title: "Shipping, Returns & Exchange Policy | SUOS",
  description: "SUOS shipping, return, refund, and exchange terms.",
}

export default function ReturnsPolicyPage() {
  return (
    <main className="flex-1 bg-white text-black">
      <ShippingReturnsPolicy />
    </main>
  )
}
