import "server-only"

import type { Prisma } from "@/generated/prisma/client"
import { getPrisma } from "@/lib/server/db"
import type { CheckoutItemInput } from "@/lib/validations/checkout"

type VariantRow = {
  id: string
  title: string
  sku: string
  price: Prisma.Decimal
  inventoryQuantity: number
  optionValues: Prisma.JsonValue | null
}

export type ResolvedCartLine = {
  input: CheckoutItemInput
  product: {
    id: string
    title: string
    status: "DRAFT" | "ACTIVE" | "ARCHIVED"
    taxRate: Prisma.Decimal | null
    hsnCode: string | null
    isTaxExempt: boolean
  } | null
  variant: VariantRow | null
  reason?: string
}

function sizeOf(optionValues: Prisma.JsonValue | null): string | null {
  if (!optionValues || typeof optionValues !== "object" || Array.isArray(optionValues)) {
    return null
  }
  for (const [key, value] of Object.entries(optionValues as Record<string, unknown>)) {
    if (key.toLowerCase() !== "size") continue
    if (typeof value === "string") return value.trim().toUpperCase()
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>
      const candidate = record.value ?? record.name ?? record.label
      if (typeof candidate === "string") return candidate.trim().toUpperCase()
    }
  }
  return null
}

/**
 * Maps storefront cart lines (product id + size label) onto concrete variants.
 * The storefront only knows product ids and size labels, so this is the single
 * place that decides which SKU a shopper actually bought.
 */
export async function resolveCartLines(
  tx: Prisma.TransactionClient,
  items: CheckoutItemInput[],
): Promise<ResolvedCartLine[]> {
  const productIds = [...new Set(items.map((item) => item.productId))]
  const products = await tx.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      title: true,
      status: true,
      taxRate: true,
      hsnCode: true,
      isTaxExempt: true,
      variants: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          sku: true,
          price: true,
          inventoryQuantity: true,
          optionValues: true,
        },
      },
    },
  })
  const productsById = new Map(products.map((product) => [product.id, product]))

  return items.map((input) => {
    const product = productsById.get(input.productId)
    if (!product) {
      return { input, product: null, variant: null, reason: "This product is no longer available." }
    }

    const wanted = input.size.trim().toUpperCase()
    const sized = product.variants.filter((variant) => sizeOf(variant.optionValues) !== null)

    let variant: VariantRow | undefined
    if (sized.length === 0) {
      variant = product.variants[0]
    } else {
      variant = sized.find((candidate) => sizeOf(candidate.optionValues) === wanted)
      if (!variant && !wanted) {
        variant = sized[0]
      }
    }

    const { variants: _variants, ...productInfo } = product
    void _variants

    if (!variant) {
      return {
        input,
        product: productInfo,
        variant: null,
        reason: `Size ${wanted || "selected"} is no longer available for ${product.title}.`,
      }
    }

    return { input, product: productInfo, variant }
  })
}

/**
 * Mirrors a signed-in shopper's browser cart into the database so the
 * dashboard's abandoned-checkout view reflects real carts.
 */
export async function syncUserCart(userId: string, items: CheckoutItemInput[]) {
  const prisma = getPrisma()

  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: { userId },
      create: { userId },
      update: { updatedAt: new Date() },
      select: { id: true },
    })

    const lines = await resolveCartLines(tx, items)
    const quantities = new Map<string, number>()
    for (const line of lines) {
      if (!line.variant || line.product?.status !== "ACTIVE") continue
      quantities.set(line.variant.id, (quantities.get(line.variant.id) ?? 0) + line.input.quantity)
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
    if (quantities.size) {
      await tx.cartItem.createMany({
        data: [...quantities].map(([variantId, quantity]) => ({
          cartId: cart.id,
          variantId,
          quantity: Math.min(quantity, 20),
        })),
      })
    }

    return { cartId: cart.id, lineCount: quantities.size }
  })
}

export async function clearUserCart(tx: Prisma.TransactionClient, userId: string) {
  const cart = await tx.cart.findUnique({ where: { userId }, select: { id: true } })
  if (cart) {
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
  }
}
