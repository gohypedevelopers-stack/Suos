import type { Metadata } from "next"

import { CheckoutPage } from "@/components/cart/CheckoutPage"

export const metadata: Metadata = {
  title: "Checkout | SUOS",
  description: "Complete your SUOS order. Enter your shipping details and payment information.",
}

export default function Page() {
  return <CheckoutPage />
}
