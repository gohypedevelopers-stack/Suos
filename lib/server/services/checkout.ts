import "server-only"

import { Prisma } from "@/generated/prisma/client"
import { automaticDiscountFor, SHIPPING_METHODS } from "@/lib/checkout-rules"
import { markRecordingConverted } from "@/lib/server/analytics/recordings"
import { getCurrentUser } from "@/lib/server/dal/auth"
import { calculateGst } from "@/lib/server/dal/taxes"
import { getPrisma } from "@/lib/server/db"
import { clearUserCart, resolveCartLines } from "@/lib/server/services/cart"
import type { CheckoutInput } from "@/lib/validations/checkout"

export class CheckoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CheckoutError"
  }
}

type CodeDiscount = {
  id: string
  code: string
  amount: number
  freeShipping: boolean
}

async function resolvePromoCode(
  tx: Prisma.TransactionClient,
  code: string | undefined,
  subtotal: number,
  quantity: number,
): Promise<CodeDiscount | null> {
  if (!code || !code.trim()) return null

  const trimmed = code.trim()
  const now = new Date()
  const discount = await tx.discount.findFirst({
    where: {
      code: { equals: trimmed, mode: "insensitive" },
      method: "CODE",
      status: "ACTIVE",
      startsAt: { lte: now },
      OR: [{ endsAt: null }, { endsAt: { gt: now } }],
    },
    select: {
      id: true,
      code: true,
      type: true,
      valueType: true,
      value: true,
      appliesTo: true,
      minimumType: true,
      minimumAmount: true,
      minimumQuantity: true,
      usageLimit: true,
      usageCount: true,
    },
  })

  if (!discount || !discount.code) return null
  if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) return null
  if (discount.minimumType === "AMOUNT" && discount.minimumAmount && subtotal < Number(discount.minimumAmount)) {
    return null
  }
  if (discount.minimumType === "QUANTITY" && discount.minimumQuantity && quantity < discount.minimumQuantity) {
    return null
  }

  if (discount.type === "FREE_SHIPPING") {
    return { id: discount.id, code: discount.code, amount: 0, freeShipping: true }
  }

  // Product/collection-scoped and buy-x-get-y codes need line-level rules that
  // the storefront UI does not surface yet; only order-wide codes apply here.
  if (discount.type === "BUY_X_GET_Y" || discount.appliesTo !== "ALL") {
    return null
  }

  const value = discount.value ? Number(discount.value) : 0
  let amount = 0
  if (discount.valueType === "PERCENTAGE") {
    amount = Math.round((subtotal * value) / 100)
  } else if (discount.valueType === "FIXED") {
    amount = Math.min(subtotal, Math.round(value))
  }

  return { id: discount.id, code: discount.code, amount, freeShipping: false }
}

export type PromoValidationResult =
  | {
      valid: true
      id: string
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
      valid: false
      message: string
    }

export async function verifyPromoCode(
  rawCode: string | undefined,
  subtotal: number,
  quantity: number,
): Promise<PromoValidationResult> {
  const code = rawCode?.trim()
  if (!code) {
    return { valid: false, message: "Please enter a promo code." }
  }

  const prisma = getPrisma()
  const discount = await prisma.discount.findFirst({
    where: {
      code: { equals: code, mode: "insensitive" },
      method: "CODE",
    },
    select: {
      id: true,
      title: true,
      code: true,
      status: true,
      type: true,
      valueType: true,
      value: true,
      appliesTo: true,
      minimumType: true,
      minimumAmount: true,
      minimumQuantity: true,
      usageLimit: true,
      usageCount: true,
      startsAt: true,
      endsAt: true,
    },
  })

  if (!discount || !discount.code) {
    return { valid: false, message: `Promo code "${code}" is not valid.` }
  }

  if (discount.status !== "ACTIVE") {
    return { valid: false, message: `Promo code "${code}" is inactive.` }
  }

  const now = new Date()
  if (discount.startsAt && discount.startsAt > now) {
    return { valid: false, message: `Promo code "${code}" is not active yet.` }
  }

  if (discount.endsAt && discount.endsAt <= now) {
    return { valid: false, message: `Promo code "${code}" has expired.` }
  }

  if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
    return { valid: false, message: `Promo code "${code}" usage limit has been reached.` }
  }

  if (discount.minimumType === "AMOUNT" && discount.minimumAmount && subtotal < Number(discount.minimumAmount)) {
    return {
      valid: false,
      message: `Minimum order of ₹${Number(discount.minimumAmount).toLocaleString("en-IN")} required for this code.`,
    }
  }

  if (discount.minimumType === "QUANTITY" && discount.minimumQuantity && quantity < discount.minimumQuantity) {
    return {
      valid: false,
      message: `Minimum of ${discount.minimumQuantity} item${discount.minimumQuantity > 1 ? "s" : ""} required for this code.`,
    }
  }

  if (discount.type === "BUY_X_GET_Y") {
    return { valid: false, message: "Buy X Get Y discounts cannot be applied at checkout directly." }
  }

  if (discount.appliesTo !== "ALL") {
    return { valid: false, message: "This discount code applies only to selected items." }
  }

  if (discount.type === "FREE_SHIPPING") {
    return {
      valid: true,
      id: discount.id,
      code: discount.code,
      title: discount.title,
      amount: 0,
      freeShipping: true,
      discountType: discount.type,
      valueType: discount.valueType,
      value: 0,
      description: "Free shipping applied",
    }
  }

  const value = discount.value ? Number(discount.value) : 0
  let amount = 0
  let description = ""

  if (discount.valueType === "PERCENTAGE") {
    amount = Math.round((subtotal * value) / 100)
    description = `${value}% off applied (-₹${amount.toLocaleString("en-IN")})`
  } else if (discount.valueType === "FIXED") {
    amount = Math.min(subtotal, Math.round(value))
    description = `₹${value.toLocaleString("en-IN")} off applied (-₹${amount.toLocaleString("en-IN")})`
  }

  return {
    valid: true,
    id: discount.id,
    code: discount.code,
    title: discount.title,
    amount,
    freeShipping: false,
    discountType: discount.type,
    valueType: discount.valueType,
    value,
    description,
  }
}

export type PlacedOrder = {
  id: string
  number: number
  userId: string | null
  email: string
  total: number
}

export type PlaceOrderOptions = {
  status?: "PENDING" | "CONFIRMED"
  paymentMethod?: string
  paymentDetails?: {
    razorpayOrderId?: string
    razorpayPaymentId?: string
    razorpaySignature?: string
    paidAt?: string
  }
}

/**
 * Turns a storefront checkout submission into a real order. Prices, tax,
 * discounts and stock are all resolved from the database inside one
 * transaction; the client-supplied totals are ignored.
 */
export async function placeStorefrontOrder(
  input: CheckoutInput,
  options?: PlaceOrderOptions,
): Promise<PlacedOrder> {
  const user = await getCurrentUser()
  const prisma = getPrisma()

  const placed = await prisma.$transaction(async (tx) => {
    const [lines, taxSetting] = await Promise.all([
      resolveCartLines(tx, input.items),
      tx.taxSetting.findFirst(),
    ])

    for (const line of lines) {
      if (!line.product || !line.variant) {
        throw new CheckoutError(line.reason ?? "An item in your bag is no longer available.")
      }
      if (line.product.status !== "ACTIVE") {
        throw new CheckoutError(`${line.product.title} is no longer available.`)
      }
    }

    // Merge duplicate variant lines and check stock once per SKU.
    const merged = new Map<string, { line: (typeof lines)[number]; quantity: number }>()
    for (const line of lines) {
      const key = line.variant!.id
      const existing = merged.get(key)
      if (existing) {
        existing.quantity += line.input.quantity
      } else {
        merged.set(key, { line, quantity: line.input.quantity })
      }
    }

    for (const { line, quantity } of merged.values()) {
      if (line.variant!.inventoryQuantity < quantity) {
        const left = line.variant!.inventoryQuantity
        throw new CheckoutError(
          left > 0
            ? `Only ${left} left of ${line.product!.title}${line.input.size ? ` (size ${line.input.size})` : ""}.`
            : `${line.product!.title}${line.input.size ? ` (size ${line.input.size})` : ""} just sold out.`,
        )
      }
    }

    const originState = taxSetting?.originState ?? "Delhi"
    const defaultRate = taxSetting?.defaultGstRate ? Number(taxSetting.defaultGstRate) : 12
    const defaultHsn = taxSetting?.defaultHsn ?? "6203"
    const priceInclusive = taxSetting?.priceInclusive ?? true

    const subtotal = [...merged.values()].reduce(
      (sum, { line, quantity }) => sum + Number(line.variant!.price) * quantity,
      0,
    )
    const totalQuantity = [...merged.values()].reduce((sum, { quantity }) => sum + quantity, 0)

    const promo = await resolvePromoCode(tx, input.promoCode, subtotal, totalQuantity)
    const promoDiscount = promo?.amount ?? 0
    const automatic = promo ? 0 : automaticDiscountFor(subtotal)
    const discount = promo ? promoDiscount : automatic
    const discountSource = promo ?? null

    const shippingRule = SHIPPING_METHODS[input.shippingMethod]
    const shipping = promo?.freeShipping ? 0 : shippingRule.price
    const total = Math.max(0, subtotal - discount + shipping)

    // Spread the discount across lines so GST is computed on what was paid.
    const factor = subtotal > 0 ? (subtotal - discount) / subtotal : 1

    let tax = 0
    let cgst = 0
    let sgst = 0
    let igst = 0

    const items = [...merged.values()].map(({ line, quantity }) => {
      const variant = line.variant!
      const product = line.product!
      const lineTotal = Number(variant.price) * quantity
      const taxable = Number((lineTotal * factor).toFixed(2))
      const rate = product.isTaxExempt
        ? 0
        : product.taxRate !== null && product.taxRate !== undefined
          ? Number(product.taxRate)
          : defaultRate
      const gst = calculateGst(taxable, rate, priceInclusive, originState, input.state)
      tax += gst.totalGst
      cgst += gst.cgst
      sgst += gst.sgst
      igst += gst.igst

      return {
        variantId: variant.id,
        title:
          variant.title === "Default"
            ? product.title
            : `${product.title} · ${variant.title}`,
        sku: variant.sku,
        quantity,
        unitPrice: variant.price,
        total: new Prisma.Decimal(lineTotal),
        taxRate: new Prisma.Decimal(rate),
        tax: new Prisma.Decimal(gst.totalGst),
        hsnCode: product.hsnCode || defaultHsn,
      }
    })

    const customerName = `${input.firstName} ${input.lastName}`.trim()
    const shippingAddress = {
      name: customerName,
      address1: input.address1,
      address2: input.address2 || undefined,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      country: input.country,
      phone: input.phone,
    }

    const customerUser =
      user ??
      (await tx.user.findFirst({
        where: { email: { equals: input.email.trim(), mode: "insensitive" } },
        select: { id: true },
      }))

    const order = await tx.order.create({
      data: {
        userId: customerUser?.id ?? null,
        email: input.email,
        phone: input.phone,
        status: options?.status ?? "PENDING",
        source: "STOREFRONT",
        currency: "INR",
        subtotal: new Prisma.Decimal(subtotal),
        discount: new Prisma.Decimal(discount),
        shipping: new Prisma.Decimal(shipping),
        tax: new Prisma.Decimal(tax.toFixed(2)),
        cgst: new Prisma.Decimal(cgst.toFixed(2)),
        sgst: new Prisma.Decimal(sgst.toFixed(2)),
        igst: new Prisma.Decimal(igst.toFixed(2)),
        total: new Prisma.Decimal(total),
        taxDetails: {
          originState,
          destinationState: input.state,
          priceInclusive,
          automaticDiscount: automatic,
          codeDiscount: promo?.amount ?? 0,
          payment: options?.paymentDetails ?? null,
        },
        shippingAddress,
        paymentMethod: options?.paymentMethod ?? input.paymentMethod,
        shippingMethod: shippingRule.label,
        discountCode: discountSource?.code ?? (promo?.freeShipping ? promo.code : null),
        customerNote: input.giftMessage || null,
        analyticsSessionId: input.analyticsSessionId ?? null,
        items: { create: items },
      },
      select: { id: true, number: true, userId: true, email: true, total: true },
    })

    // Reserve stock now; fulfilment skips the decrement for STOREFRONT orders.
    for (const { line, quantity } of merged.values()) {
      const updated = await tx.productVariant.updateMany({
        where: { id: line.variant!.id, inventoryQuantity: { gte: quantity } },
        data: { inventoryQuantity: { decrement: quantity } },
      })
      if (updated.count !== 1) {
        throw new CheckoutError(`${line.product!.title} just sold out. Please update your bag.`)
      }
    }

    if (discountSource || promo?.freeShipping) {
      await tx.discount.update({
        where: { id: promo!.id },
        data: { usageCount: { increment: 1 } },
      })
    }

    if (user) {
      await clearUserCart(tx, user.id)
      await tx.user.update({
        where: { id: user.id },
        data: {
          ...(user.phone ? {} : { phone: input.phone }),
          ...(input.newsletter ? { emailMarketingSubscribed: true } : {}),
        },
      })
    }

    return order
  })

  if (input.analyticsSessionId) {
    await markRecordingConverted(input.analyticsSessionId, placed.id)
    try {
      await prisma.analyticsSession.update({
        where: { id: input.analyticsSessionId },
        data: {
          converted: true,
          orderId: placed.id,
          userId: placed.userId ?? undefined,
          lastSeenAt: new Date(),
          events: {
            create: {
              type: "PURCHASE",
              path: "/checkout",
              name: placed.id,
              payload: { orderNumber: placed.number, total: Number(placed.total) },
            },
          },
        },
      })
    } catch {
      // The session may not exist if tracking was blocked; the order still stands.
    }
  }

  return {
    id: placed.id,
    number: placed.number,
    userId: placed.userId,
    email: placed.email,
    total: Number(placed.total),
  }
}

export type CheckoutSummary = {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
}

/**
 * Validates inventory, prices, promos, shipping and GST without placing an order.
 * Used to verify amounts before initiating payment via Razorpay.
 */
export async function calculateCheckoutSummary(
  input: CheckoutInput,
): Promise<CheckoutSummary> {
  const prisma = getPrisma()

  return prisma.$transaction(async (tx) => {
    const [lines, taxSetting] = await Promise.all([
      resolveCartLines(tx, input.items),
      tx.taxSetting.findFirst(),
    ])

    for (const line of lines) {
      if (!line.product || !line.variant) {
        throw new CheckoutError(line.reason ?? "An item in your bag is no longer available.")
      }
      if (line.product.status !== "ACTIVE") {
        throw new CheckoutError(`${line.product.title} is no longer available.`)
      }
    }

    const merged = new Map<string, { line: (typeof lines)[number]; quantity: number }>()
    for (const line of lines) {
      const key = line.variant!.id
      const existing = merged.get(key)
      if (existing) {
        existing.quantity += line.input.quantity
      } else {
        merged.set(key, { line, quantity: line.input.quantity })
      }
    }

    for (const { line, quantity } of merged.values()) {
      if (line.variant!.inventoryQuantity < quantity) {
        const left = line.variant!.inventoryQuantity
        throw new CheckoutError(
          left > 0
            ? `Only ${left} left of ${line.product!.title}${line.input.size ? ` (size ${line.input.size})` : ""}.`
            : `${line.product!.title}${line.input.size ? ` (size ${line.input.size})` : ""} just sold out.`,
        )
      }
    }

    const originState = taxSetting?.originState ?? "Delhi"
    const defaultRate = taxSetting?.defaultGstRate ? Number(taxSetting.defaultGstRate) : 12
    const priceInclusive = taxSetting?.priceInclusive ?? true

    const subtotal = [...merged.values()].reduce(
      (sum, { line, quantity }) => sum + Number(line.variant!.price) * quantity,
      0,
    )
    const totalQuantity = [...merged.values()].reduce((sum, { quantity }) => sum + quantity, 0)

    const promo = await resolvePromoCode(tx, input.promoCode, subtotal, totalQuantity)
    const promoDiscount = promo?.amount ?? 0
    const automatic = promo ? 0 : automaticDiscountFor(subtotal)
    const discount = promo ? promoDiscount : automatic

    const shippingRule = SHIPPING_METHODS[input.shippingMethod]
    const shipping = promo?.freeShipping ? 0 : shippingRule.price
    const total = Math.max(0, subtotal - discount + shipping)

    const factor = subtotal > 0 ? (subtotal - discount) / subtotal : 1
    let tax = 0
    for (const { line, quantity } of merged.values()) {
      const variant = line.variant!
      const product = line.product!
      const lineTotal = Number(variant.price) * quantity
      const taxable = Number((lineTotal * factor).toFixed(2))
      const rate = product.isTaxExempt
        ? 0
        : product.taxRate !== null && product.taxRate !== undefined
          ? Number(product.taxRate)
          : defaultRate
      const gst = calculateGst(taxable, rate, priceInclusive, originState, input.state)
      tax += gst.totalGst
    }

    return {
      subtotal,
      discount,
      shipping,
      tax: Number(tax.toFixed(2)),
      total,
    }
  })
}
