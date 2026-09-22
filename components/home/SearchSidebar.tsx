"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Loader2, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { searchCatalogAction } from "@/app/actions/search"
import type { SearchResponse } from "@/lib/server/dal/search"

type SearchSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const trendingSearches = [
  "DENIM",
  "BOOTCUT",
  "STRAIGHT LEG",
  "OVERSIZED",
  "JACKET",
  "BLACK",
]

const STORAGE_KEY = "suos-recent-searches"

export function SearchSidebar({ open, onOpenChange }: SearchSidebarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim()
    if (!trimmed || trimmed.length < 2) return

    setRecentSearches((prev) => {
      const updated = [
        trimmed,
        ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, 5)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Ignore storage errors
      }
      return updated
    })
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage errors
    }
  }

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== term)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Ignore storage errors
      }
      return updated
    })
  }

  // Handle Search Input with fast debounce
  const handleQueryChange = (value: string) => {
    setQuery(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!value.trim()) {
      setResults(null)
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    searchTimeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        const response = await searchCatalogAction(value)
        setResults(response)
        setIsSearching(false)
      })
    }, 180)
  }

  const handleApplySuggestion = (suggestedTerm: string) => {
    handleQueryChange(suggestedTerm)
    saveRecentSearch(suggestedTerm)
  }

  const handleSelectProduct = (productTitle: string) => {
    saveRecentSearch(query || productTitle)
    onOpenChange(false)
  }

  const handleSelectPill = (term: string) => {
    handleQueryChange(term)
    saveRecentSearch(term)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="!z-[10000] bg-black/60 backdrop-blur-[2px]"
        className="!z-[10001] border-l border-white/10 bg-black p-0 text-white shadow-[0_0_80px_rgba(0,0,0,0.6)] ease-in-out duration-300 sm:max-w-md w-full"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <SheetTitle className="text-[14px] font-medium uppercase tracking-[0.08em] text-white">
              Search
            </SheetTitle>

            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-normal uppercase tracking-[0.04em] text-white/70 transition-colors hover:text-white"
              >
                <span>Close</span>
                <X aria-hidden="true" className="size-4 stroke-[2]" />
              </button>
            </SheetClose>
          </div>

          <SheetDescription className="sr-only">
            Search products with typo correction, explore categories and trending edits.
          </SheetDescription>

          {/* Search Input Bar */}
          <div className="p-5 pb-3">
            <div className="relative flex items-center">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    saveRecentSearch(query)
                  }
                }}
                aria-label="Search catalog"
                placeholder="Search jeans, jackets, styles, colors..."
                className="h-12 w-full border border-white/40 bg-white/[0.04] px-4 pr-20 text-[14px] font-normal text-white placeholder:text-white/40 outline-none transition-colors focus:border-white focus:bg-white/[0.08]"
              />

              <div className="absolute right-3 flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={() => handleQueryChange("")}
                    aria-label="Clear search query"
                    className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}

                {isSearching || isPending ? (
                  <Loader2 className="size-4 animate-spin text-white/70" />
                ) : (
                  <Search className="size-4 text-white/50" />
                )}
              </div>
            </div>

            {/* Typo Suggestion Alert */}
            {results?.suggestion &&
              results.suggestion.toLowerCase() !== query.toLowerCase().trim() && (
                <div className="mt-3 flex items-center justify-between border border-white/20 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white">
                  <span>
                    Did you mean{" "}
                    <button
                      type="button"
                      onClick={() => handleApplySuggestion(results.suggestion!)}
                      className="font-semibold uppercase text-white underline underline-offset-4 hover:opacity-80 cursor-pointer"
                    >
                      {results.suggestion}
                    </button>
                    ?
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplySuggestion(results.suggestion!)}
                    className="ml-2 shrink-0 border border-white/30 bg-transparent px-2.5 py-1 text-[11px] uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            {/* 1. Results state when query is provided */}
            {query.trim().length > 0 ? (
              <div className="space-y-6 pt-2">
                {/* Notice if results are showing for typo / suggested term */}
                {results?.suggestion &&
                  !results.hasExactMatch &&
                  results.products.length > 0 && (
                    <p className="text-[12px] text-white/60 italic">
                      Showing results for &ldquo;{results.suggestion}&rdquo;
                    </p>
                  )}

                {/* Matched Categories or Collections */}
                {((results?.categories && results.categories.length > 0) ||
                  (results?.collections && results.collections.length > 0)) && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">
                      Matching Categories & Edits
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {results?.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href="/collections"
                          onClick={() => onOpenChange(false)}
                          className="inline-flex items-center gap-1.5 border border-white/20 bg-white/[0.04] px-3 py-1.5 text-[12px] uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
                        >
                          <span>{cat.name}</span>
                          <ArrowRight className="size-3 text-white/50" />
                        </Link>
                      ))}
                      {results?.collections.map((col) => (
                        <Link
                          key={col.id}
                          href={`/collections/${col.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="inline-flex items-center gap-1.5 border border-white/20 bg-white/[0.04] px-3 py-1.5 text-[12px] uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
                        >
                          <span>{col.title}</span>
                          <ArrowRight className="size-3 text-white/50" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Results */}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">
                      Products ({results?.totalCount ?? 0})
                    </p>
                  </div>

                  {results && results.products.length > 0 ? (
                    <div className="mt-3 divide-y divide-white/10 border-y border-white/10">
                      {results.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => handleSelectProduct(product.title)}
                          className="group flex items-center gap-3.5 py-3 transition-colors hover:bg-white/[0.04] px-1"
                        >
                          <div className="relative size-16 shrink-0 overflow-hidden bg-white/5 border border-white/10">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.alt}
                                fill
                                sizes="64px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-white/40">
                                SUOS
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            {product.badge && (
                              <span className="inline-block text-[9px] font-semibold tracking-wider text-white/70 uppercase">
                                {product.badge}
                              </span>
                            )}
                            <h4 className="truncate text-[13px] font-medium uppercase text-white group-hover:text-white/80 transition-colors">
                              {product.title}
                            </h4>
                            <p className="text-[11px] text-white/50 uppercase">
                              {product.categoryName || "Denim"}
                            </p>
                            <div className="mt-1 flex items-baseline gap-2">
                              <span className="text-[13px] font-semibold text-white">
                                {product.price}
                              </span>
                              {product.compareAtPrice && (
                                <span className="text-[11px] text-white/40 line-through">
                                  {product.compareAtPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : !isSearching && results && results.products.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-[13px] text-white/70">
                        No direct results found for &ldquo;{query}&rdquo;.
                      </p>
                      <p className="mt-1 text-[11px] text-white/40">
                        Try searching for denim, bootcut, jacket, black, or browse all collections.
                      </p>
                      <Link
                        href="/collections"
                        onClick={() => onOpenChange(false)}
                        className="mt-4 inline-flex items-center justify-center border border-white/50 px-4 py-2 text-[12px] uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
                      >
                        Explore Catalog
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              /* 2. Default state when input is empty (Recent + Trending + Collections) */
              <div className="space-y-8 pt-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">
                        <Clock className="size-3" />
                        Recent Searches
                      </p>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-[10px] uppercase text-white/40 hover:text-white transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          onClick={() => handleSelectPill(term)}
                          className="group inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-3 py-1.5 text-[12px] uppercase text-white transition-colors hover:border-white hover:bg-white/[0.08] cursor-pointer"
                        >
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(term, e)}
                            className="text-white/40 hover:text-white transition-colors cursor-pointer"
                            aria-label={`Remove ${term}`}
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">
                    Trending Searches
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSelectPill(term)}
                        className="border border-white/20 bg-white/[0.03] px-3.5 py-1.5 text-[12px] uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white hover:text-black cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">
                    Quick Discovery
                  </p>
                  <div className="mt-3 space-y-2">
                    <Link
                      href="/collections"
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between border border-white/10 bg-white/[0.02] p-3.5 text-[13px] uppercase text-white transition-colors hover:border-white/40 hover:bg-white/[0.06]"
                    >
                      <span>All Denim Collections</span>
                      <ArrowRight className="size-4 text-white/60" />
                    </Link>
                    <Link
                      href="/#bestsellers"
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between border border-white/10 bg-white/[0.02] p-3.5 text-[13px] uppercase text-white transition-colors hover:border-white/40 hover:bg-white/[0.06]"
                    >
                      <span>Bestsellers & New Arrivals</span>
                      <ArrowRight className="size-4 text-white/60" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
