export type TaxSettingData = {
  id: string
  originState: string
  gstin: string
  defaultGstRate: number
  priceInclusive: boolean
  defaultHsn: string
  updatedAt: string
}

export type TaxSlab = {
  rate: number
  label: string
  description: string
  categoryExamples: string
}

export const GST_SLABS: TaxSlab[] = [
  {
    rate: 0,
    label: "0% (Exempt)",
    description: "Goods and services exempt from GST",
    categoryExamples: "Khadi, handloom, unbranded basic fabrics",
  },
  {
    rate: 5,
    label: "5% GST",
    description: "Concessional rate for affordable apparel",
    categoryExamples: "Apparel & garments priced up to ₹1,000",
  },
  {
    rate: 12,
    label: "12% GST (SUOS Default)",
    description: "Standard rate for premium apparel and denim",
    categoryExamples: "Denim, jeans, shirts, jackets priced above ₹1,000",
  },
  {
    rate: 18,
    label: "18% GST",
    description: "Standard rate for luxury fashion accessories",
    categoryExamples: "Footwear above ₹1,000, belts, leather accessories",
  },
  {
    rate: 28,
    label: "28% GST",
    description: "Higher rate slab for select luxury articles",
    categoryExamples: "Select luxury watches and imported hardware",
  },
]

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const

export type IndianStateName = (typeof INDIAN_STATES)[number]

export type TaxCalculationResult = {
  grossAmount: number
  taxableAmount: number
  totalGst: number
  cgst: number
  sgst: number
  igst: number
  gstRate: number
  isIntraState: boolean
  isInclusive: boolean
}

export function calculateGst(
  amount: number,
  rate: number,
  isInclusive: boolean,
  originState: string,
  destinationState?: string | null
): TaxCalculationResult {
  const normOrigin = (originState || "Delhi").trim().toLowerCase()
  const normDest = (destinationState || normOrigin).trim().toLowerCase()
  const isIntraState = normOrigin === normDest

  let grossAmount = amount
  let taxableAmount = 0
  let totalGst = 0

  if (rate <= 0) {
    taxableAmount = amount
    totalGst = 0
  } else if (isInclusive) {
    taxableAmount = Number((amount / (1 + rate / 100)).toFixed(2))
    totalGst = Number((amount - taxableAmount).toFixed(2))
  } else {
    taxableAmount = amount
    totalGst = Number((amount * (rate / 100)).toFixed(2))
    grossAmount = Number((taxableAmount + totalGst).toFixed(2))
  }

  let cgst = 0
  let sgst = 0
  let igst = 0

  if (isIntraState) {
    cgst = Number((totalGst / 2).toFixed(2))
    sgst = Number((totalGst - cgst).toFixed(2))
  } else {
    igst = totalGst
  }

  return {
    grossAmount,
    taxableAmount,
    totalGst,
    cgst,
    sgst,
    igst,
    gstRate: rate,
    isIntraState,
    isInclusive,
  }
}

export type MonthlyGstLedgerRow = {
  month: number
  monthKey: string // YYYY-MM
  monthName: string
  year: number
  orderCount: number
  grossSales: number
  taxableSales: number
  cgst: number
  sgst: number
  igst: number
  totalGst: number
  products: Array<{
    id: string
    title: string
    hsn: string
    quantity: number
    taxableAmount: number
    gstRate: number
    gstAmount: number
  }>
  states: Array<{
    state: string
    isIntraState: boolean
    orderCount: number
    taxableAmount: number
    cgst: number
    sgst: number
    igst: number
    totalGst: number
  }>
}

export type MonthlyGstAnalytics = {
  year: number
  availableYears: number[]
  summary: {
    grossSales: number
    taxableSales: number
    totalGst: number
    totalCgst: number
    totalSgst: number
    totalIgst: number
    orderCount: number
    averageGstPerOrder: number
  }
  monthlyLedger: MonthlyGstLedgerRow[]
  productSummaries: Array<{
    title: string
    hsn: string
    totalUnits: number
    taxableSales: number
    totalGst: number
    gstRate: number
  }>
  settings: TaxSettingData
}
