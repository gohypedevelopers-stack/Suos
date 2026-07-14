import {
  AllFiltersSheet,
  CollectionFilterDropdown,
  type QuickFilterKey,
} from "@/components/collection/AllFiltersSheet"

const filters: QuickFilterKey[] = ["CATEGORY", "PRICE", "COLOR", "SIZE"]

export function CollectionFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <CollectionFilterDropdown key={filter} filter={filter} />
      ))}
      <AllFiltersSheet />
    </div>
  )
}
