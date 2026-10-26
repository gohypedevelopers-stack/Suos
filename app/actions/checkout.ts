"use server"

import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { z } from "zod"

import { formatOrderReference } from "@/lib/checkout-rules"
import { notifyOrderEvent } from "@/lib/server/notifications"
import {
  calculateCheckoutSummary,
  CheckoutError,
  placeStorefrontOrder,
  verifyPromoCode,
} from "@/lib/server/services/checkout"
import {
  createRazorpayOrder,
  getRazorpayKeyId,
  verifyPaymentSignature,
} from "@/lib/server/services/razorpay"
import {
  checkoutInputSchema,
  razorpayConfirmationSchema,
} from "@/lib/validations/checkout"

export type PlaceOrderResult =
  | { success: true; orderId: string; number: number; reference: string; total: number }
  | { success: false; message: string }

export type CreateRazorpayOrderResult =
  | {
      success: true
      razorpayOrderId: string
      amount: number
      currency: string
      keyId: string
      total: number
    }
  | {
      success: false
      message: string
    }

export type ValidatePromoCodeActionResult =
  | {
      success: true
      code: string
      title: string
      amount: number
      freeShipping: boolean
      discountType: string
      valueType: string
      value: number
      description: string
    }
  | {
      success: false
      message: string
    }

/**
 * Validates a promo code against active database discounts and returns the
 * calculated deduction for the current bag subtotal and quantity.
 */
export async function validatePromoCodeAction(
  code: string,
  subtotal: number,
  quantity: number,
): Promise<ValidatePromoCodeActionResult> {
  try {
    const result = await verifyPromoCode(code, subtotal, quantity)
    if (!result.valid) {
      return { success: false, message: result.message }
    }
    return {
      success: true,
      code: result.code,
      title: result.title,
      amount: result.amount,
      freeShipping: result.freeShipping,
      discountType: result.discountType,
      valueType: result.valueType,
      value: result.value,
      description: result.description,
    }
  } catch (error) {
    console.error("[checkout] validatePromoCodeAction failed", error)
    return {
      success: false,
      message: "Unable to validate coupon code. Please try again.",
    }
  }
}

/**
 * Validates the checkout payload, calculates total server-side, and generates
 * a Razorpay Order ID to initiate client checkout.
 */
export async function createRazorpayOrderAction(
  input: unknown,
): Promise<CreateRazorpayOrderResult> {
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
    const summary = await calculateCheckoutSummary(result.data)

    if (summary.total <= 0) {
      return {
        success: false,
        message: "Order amount must be greater than zero.",
      }
    }

    const keyId = getRazorpayKeyId()
    const rzpOrder = await createRazorpayOrder({
      amountInRupees: summary.total,
      receipt: `suos_${Date.now()}`,
      notes: {
        email: result.data.email,
        phone: result.data.phone,
        customer: `${result.data.firstName} ${result.data.lastName}`.trim(),
      },
    })

    return {
      success: true,
      razorpayOrderId: rzpOrder.id,
      amount: Number(rzpOrder.amount),
      currency: rzpOrder.currency,
      keyId,
      total: summary.total,
    }
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { success: false, message: error.message }
    }
    console.error("[checkout] createRazorpayOrderAction failed", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to initiate payment with Razorpay. Please try again.",
    }
  }
}

/**
 * Verifies Razorpay payment signature and confirms the order atomically.
 */
export async function confirmRazorpayOrderAction(
  input: unknown,
): Promise<PlaceOrderResult> {
  const result = razorpayConfirmationSchema.safeParse(input)
  if (!result.success) {
    const flat = z.flattenError(result.error)
    const firstField = Object.values(flat.fieldErrors).flat().find(Boolean)
    return {
      success: false,
      message: flat.formErrors[0] ?? firstField ?? "Invalid payment confirmation details.",
    }
  }

  try {
    const isSignatureValid = verifyPaymentSignature({
      razorpayOrderId: result.data.razorpayOrderId,
      razorpayPaymentId: result.data.razorpayPaymentId,
      razorpaySignature: result.data.razorpaySignature,
    })

    if (!isSignatureValid) {
      console.error("[checkout] Invalid Razorpay signature", {
        orderId: result.data.razorpayOrderId,
        paymentId: result.data.razorpayPaymentId,
      })
      return {
        success: false,
        message: "Payment verification failed. Please contact SUOS support.",
      }
    }

    const order = await placeStorefrontOrder(result.data, {
      status: "CONFIRMED",
      paymentMethod: "RAZORPAY",
      paymentDetails: {
        razorpayOrderId: result.data.razorpayOrderId,
        razorpayPaymentId: result.data.razorpayPaymentId,
        razorpaySignature: result.data.razorpaySignature,
        paidAt: new Date().toISOString(),
      },
    })

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
    console.error("[checkout] confirmRazorpayOrderAction failed", error)
    return {
      success: false,
      message: "We couldn’t confirm your order right now. Please contact support.",
    }
  }
}

/**
 * Places non-gateway or COD orders directly.
 */
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
    const isFree = result.data.paymentMethod.toUpperCase() === "FREE_PROMO"
    const isCod = result.data.paymentMethod.toLowerCase() === "cod"
    const order = await placeStorefrontOrder(result.data, {
      status: isFree ? "CONFIRMED" : "PENDING",
      paymentMethod: isFree ? "FREE_PROMO" : isCod ? "COD" : result.data.paymentMethod,
    })

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
