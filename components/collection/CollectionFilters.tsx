import {
  AllFiltersSheet,
  CollectionFilterDropdown,
  type QuickFilterKey,
} from "@/components/collection/AllFiltersSheet"

const filters: QuickFilterKey[] = ["CATEGORY", "PRICE", "COLOR", "SIZE"]

export function CollectionFilters() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px] leading-[1.4] tracking-[0.04em] sm:gap-2.5 sm:text-[14px]">
      {filters.map((filter) => (
        <CollectionFilterDropdown key={filter} filter={filter} />
      ))}
      <AllFiltersSheet />
    </div>
  )
}
