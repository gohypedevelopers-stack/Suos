import "server-only"

import { Prisma } from "@/generated/prisma/client"
import { assertAdmin } from "@/lib/server/dal/auth"
import { getPrisma } from "@/lib/server/db"
import type { OrderCreateInput } from "@/lib/validations/order"

export async function createOrder(input: OrderCreateInput) {
  await assertAdmin()
  const prisma = getPrisma()

  return prisma.$transaction(async (tx) => {
    const [customer, variants] = await Promise.all([
      input.customerId
        ? tx.user.findFirst({
            where: { id: input.customerId, role: "CUSTOMER" },
            select: { id: true, email: true },
          })
        : null,
      tx.productVariant.findMany({
        where: { id: { in: input.items.map((item) => item.variantId) } },
        select: {
          id: true,
          title: true,
          sku: true,
          price: true,
          product: { select: { title: true, status: true } },
        },
      }),
    ])

    if (input.customerId && !customer) {
      throw new Error("The selected customer no longer exists.")
    }
    if (variants.length !== input.items.length) {
      throw new Error("One or more selected products no longer exist.")
    }
    if (variants.some((variant) => variant.product.status === "ARCHIVED")) {
      throw new Error("Archived products cannot be added to an order.")
    }

    const variantsById = new Map(variants.map((variant) => [variant.id, variant]))
    const items = input.items.map((item) => {
      const variant = variantsById.get(item.variantId)!
      const total = variant.price.mul(item.quantity)
      return {
        variantId: variant.id,
        title:
          variant.title === "Default"
            ? variant.product.title
            : `${variant.product.title} · ${variant.title}`,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice: variant.price,
        total,
      }
    })
    const subtotal = items.reduce(
      (sum, item) => sum.plus(item.total),
      new Prisma.Decimal(0),
    )

    const order = await tx.order.create({
      data: {
        userId: customer?.id ?? null,
        email: customer?.email ?? input.email!,
        status: input.status,
        currency: "INR",
        subtotal,
        discount: new Prisma.Decimal(0),
        shipping: new Prisma.Decimal(0),
        total: subtotal,
        items: { create: items },
      },
      select: { id: true, number: true, userId: true },
    })

    return order
  })
}

export async function markOrdersPaid(orderIds: string[]) {
  await assertAdmin()
  const prisma = getPrisma()
  const updated = await prisma.order.updateMany({
    where: { id: { in: orderIds }, status: "PENDING" },
    data: { status: "CONFIRMED" },
  })

  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    select: { id: true, userId: true },
  })
  return { count: updated.count, orderIds: orders.map((order) => order.id), customerIds: orders.flatMap((order) => order.userId ? [order.userId] : []) }
}

export async function fulfillOrders(orderIds: string[]) {
  await assertAdmin()
  const prisma = getPrisma()

  return prisma.$transaction(async (tx) => {
    const orders = await tx.order.findMany({
      where: { id: { in: orderIds }, status: "CONFIRMED" },
      select: {
        id: true,
        userId: true,
        items: { select: { variantId: true, quantity: true } },
      },
    })
    const requestedByVariant = new Map<string, number>()
    for (const order of orders) {
      for (const item of order.items) {
        if (!item.variantId) continue
        requestedByVariant.set(
          item.variantId,
          (requestedByVariant.get(item.variantId) ?? 0) + item.quantity,
        )
      }
    }
    for (const [variantId, quantity] of requestedByVariant) {
      const updated = await tx.productVariant.updateMany({
        where: { id: variantId, inventoryQuantity: { gte: quantity } },
        data: { inventoryQuantity: { decrement: quantity } },
      })

      if (updated.count !== 1) {
        throw new Error("One or more order items no longer have enough inventory to fulfill.")
      }
    }
    await tx.order.updateMany({
      where: { id: { in: orders.map((order) => order.id) } },
      data: { status: "FULFILLED" },
    })

    return {
      count: orders.length,
      orderIds: orders.map((order) => order.id),
      customerIds: orders.flatMap((order) => order.userId ? [order.userId] : []),
    }
  })
}

export async function cancelOrders(orderIds: string[]) {
  await assertAdmin()
  const prisma = getPrisma()
  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds }, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { id: true, userId: true },
  })
  const updated = await prisma.order.updateMany({
    where: { id: { in: orders.map((order) => order.id) } },
    data: { status: "CANCELLED" },
  })

  return {
    count: updated.count,
    orderIds: orders.map((order) => order.id),
    customerIds: orders.flatMap((order) => order.userId ? [order.userId] : []),
  }
}
