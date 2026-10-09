"use server"

import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { z } from "zod"

import { formatOrderReference } from "@/lib/checkout-rules"
import { notifyOrderEvent } from "@/lib/server/notifications"
import { CheckoutError, placeStorefrontOrder } from "@/lib/server/services/checkout"
import { checkoutInputSchema } from "@/lib/validations/checkout"

export type PlaceOrderResult =
  | { success: true; orderId: string; number: number; reference: string; total: number }
  | { success: false; message: string }

export async function placeOrderAction(input: unknown): Promise<PlaceOrderResult> {
  const result = checkoutInputSchema.safeParse(input)
  if (!result.success) {
    const flat = z.flattenError(result.error)
    const firstField = Object.values(flat.fieldErrors).flat().find(Boolean)
    return {
      success: false,
      message: flat.formErrors[0] ?? firstField ?? "Check your shipping details and try again.",
    }
  }

  try {
    const order = await placeStorefrontOrder(result.data)

    after(() => notifyOrderEvent(order.id, "ORDER_PLACED", { notifyAdmin: true }))

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/orders")
    revalidatePath("/dashboard/products/inventory")
    revalidatePath("/dashboard/orders/abandoned-checkouts")
    if (order.userId) {
      revalidatePath(`/dashboard/customers/${order.userId}`)
    }

    return {
      success: true,
      orderId: order.id,
      number: order.number,
      reference: formatOrderReference(order.number),
      total: order.total,
    }
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { success: false, message: error.message }
    }
    console.error("[checkout] placeOrderAction failed", error)
    return {
      success: false,
      message: "We couldn’t place your order right now. Please try again in a moment.",
    }
  }
}
