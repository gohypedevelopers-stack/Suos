/**
 * Storefront pricing rules shared by the checkout UI and the server. The
 * server is the source of truth: it recomputes every amount from the
 * database and these rules, never from client-submitted prices.
 */

export const SHIPPING_METHODS = {
  standard: { label: "Standard", price: 0 },
  "second-day": { label: "Second Day", price: 149 },
  "next-day": { label: "Next Day", price: 299 },
} as const

export type ShippingMethodId = keyof typeof SHIPPING_METHODS

export const AUTOMATIC_DISCOUNT = {
  /** Subtotal (INR) from which the launch discount applies. */
  minimumSubtotal: 2999,
  percentage: 10,
} as const

export function automaticDiscountFor(subtotal: number) {
  return subtotal >= AUTOMATIC_DISCOUNT.minimumSubtotal
    ? Math.round((subtotal * AUTOMATIC_DISCOUNT.percentage) / 100)
    : 0
}

export function formatOrderReference(number: number) {
  return `SUOS-${String(number).padStart(5, "0")}`
}
