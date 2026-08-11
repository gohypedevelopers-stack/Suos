import "server-only"

import { assertAdmin } from "@/lib/server/dal/auth"
import { getPrisma } from "@/lib/server/db"

type OrderStatus = "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED"

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

export type AdminOrderListItem = {
  id: string
  number: number
  createdAt: string
  customer: { id: string; name: string } | null
  email: string
  status: OrderStatus
  currency: string
  total: number
  itemCount: number
}

export type AdminOrderMetrics = {
  orderCount: number
  itemCount: number
  returnsAmount: number
  fulfilledCount: number
  deliveredCount: number
}

export type AdminOrderDashboard = {
  orders: AdminOrderListItem[]
  metrics: AdminOrderMetrics
}

export type AdminOrderDetail = AdminOrderListItem & {
  subtotal: number
  discount: number
  shipping: number
  items: Array<{
    id: string
    title: string
    sku: string
    quantity: number
    unitPrice: number
    total: number
    variantId: string | null
  }>
}

export type AdminOrderCreateOption = {
  id: string
  productTitle: string
  title: string
  sku: string
  price: number
  inventoryQuantity: number
}

export type AdminOrderCustomerOption = {
  id: string
  name: string
  email: string
}

function mapOrder(order: {
  id: string
  number: number
  createdAt: Date
  email: string
  status: OrderStatus
  currency: string
  total: { toString(): string }
  user: { id: string; name: string } | null
  items: Array<{ quantity: number }>
}): AdminOrderListItem {
  return {
    id: order.id,
    number: order.number,
    createdAt: order.createdAt.toISOString(),
    customer: order.user,
    email: order.email,
    status: order.status,
    currency: order.currency,
    total: Number(order.total),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export async function listOrdersForAdmin(): Promise<AdminOrderDashboard> {
  await assertAdmin()
  const prisma = getPrisma()
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      createdAt: true,
      email: true,
      status: true,
      currency: true,
      total: true,
      user: { select: { id: true, name: true } },
      items: { select: { quantity: true } },
    },
  })
  const mappedOrders = orders.map(mapOrder)
  const today = startOfToday()
  const todayOrders = mappedOrders.filter(
    (order) => new Date(order.createdAt) >= today,
  )

  return {
    orders: mappedOrders,
    metrics: {
      orderCount: todayOrders.length,
      itemCount: todayOrders.reduce((sum, order) => sum + order.itemCount, 0),
      returnsAmount: 0,
      fulfilledCount: todayOrders.filter((order) => order.status === "FULFILLED").length,
      deliveredCount: todayOrders.filter((order) => order.status === "FULFILLED").length,
    },
  }
}

export async function getOrderForAdmin(
  orderId: string,
): Promise<AdminOrderDetail | null> {
  await assertAdmin()
  const prisma = getPrisma()
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      number: true,
      createdAt: true,
      email: true,
      status: true,
      currency: true,
      total: true,
      subtotal: true,
      discount: true,
      shipping: true,
      user: { select: { id: true, name: true } },
      items: {
        select: {
          id: true,
          title: true,
          sku: true,
          quantity: true,
          unitPrice: true,
          total: true,
          variantId: true,
        },
      },
    },
  })

  if (!order) return null

  return {
    ...mapOrder(order),
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    shipping: Number(order.shipping),
    items: order.items.map((item) => ({
      id: item.id,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
      variantId: item.variantId,
    })),
  }
}

export async function listOrderCreationOptionsForAdmin(): Promise<{
  variants: AdminOrderCreateOption[]
  customers: AdminOrderCustomerOption[]
}> {
  await assertAdmin()
  const prisma = getPrisma()
  const [variants, customers] = await Promise.all([
    prisma.productVariant.findMany({
      where: { product: { status: { not: "ARCHIVED" } } },
      orderBy: [{ product: { title: "asc" } }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        sku: true,
        price: true,
        inventoryQuantity: true,
        product: { select: { title: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ])

  return {
    variants: variants.map((variant) => ({
      id: variant.id,
      productTitle: variant.product.title,
      title: variant.title,
      sku: variant.sku,
      price: Number(variant.price),
      inventoryQuantity: variant.inventoryQuantity,
    })),
    customers,
  }
}
