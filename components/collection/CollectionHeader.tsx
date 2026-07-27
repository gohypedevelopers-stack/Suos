import { CollectionFilters } from "@/components/collection/CollectionFilters"
import { CollectionSortDropdown } from "@/components/collection/CollectionSortDropdown"

const collectionTitle = "Men’s Clothing"

export function CollectionHeader() {
  return (
    <header className="w-full">
      <div className="flex flex-col gap-5">
        <h1 className="font-heading text-[24px] font-[400] uppercase leading-none tracking-[-0.05em] text-black">
          {collectionTitle}
        </h1>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-[13px] font-normal uppercase tracking-[0.08em] text-black/80">
            <span>190 ITEMS</span>
            <span className="text-black/45">|</span>
            <CollectionSortDropdown />
          </div>

          <CollectionFilters />
        </div>
      </div>
    </header>
  )
}
