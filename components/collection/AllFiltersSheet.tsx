"use client"

import {
  type ComponentProps,
  type ComponentType,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type FilterOption = {
  value: string
  label: string
}

type FilterGroup = {
  id: string
  label: string
  options: FilterOption[]
  defaultOpen?: boolean
}

const filterGroups: FilterGroup[] = [
  {
    id: "price",
    label: "PRICE",
    defaultOpen: true,
    options: [
      { value: "price-0-1500", label: "₹0 - ₹1500 (20)" },
      { value: "price-1500-2000", label: "₹1500 - ₹2000 (149)" },
      { value: "price-2000-2500", label: "₹2000 - ₹2500 (10)" },
      { value: "price-2500-3000", label: "₹2500 - ₹3000 (12)" },
      { value: "price-3000-3500", label: "₹3000 - ₹3500 (02)" },
      { value: "price-3500-4000", label: "₹3500 - ₹4000 (01)" },
      { value: "price-4000-6500", label: "₹4000 - ₹6500 (05)" },
    ],
  },
  {
    id: "color",
    label: "COLOR",
    options: [
      { value: "color-black", label: "BLACK (54)" },
      { value: "color-blue", label: "BLUE (92)" },
      { value: "color-white", label: "WHITE (44)" },
      { value: "color-grey", label: "GREY (32)" },
    ],
  },
  {
    id: "size",
    label: "SIZE",
    options: [
      { value: "size-xs", label: "XS" },
      { value: "size-s", label: "S" },
      { value: "size-m", label: "M" },
      { value: "size-l", label: "L" },
      { value: "size-xl", label: "XL" },
    ],
  },
  {
    id: "edits",
    label: "EDITS",
    options: [
      { value: "edit-new-arrival", label: "NEW ARRIVAL (28)" },
      { value: "edit-bestseller", label: "BESTSELLER (39)" },
      { value: "edit-limited", label: "LIMITED EDITION (12)" },
    ],
  },
  {
    id: "secondary-price",
    label: "PRICE",
    options: [
      { value: "secondary-price-under-3000", label: "UNDER ₹3000" },
      { value: "secondary-price-over-3000", label: "₹3000 & ABOVE" },
    ],
  },
]

const quickFilterGroups = {
  CATEGORY: {
    id: "category",
    label: "CATEGORY",
    defaultOpen: true,
    options: [
      { value: "category-t-shirts", label: "T-SHIRTS (42)" },
      { value: "category-shirts", label: "SHIRTS (38)" },
      { value: "category-jackets", label: "JACKETS (26)" },
      { value: "category-jeans", label: "JEANS (31)" },
      { value: "category-trousers", label: "TROUSERS (24)" },
      { value: "category-accessories", label: "ACCESSORIES (29)" },
    ],
  },
  PRICE: { ...filterGroups[0], defaultOpen: true },
  COLOR: { ...filterGroups[1], defaultOpen: true },
  SIZE: { ...filterGroups[2], defaultOpen: true },
} satisfies Record<string, FilterGroup>

function FilterCloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[10px] w-[9px] shrink-0 -translate-y-px"
      fill="none"
      viewBox="0 0 9 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 0.5L8.5 9.5M8.5 0.5L0.5 9.5"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  )
}

function FilterGroupSection({
  group,
  selectedFilters,
  onFilterChange,
}: {
  group: FilterGroup
  selectedFilters: Set<string>
  onFilterChange: (value: string, checked: boolean) => void
}) {
  const [isOpen, setIsOpen] = useState(group.defaultOpen ?? false)

  return (
    <details
      className="group border-b border-white/35"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary
        className="flex h-[82px] cursor-pointer list-none items-center justify-between px-[30px] text-[16px] font-normal uppercase leading-5 outline-none transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.08] [&::-webkit-details-marker]:hidden"
      >
        <span>{group.label}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 stroke-[2.5] transition-transform duration-200 group-open:rotate-180"
        />
      </summary>

      <div className="space-y-[12px] px-[30px] pb-[39px]">
        {group.options.map((option) => {
          const checkboxId = `filter-${option.value}`

          return (
            <label
              key={option.value}
              htmlFor={checkboxId}
              className="flex w-fit cursor-pointer items-center gap-[13px] text-[16px] leading-5 text-white"
            >
              <Checkbox
                id={checkboxId}
                checked={selectedFilters.has(option.value)}
                onCheckedChange={(checked) =>
                  onFilterChange(option.value, checked === true)
                }
                className="size-[21px] rounded-none border-white bg-black shadow-none focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/60 dark:bg-black data-checked:border-white data-checked:bg-black data-checked:text-white dark:data-checked:bg-black"
              />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
    </details>
  )
}

type FilterSheetProps = {
  groups: FilterGroup[]
  trigger: ReactElement
}

function FilterTrigger({
  label,
  Icon,
  className,
  ...buttonProps
}: {
  label: string
  Icon: ComponentType<{ className?: string }>
} & ComponentProps<"button">) {
  return (
    <button
      {...buttonProps}
      type="button"
      className={`inline-flex h-[42px] items-center justify-between gap-3 border border-black bg-white px-4 text-[16px] uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black${className ? ` ${className}` : ""}`}
    >
      <span>{label}</span>
      <Icon className="size-4 shrink-0 stroke-[1.9]" />
    </button>
  )
}

function FilterSheet({ groups, trigger }: FilterSheetProps) {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    () => new Set()
  )

  function handleFilterChange(value: string, checked: boolean) {
    setSelectedFilters((currentFilters) => {
      const nextFilters = new Set(currentFilters)

      if (checked) {
        nextFilters.add(value)
      } else {
        nextFilters.delete(value)
      }

      return nextFilters
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="bg-black/55 supports-backdrop-filter:backdrop-blur-[2px]"
        className="gap-0 border-0 bg-black p-0 text-white shadow-[-18px_0_50px_rgba(0,0,0,0.18)] data-[side=right]:w-full data-[side=right]:border-l-0 data-[side=right]:sm:max-w-[439px]"
      >
        <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-white/35 px-7">
          <SheetTitle className="text-[16px] font-normal leading-5 text-white">
            FILTER
          </SheetTitle>
          <SheetDescription className="sr-only">
            Refine the collection by price, color, size, and edit.
          </SheetDescription>

          <SheetClose asChild>
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 text-[16px] font-normal leading-5 text-white transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span>CLOSE</span>
              <FilterCloseIcon />
            </button>
          </SheetClose>
        </div>

        <div className="filters-panel-scrollbar min-h-0 flex-1 overflow-y-auto px-7">
          {groups.map((group) => (
            <FilterGroupSection
              key={group.id}
              group={group}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          ))}
        </div>

        <div className="shrink-0 bg-black px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 text-center">
          <SheetClose asChild>
            <button
              type="button"
              className="flex h-[38px] w-full items-center justify-center bg-white px-4 text-[22px] font-[400] leading-[26px] text-black transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              VIEW 190 ITEMS
            </button>
          </SheetClose>

          <button
            type="button"
            onClick={() => setSelectedFilters(new Set())}
            className="mt-3 min-h-4 text-[16px] leading-5 text-white underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selectedFilters.size === 0}
          >
            CLEAR ALL
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function AllFiltersSheet() {
  return (
    <FilterSheet
      groups={filterGroups}
      trigger={<FilterTrigger label="ALL FILTERS" Icon={SlidersHorizontal} />}
    />
  )
}

export type QuickFilterKey = keyof typeof quickFilterGroups

export function CollectionFilterDropdown({
  filter,
}: {
  filter: QuickFilterKey
}) {
  const group = quickFilterGroups[filter]
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    () => new Set()
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  function handleFilterChange(value: string, checked: boolean) {
    setSelectedFilters((currentFilters) => {
      const nextFilters = new Set(currentFilters)

      if (checked) nextFilters.add(value)
      else nextFilters.delete(value)

      return nextFilters
    })
  }

  return (
    <div ref={dropdownRef} className="relative">
      <FilterTrigger
        label={group.label}
        Icon={ChevronDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className={isOpen ? "!bg-black !text-white" : ""}
      />

      {isOpen && (
        <div
          role="menu"
          aria-label={`${group.label} filters`}
          className="absolute left-0 top-[calc(100%+8px)] z-40 min-w-[250px] border border-black bg-white p-4 text-black shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
        >
          <div className="mb-3 flex items-center justify-between border-b border-black/15 pb-3 text-[12px] uppercase tracking-[0.08em]">
            <span>{group.label}</span>
            <button
              type="button"
              onClick={() => setSelectedFilters(new Set())}
              className="underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={selectedFilters.size === 0}
            >
              CLEAR
            </button>
          </div>

          <div className="space-y-3">
            {group.options.map((option) => {
              const checkboxId = `quick-filter-${option.value}`

              return (
                <label
                  key={option.value}
                  htmlFor={checkboxId}
                  className="flex cursor-pointer items-center gap-3 text-[14px] leading-5"
                >
                  <Checkbox
                    id={checkboxId}
                    checked={selectedFilters.has(option.value)}
                    onCheckedChange={(checked) =>
                      handleFilterChange(option.value, checked === true)
                    }
                    className="size-[18px] rounded-none border-black bg-white shadow-none data-checked:border-black data-checked:bg-black data-checked:text-white"
                  />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
