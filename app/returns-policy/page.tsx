import type { Metadata } from "next"

import { ShippingReturnsPolicy } from "@/components/legal/ShippingReturnsPolicy"
import { getSiteContent } from "@/lib/server/dal/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { shippingPolicy } = await getSiteContent()
  return {
    title: shippingPolicy.metaTitle || "Shipping, Returns & Exchange Policy | SUOS",
    description: shippingPolicy.metaDescription,
  }
}

export default function ReturnsPolicyPage() {
  return (
    <main className="flex-1 bg-white text-black">
      <ShippingReturnsPolicy />
    </main>
  )
}
