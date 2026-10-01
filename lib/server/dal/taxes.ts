import "server-only"

import { assertAdmin } from "@/lib/server/dal/auth"
import { getPrisma } from "@/lib/server/db"

import {
  calculateGst,
  GST_SLABS,
  INDIAN_STATES,
  type IndianStateName,
  type MonthlyGstAnalytics,
  type MonthlyGstLedgerRow,
  type TaxCalculationResult,
  type TaxSettingData,
  type TaxSlab,
} from "@/lib/taxes"

export {
  calculateGst,
  GST_SLABS,
  INDIAN_STATES,
  type IndianStateName,
  type MonthlyGstAnalytics,
  type MonthlyGstLedgerRow,
  type TaxCalculationResult,
  type TaxSettingData,
  type TaxSlab,
}

export async function getTaxSettings(): Promise<TaxSettingData> {
  const prisma = getPrisma()
  let setting = await prisma.taxSetting.findUnique({
    where: { id: "default" },
  })

  if (!setting) {
    setting = await prisma.taxSetting.create({
      data: {
        id: "default",
        originState: "Delhi",
        gstin: "07AABCS1429B1Z1",
        defaultGstRate: 12.0,
        priceInclusive: true,
        defaultHsn: "6203",
      },
    })
  }

  return {
    id: setting.id,
    originState: setting.originState,
    gstin: setting.gstin,
    defaultGstRate: Number(setting.defaultGstRate),
    priceInclusive: setting.priceInclusive,
    defaultHsn: setting.defaultHsn,
    updatedAt: setting.updatedAt.toISOString(),
  }
}

export async function updateTaxSettings(input: {
  originState?: string
  gstin?: string
  defaultGstRate?: number
  priceInclusive?: boolean
  defaultHsn?: string
}): Promise<TaxSettingData> {
  await assertAdmin()
  const prisma = getPrisma()

  const setting = await prisma.taxSetting.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      originState: input.originState ?? "Delhi",
      gstin: input.gstin ?? "",
      defaultGstRate: input.defaultGstRate ?? 12.0,
      priceInclusive: input.priceInclusive ?? true,
      defaultHsn: input.defaultHsn ?? "6203",
    },
    update: {
      ...(input.originState !== undefined && { originState: input.originState }),
      ...(input.gstin !== undefined && { gstin: input.gstin }),
      ...(input.defaultGstRate !== undefined && { defaultGstRate: input.defaultGstRate }),
      ...(input.priceInclusive !== undefined && { priceInclusive: input.priceInclusive }),
      ...(input.defaultHsn !== undefined && { defaultHsn: input.defaultHsn }),
    },
  })

  return {
    id: setting.id,
    originState: setting.originState,
    gstin: setting.gstin,
    defaultGstRate: Number(setting.defaultGstRate),
    priceInclusive: setting.priceInclusive,
    defaultHsn: setting.defaultHsn,
    updatedAt: setting.updatedAt.toISOString(),
  }
}



const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export async function getMonthlyGstAnalytics(targetYear?: number): Promise<MonthlyGstAnalytics> {
  await assertAdmin()
  const prisma = getPrisma()
  const settings = await getTaxSettings()

  const currentYear = targetYear ?? new Date().getFullYear()

  // Fetch all orders
  const orders = await prisma.order.findMany({
    where: {
      status: { not: "CANCELLED" },
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  taxRate: true,
                  hsnCode: true,
                  isTaxExempt: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Determine available years from orders
  const yearSet = new Set<number>()
  yearSet.add(new Date().getFullYear())
  for (const o of orders) {
    yearSet.add(new Date(o.createdAt).getFullYear())
  }
  const availableYears = Array.from(yearSet).sort((a, b) => b - a)

  // Initialize all 12 months for targetYear
  const monthsMap = new Map<number, MonthlyGstLedgerRow>()
  for (let m = 1; m <= 12; m++) {
    const monthKey = `${currentYear}-${String(m).padStart(2, "0")}`
    monthsMap.set(m, {
      month: m,
      monthKey,
      monthName: `${MONTH_NAMES[m - 1]} ${currentYear}`,
      year: currentYear,
      orderCount: 0,
      grossSales: 0,
      taxableSales: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalGst: 0,
      products: [],
      states: [],
    })
  }

  const productAggMap = new Map<
    string,
    {
      title: string
      hsn: string
      totalUnits: number
      taxableSales: number
      totalGst: number
      gstRate: number
    }
  >()

  let sumGross = 0
  let sumTaxable = 0
  let sumGst = 0
  let sumCgst = 0
  let sumSgst = 0
  let sumIgst = 0
  let sumOrders = 0

  for (const order of orders) {
    const oDate = new Date(order.createdAt)
    if (oDate.getFullYear() !== currentYear) continue

    const monthNum = oDate.getMonth() + 1
    const monthData = monthsMap.get(monthNum)
    if (!monthData) continue

    monthData.orderCount += 1
    sumOrders += 1

    const shippingAddr = (order.shippingAddress as Record<string, unknown> | null) ?? {}
    const destinationState =
      typeof shippingAddr.state === "string" && shippingAddr.state.trim().length > 0
        ? shippingAddr.state.trim()
        : settings.originState

    const orderSubtotal = Number(order.subtotal || order.total)

    // Calculate tax breakdown for each item in the order
    let orderTaxable = 0
    let orderGst = 0
    let orderCgst = 0
    let orderSgst = 0
    let orderIgst = 0

    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        const product = item.variant?.product
        const itemRate = product?.isTaxExempt
          ? 0
          : product?.taxRate !== null && product?.taxRate !== undefined
          ? Number(product.taxRate)
          : settings.defaultGstRate
        const hsn = product?.hsnCode ?? settings.defaultHsn
        const itemAmount = Number(item.total)

        const itemCalc = calculateGst(
          itemAmount,
          itemRate,
          settings.priceInclusive,
          settings.originState,
          destinationState
        )

        orderTaxable += itemCalc.taxableAmount
        orderGst += itemCalc.totalGst
        orderCgst += itemCalc.cgst
        orderSgst += itemCalc.sgst
        orderIgst += itemCalc.igst

        // Product in month
        const pKey = product?.id ?? item.title
        const existingP = monthData.products.find((p) => p.title === item.title)
        if (existingP) {
          existingP.quantity += item.quantity
          existingP.taxableAmount = Number((existingP.taxableAmount + itemCalc.taxableAmount).toFixed(2))
          existingP.gstAmount = Number((existingP.gstAmount + itemCalc.totalGst).toFixed(2))
        } else {
          monthData.products.push({
            id: pKey,
            title: item.title,
            hsn,
            quantity: item.quantity,
            taxableAmount: itemCalc.taxableAmount,
            gstRate: itemRate,
            gstAmount: itemCalc.totalGst,
          })
        }

        // Global product aggregation
        const existingGlobal = productAggMap.get(item.title)
        if (existingGlobal) {
          existingGlobal.totalUnits += item.quantity
          existingGlobal.taxableSales = Number((existingGlobal.taxableSales + itemCalc.taxableAmount).toFixed(2))
          existingGlobal.totalGst = Number((existingGlobal.totalGst + itemCalc.totalGst).toFixed(2))
        } else {
          productAggMap.set(item.title, {
            title: item.title,
            hsn,
            totalUnits: item.quantity,
            taxableSales: itemCalc.taxableAmount,
            totalGst: itemCalc.totalGst,
            gstRate: itemRate,
          })
        }
      }
    } else {
      // Fallback for orders without item details
      const fallbackCalc = calculateGst(
        orderSubtotal,
        settings.defaultGstRate,
        settings.priceInclusive,
        settings.originState,
        destinationState
      )
      orderTaxable = fallbackCalc.taxableAmount
      orderGst = fallbackCalc.totalGst
      orderCgst = fallbackCalc.cgst
      orderSgst = fallbackCalc.sgst
      orderIgst = fallbackCalc.igst
    }

    monthData.grossSales = Number((monthData.grossSales + orderSubtotal).toFixed(2))
    monthData.taxableSales = Number((monthData.taxableSales + orderTaxable).toFixed(2))
    monthData.cgst = Number((monthData.cgst + orderCgst).toFixed(2))
    monthData.sgst = Number((monthData.sgst + orderSgst).toFixed(2))
    monthData.igst = Number((monthData.igst + orderIgst).toFixed(2))
    monthData.totalGst = Number((monthData.totalGst + orderGst).toFixed(2))

    // State breakdown in month
    const isIntra = destinationState.toLowerCase() === settings.originState.toLowerCase()
    const existingState = monthData.states.find(
      (s) => s.state.toLowerCase() === destinationState.toLowerCase()
    )
    if (existingState) {
      existingState.orderCount += 1
      existingState.taxableAmount = Number((existingState.taxableAmount + orderTaxable).toFixed(2))
      existingState.cgst = Number((existingState.cgst + orderCgst).toFixed(2))
      existingState.sgst = Number((existingState.sgst + orderSgst).toFixed(2))
      existingState.igst = Number((existingState.igst + orderIgst).toFixed(2))
      existingState.totalGst = Number((existingState.totalGst + orderGst).toFixed(2))
    } else {
      monthData.states.push({
        state: destinationState,
        isIntraState: isIntra,
        orderCount: 1,
        taxableAmount: Number(orderTaxable.toFixed(2)),
        cgst: Number(orderCgst.toFixed(2)),
        sgst: Number(orderSgst.toFixed(2)),
        igst: Number(orderIgst.toFixed(2)),
        totalGst: Number(orderGst.toFixed(2)),
      })
    }

    sumGross += orderSubtotal
    sumTaxable += orderTaxable
    sumGst += orderGst
    sumCgst += orderCgst
    sumSgst += orderSgst
    sumIgst += orderIgst
  }

  const monthlyLedger = Array.from(monthsMap.values())
  const productSummaries = Array.from(productAggMap.values()).sort(
    (a, b) => b.totalGst - a.totalGst
  )

  return {
    year: currentYear,
    availableYears,
    summary: {
      grossSales: Number(sumGross.toFixed(2)),
      taxableSales: Number(sumTaxable.toFixed(2)),
      totalGst: Number(sumGst.toFixed(2)),
      totalCgst: Number(sumCgst.toFixed(2)),
      totalSgst: Number(sumSgst.toFixed(2)),
      totalIgst: Number(sumIgst.toFixed(2)),
      orderCount: sumOrders,
      averageGstPerOrder: sumOrders > 0 ? Number((sumGst / sumOrders).toFixed(2)) : 0,
    },
    monthlyLedger,
    productSummaries,
    settings,
  }
}
