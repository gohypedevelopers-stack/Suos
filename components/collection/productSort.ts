import type { ProductCard } from "@/components/home/TrendingSection"

export const sortOptions = [
  { value: "featured", label: "FEATURED" },
  { value: "bestseller", label: "BESTSELLER" },
  { value: "newest", label: "NEWEST" },
  { value: "price-asc", label: "PRICE: LOW TO HIGH" },
  { value: "price-desc", label: "PRICE: HIGH TO LOW" },
] as const

export type SortValue = (typeof sortOptions)[number]["value"]

export function parseSort(value: string | string[] | undefined): SortValue {
  const raw = Array.isArray(value) ? value[0] : value
  return sortOptions.find((option) => option.value === raw)?.value ?? "featured"
}

function priceValue(price: string | null | undefined) {
  if (!price) return Number.POSITIVE_INFINITY
  const parsed = Number.parseFloat(price.replace(/[^0-9.]/g, ""))
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY
}

/**
 * Sorts product cards. `newestOrder` is a list of product ids ordered newest
 * first (e.g. from `listPublishedProducts()`); without it the incoming order is
 * treated as newest first.
 */
export function sortProducts<T extends ProductCard>(
  products: T[],
  sort: SortValue,
  newestOrder?: string[],
): T[] {
  const indexed = products.map((product, index) => ({ product, index }))

  switch (sort) {
    case "bestseller":
      indexed.sort((a, b) => {
        const aBest = a.product.badge === "BESTSELLER" ? 0 : 1
        const bBest = b.product.badge === "BESTSELLER" ? 0 : 1
        return aBest - bBest || a.index - b.index
      })
      break
    case "newest": {
      if (newestOrder) {
        const rank = new Map(newestOrder.map((id, index) => [id, index]))
        indexed.sort(
          (a, b) =>
            (rank.get(a.product.id) ?? Number.MAX_SAFE_INTEGER) -
              (rank.get(b.product.id) ?? Number.MAX_SAFE_INTEGER) || a.index - b.index,
        )
      }
      break
    }
    case "price-asc":
      indexed.sort(
        (a, b) => priceValue(a.product.price) - priceValue(b.product.price) || a.index - b.index,
      )
      break
    case "price-desc":
      indexed.sort((a, b) => {
        const aPrice = priceValue(a.product.price)
        const bPrice = priceValue(b.product.price)
        // Unpriced items go last in both directions.
        const aSafe = Number.isFinite(aPrice) ? aPrice : -1
        const bSafe = Number.isFinite(bPrice) ? bPrice : -1
        return bSafe - aSafe || a.index - b.index
      })
      break
    default:
      break
  }

  return indexed.map(({ product }) => product)
}
