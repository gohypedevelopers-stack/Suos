import { CollectionFilters } from "@/components/collection/CollectionFilters"
import { CollectionSortDropdown } from "@/components/collection/CollectionSortDropdown"

export function CollectionHeader({
  title = "Men's Clothing",
  itemCount,
  description,
}: {
  title?: string
  itemCount?: number
  description?: string | null
}) {
  return (
    <header className="w-full">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-heading text-[24px] font-[400] uppercase leading-none tracking-[-0.05em] text-black">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-[13px] font-normal uppercase leading-relaxed text-black/60">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-[13px] font-normal uppercase tracking-[0.08em] text-black/80">
            {itemCount !== undefined ? <span>{itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}</span> : null}
            {itemCount !== undefined ? <span className="text-black/45">|</span> : null}
            <CollectionSortDropdown />
          </div>

          <CollectionFilters />
        </div>
      </div>
    </header>
  )
}
