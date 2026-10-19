import type { ReactNode } from "react"

import { CollectionGrid, type EditorialImage } from "@/components/collection/CollectionGrid"
import { CollectionHeader } from "@/components/collection/CollectionHeader"
import type { SortValue } from "@/components/collection/productSort"
import type { ProductCard } from "@/components/home/TrendingSection"

/** Header (title, count, sort, filters) + product grid, shared by collection and shop pages. */
export function ProductListing({
  id,
  title,
  description,
  products,
  sort,
  editorialImages,
  emptyState,
}: {
  id?: string
  title: string
  description?: string | null
  products: ProductCard[]
  sort?: SortValue
  editorialImages?: EditorialImage[]
  emptyState?: ReactNode
}) {
  return (
    <section id={id} className="w-full scroll-mt-24 bg-white pb-14 pt-8 text-black sm:pb-16 md:pt-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <CollectionHeader
          title={title}
          description={description}
          itemCount={products.length}
          sort={sort}
        />
      </div>

      <div className="mt-6 px-4 sm:mt-8 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <CollectionGrid
            // Remount on sort change so pagination resets.
            key={sort ?? "featured"}
            products={products}
            editorialImages={editorialImages}
          />
        ) : (
          emptyState
        )}
      </div>
    </section>
  )
}

export function buildEditorialImages(
  products: ProductCard[],
  extra: EditorialImage[] = [],
  max = 6,
): EditorialImage[] {
  const seen = new Set<string>()
  const images: EditorialImage[] = []
  const add = (image: EditorialImage) => {
    if (!image.src || seen.has(image.src) || images.length >= max) return
    seen.add(image.src)
    images.push(image)
  }

  // Secondary gallery shots read as editorial; primary shots are already in the grid.
  for (const product of products) {
    const src = product.gallery?.[1]
    if (src && src !== product.image) {
      add({ src, alt: product.alt || product.title, href: `/products/${product.slug}` })
    }
  }
  extra.forEach(add)

  return images
}
