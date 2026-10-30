"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { ProductCardView, type ProductCard } from "@/components/home/TrendingSection"

export type EditorialImage = {
  src: string
  alt: string
  href?: string
}

type GridItem =
  | { kind: "product"; product: ProductCard; row: number }
  | { kind: "editorial"; image: EditorialImage; span: 2 | 3; row: number; key: string }

/**
 * Lays products out in a 4-column (desktop) grid and interleaves wide
 * editorial tiles. One cycle (11 products) looks like:
 *   [4 products]
 *   [2 products + 2-col editorial]
 *   [3-col editorial + 1 product]
 *   [4 products]
 * Cycles repeat while editorial images remain; afterwards products flow 4 per row.
 */
function buildItems(products: ProductCard[], editorial: EditorialImage[]): GridItem[] {
  const items: GridItem[] = []
  let p = 0
  let e = 0
  let row = 0

  const pushProducts = (count: number) => {
    const end = Math.min(p + count, products.length)
    for (; p < end; p += 1) items.push({ kind: "product", product: products[p], row })
  }

  while (p < products.length) {
    const remaining = products.length - p

    if (e < editorial.length && remaining >= 6) {
      pushProducts(4)
      row += 1
      pushProducts(2)
      items.push({ kind: "editorial", image: editorial[e], span: 2, row, key: `e-${e}` })
      e += 1
      row += 1

      if (e < editorial.length && p < products.length) {
        items.push({ kind: "editorial", image: editorial[e], span: 3, row, key: `e-${e}` })
        e += 1
        pushProducts(1)
        row += 1
      }

      pushProducts(4)
      row += 1
      continue
    }

    pushProducts(4)
    row += 1
  }

  return items
}

export function CollectionGrid({
  products = [],
  editorialImages = [],
  pageSize = 16,
}: {
  products?: ProductCard[]
  editorialImages?: EditorialImage[]
  pageSize?: number
}) {
  const items = useMemo(
    () => buildItems(products, editorialImages.filter((image) => image.src)),
    [products, editorialImages],
  )
  const [visibleProducts, setVisibleProducts] = useState(pageSize)

  // Reveal whole rows only, so a page never ends with a dangling editorial tile.
  const productItems = items.filter((item) => item.kind === "product")
  const lastVisibleRow =
    productItems[Math.min(visibleProducts, productItems.length) - 1]?.row ?? -1
  const visibleItems = items.filter((item) => item.row <= lastVisibleRow)
  const shownCount = visibleItems.filter((item) => item.kind === "product").length
  const hasMore = shownCount < products.length

  return (
    <div>
      <div className="reveal-stagger grid grid-cols-2 gap-0.5 lg:grid-cols-4">
        {visibleItems.map((item) =>
          item.kind === "product" ? (
            <div key={item.product.id} className="min-w-0">
              <ProductCardView product={item.product} />
            </div>
          ) : (
            <EditorialTile key={item.key} image={item.image} span={item.span} />
          ),
        )}
      </div>

      {hasMore ? (
        <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12">
          <p className="text-[12px] uppercase leading-[1.4] tracking-[0.04em] text-black/55 sm:text-[13px]">
            Showing {shownCount} of {products.length}
          </p>
          <button
            type="button"
            onClick={() => setVisibleProducts(shownCount + pageSize)}
            className="inline-flex h-10 min-w-[160px] items-center justify-center border border-black px-8 text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:text-[14px]"
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  )
}

function EditorialTile({ image, span }: { image: EditorialImage; span: 2 | 3 }) {
  const className = `relative col-span-2 aspect-[4/3] overflow-hidden bg-[#e7e7e4] lg:aspect-auto ${
    span === 3 ? "lg:col-span-3" : "lg:col-span-2"
  }`
  const sizes = span === 3 ? "(max-width: 1024px) 100vw, 75vw" : "(max-width: 1024px) 100vw, 50vw"
  const img = (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
    />
  )

  if (image.href) {
    return (
      <Link href={image.href} className={`group block ${className}`} aria-label={image.alt}>
        {img}
      </Link>
    )
  }

  return (
    <div className={className}>
      {img}
    </div>
  )
}
