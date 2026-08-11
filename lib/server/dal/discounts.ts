import "server-only"

import { assertAdmin } from "@/lib/server/dal/auth"
import { getPrisma } from "@/lib/server/db"

export type AdminDiscountListItem = {
  id: string
  title: string
  code: string | null
  type: "PRODUCT" | "ORDER" | "BUY_X_GET_Y" | "FREE_SHIPPING"
  method: "CODE" | "AUTOMATIC"
  status: "ACTIVE" | "INACTIVE"
  valueType: "PERCENTAGE" | "FIXED" | "FREE"
  value: number | null
  appliesTo: "ALL" | "PRODUCTS" | "COLLECTIONS"
  productCount: number
  collectionCount: number
  buyProductCount: number
  getProductCount: number
  minimumType: "NONE" | "AMOUNT" | "QUANTITY"
  minimumValue: number | null
  usageLimit: number | null
  onePerCustomer: boolean
  usageCount: number
  startsAt: string
  endsAt: string | null
}

export type AdminDiscountEditor = Omit<AdminDiscountListItem, "productCount" | "collectionCount" | "buyProductCount" | "getProductCount"> & {
  productIds: string[]
  collectionIds: string[]
  buyProductIds: string[]
  getProductIds: string[]
}

export type AdminDiscountOption = { id: string; title: string }

function mapDiscount(discount: {
  id: string
  title: string
  code: string | null
  type: AdminDiscountListItem["type"]
  method: AdminDiscountListItem["method"]
  status: AdminDiscountListItem["status"]
  valueType: AdminDiscountListItem["valueType"]
  value: { toString(): string } | null
  appliesTo: AdminDiscountListItem["appliesTo"]
  productIds: string[]
  collectionIds: string[]
  buyProductIds: string[]
  getProductIds: string[]
  minimumType: string
  minimumQuantity: number | null
  minimumAmount: { toString(): string } | null
  usageLimit: number | null
  onePerCustomer: boolean
  usageCount: number
  startsAt: Date
  endsAt: Date | null
}): AdminDiscountEditor {
  const minimumType = discount.minimumType as AdminDiscountListItem["minimumType"]
  return {
    id: discount.id,
    title: discount.title,
    code: discount.code,
    type: discount.type,
    method: discount.method,
    status: discount.status,
    valueType: discount.valueType,
    value: discount.value ? Number(discount.value) : null,
    appliesTo: discount.appliesTo,
    productIds: discount.productIds,
    collectionIds: discount.collectionIds,
    buyProductIds: discount.buyProductIds,
    getProductIds: discount.getProductIds,
    minimumType,
    minimumValue: minimumType === "QUANTITY" ? discount.minimumQuantity : discount.minimumAmount ? Number(discount.minimumAmount) : null,
    usageLimit: discount.usageLimit,
    onePerCustomer: discount.onePerCustomer,
    usageCount: discount.usageCount,
    startsAt: discount.startsAt.toISOString(),
    endsAt: discount.endsAt?.toISOString() ?? null,
  }
}

const discountSelect = {
  id: true,
  title: true,
  code: true,
  type: true,
  method: true,
  status: true,
  valueType: true,
  value: true,
  appliesTo: true,
  productIds: true,
  collectionIds: true,
  buyProductIds: true,
  getProductIds: true,
  minimumType: true,
  minimumQuantity: true,
  minimumAmount: true,
  usageLimit: true,
  onePerCustomer: true,
  usageCount: true,
  startsAt: true,
  endsAt: true,
} as const

export async function listDiscountsForAdmin(): Promise<AdminDiscountListItem[]> {
  await assertAdmin()
  const discounts = await getPrisma().discount.findMany({
    orderBy: { updatedAt: "desc" },
    select: discountSelect,
  })

  return discounts.map((discount) => {
    const mapped = mapDiscount(discount)
    return {
      ...mapped,
      productCount: mapped.productIds.length,
      collectionCount: mapped.collectionIds.length,
      buyProductCount: mapped.buyProductIds.length,
      getProductCount: mapped.getProductIds.length,
    }
  })
}

export async function getDiscountForAdmin(id: string): Promise<AdminDiscountEditor | null> {
  await assertAdmin()
  const discount = await getPrisma().discount.findUnique({ where: { id }, select: discountSelect })
  return discount ? mapDiscount(discount) : null
}

export async function listDiscountEditorOptionsForAdmin(): Promise<{
  products: AdminDiscountOption[]
  collections: AdminDiscountOption[]
}> {
  await assertAdmin()
  const prisma = getPrisma()
  const [products, collections] = await Promise.all([
    prisma.product.findMany({
      where: { status: { not: "ARCHIVED" } },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
    prisma.collection.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ])
  return { products, collections }
}
