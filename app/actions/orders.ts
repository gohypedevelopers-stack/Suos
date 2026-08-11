"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import {
  cancelOrders,
  createOrder,
  fulfillOrders,
  markOrdersPaid,
} from "@/lib/server/services/orders"
import { orderCreateSchema, orderIdsSchema } from "@/lib/validations/order"

function revalidateOrderPaths(orderIds: string[], customerIds: string[] = []) {
  revalidatePath("/dashboard/orders")
  revalidatePath("/dashboard/orders/create-order")
  revalidatePath("/dashboard/products/inventory")
  revalidatePath("/dashboard/customers")
  revalidatePath("/dashboard/orders/[orderId]", "page")

  for (const orderId of new Set(orderIds)) {
    revalidatePath(`/dashboard/orders/${orderId}`)
  }
  for (const customerId of new Set(customerIds)) {
    revalidatePath(`/dashboard/customers/${customerId}`)
  }
}

function mutationError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Unauthorized") return "Sign in to continue."
    if (error.message === "Forbidden") return "Administrator access is required."
    if (
      error.message.includes("no longer exists") ||
      error.message.includes("cannot be added") ||
      error.message.includes("enough inventory")
    ) {
      return error.message
    }
  }

  return "The order could not be updated. Try again."
}

export async function createOrderAction(input: unknown) {
  const result = orderCreateSchema.safeParse(input)
  if (!result.success) {
    return {
      success: false,
      message: z.flattenError(result.error).formErrors[0] ?? "Check the order details.",
    }
  }

  try {
    const order = await createOrder(result.data)
    revalidateOrderPaths([order.id], order.userId ? [order.userId] : [])
    return { success: true, orderId: order.id, number: order.number }
  } catch (error) {
    return { success: false, message: mutationError(error) }
  }
}

async function runBulkOrderAction(
  input: unknown,
  mutation: (orderIds: string[]) => Promise<{
    count: number
    orderIds: string[]
    customerIds: string[]
  }>,
) {
  const result = orderIdsSchema.safeParse(input)
  if (!result.success) {
    return { success: false, message: "Select at least one order." }
  }

  try {
    const updated = await mutation([...new Set(result.data)])
    if (!updated.count) {
      return { success: false, message: "No selected orders are eligible for this action." }
    }
    revalidateOrderPaths(updated.orderIds, updated.customerIds)
    return { success: true, count: updated.count }
  } catch (error) {
    return { success: false, message: mutationError(error) }
  }
}

export async function markOrdersPaidAction(input: unknown) {
  return runBulkOrderAction(input, markOrdersPaid)
}

export async function fulfillOrdersAction(input: unknown) {
  return runBulkOrderAction(input, fulfillOrders)
}

export async function cancelOrdersAction(input: unknown) {
  return runBulkOrderAction(input, cancelOrders)
}
