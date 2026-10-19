import { CollectionFilters } from "@/components/collection/CollectionFilters"
import { CollectionSortDropdown } from "@/components/collection/CollectionSortDropdown"
import type { SortValue } from "@/components/collection/productSort"

export function CollectionHeader({
  title = "Men's Clothing",
  itemCount,
  description,
  sort,
}: {
  title?: string
  itemCount?: number
  description?: string | null
  sort?: SortValue
}) {
  return (
    <header className="w-full">
      <h1 className="font-heading text-[24px] font-normal uppercase leading-[1.15] tracking-[0.01em] text-black sm:text-[28px] lg:text-[32px]">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-[13px] font-normal leading-[1.4] text-black/60 sm:text-[14px]">
          {description}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-[13px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black sm:text-[14px]">
          {itemCount !== undefined ? (
            <>
              <span className="text-black/60">
                {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
              </span>
              <span aria-hidden="true" className="h-3.5 w-px bg-black/25" />
            </>
          ) : null}
          <CollectionSortDropdown value={sort} />
        </div>

        <CollectionFilters />
      </div>
    </header>
  )
}
