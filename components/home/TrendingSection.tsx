import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

type ProductCard = {
  id: string
  image: string
  alt: string
  badge?: string
  featured?: boolean
  sizes?: string[]
  swatches: string[]
}

const tabs = [
  { label: "ALL", active: false },
  { label: "WOMEN", active: false },
  { label: "MEN", active: true },
] as const

const products: ProductCard[] = [
  {
    id: "product-1",
    image: "/images/products/product1.png",
    alt: "Model wearing a blue denim outfit",
    badge: "NEW ARRIVAL",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
  },
  {
    id: "product-2",
    image: "/images/products/product2.png",
    alt: "Model wearing a denim jacket in monochrome",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
  },
  {
    id: "product-3",
    image: "/images/products/product3.png",
    alt: "Model seated in a black tailored look",
    badge: "BESTSELLER",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
  },
  {
    id: "product-4",
    image: "/images/products/product4.png",
    alt: "Model wearing an all-black outfit",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
  },
  {
    id: "product-5-featured",
    image: "/images/products/product4.png",
    alt: "Model wearing an all-black outfit",
    featured: true,
    sizes: ["28", "32", "36", "42"],
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
  },
  {
    id: "product-6",
    image: "/images/products/product3.png",
    alt: "Model seated in a black tailored look",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
  },
  {
    id: "product-7",
    image: "/images/products/product1.png",
    alt: "Model wearing a blue denim outfit",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
  },
  {
    id: "product-8",
    image: "/images/products/product2.png",
    alt: "Model wearing a denim jacket in monochrome",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
  },
]

function ColorSwatches({ swatches }: { swatches: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {swatches.map((swatch) => (
        <span
          key={swatch}
          className="size-2.5 border border-black/10"
          style={{ backgroundColor: swatch }}
        />
      ))}
    </div>
  )
}

function ProductCardView({ product }: { product: ProductCard }) {
  return (
    <article className="group relative overflow-hidden bg-black shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[330/479]">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
        />

        {product.badge ? (
          <span className="absolute left-2 top-2 z-10 bg-black px-1.5 py-0.5 text-[0.38rem] font-medium uppercase tracking-[0.14em] text-white">
            {product.badge}
          </span>
        ) : null}

        {product.featured ? (
          <button
            type="button"
            aria-label="Expand product"
            className="absolute right-2 top-2 z-10 inline-flex size-5 items-center justify-center border border-black/10 bg-white text-black"
          >
            <Plus className="size-3.5 stroke-[2.1]" />
          </button>
        ) : null}

        <div
          className={cn(
            "absolute inset-x-3 bottom-3 z-10 bg-white px-3 py-2 text-black shadow-[0_8px_18px_rgba(0,0,0,0.12)]",
            product.featured && "py-2.5"
          )}
        >
          {product.featured ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.58rem] font-medium uppercase leading-tight tracking-[0.08em]">
                    NAME OF THE PRODUCT
                  </p>
                  <p className="mt-0.5 text-[0.55rem] uppercase leading-tight tracking-[0.08em]">
                    PRICE
                  </p>
                </div>
                <ColorSwatches swatches={product.swatches} />
              </div>

              <div className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.18em] text-black/75">
                {product.sizes?.map((size) => (
                  <span key={size}>{size}</span>
                ))}
              </div>

              <button
                type="button"
                className="flex h-7 w-full items-center justify-center border border-black bg-white text-[0.52rem] uppercase tracking-[0.14em] transition-colors hover:bg-black hover:text-white"
              >
                Add To Cart
              </button>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.58rem] font-medium uppercase leading-tight tracking-[0.08em]">
                  NAME OF THE PRODUCT
                </p>
                <p className="mt-0.5 text-[0.55rem] uppercase leading-tight tracking-[0.08em]">
                  PRICE
                </p>
              </div>

              <ColorSwatches swatches={product.swatches} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export function TrendingSection() {
  return (
    <section className="w-full bg-white px-4 py-14 text-black sm:px-6 lg:px-8 md:py-16">
      <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-heading text-[clamp(1.7rem,2.2vw,2.6rem)] font-semibold uppercase leading-none tracking-[-0.04em]">
          Trending
        </h2>

        <div className="flex items-center gap-6 sm:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              aria-pressed={tab.active}
              className={cn(
                "pb-1 text-[0.75rem] font-medium uppercase tracking-[0.12em] transition-opacity hover:opacity-70 sm:text-[0.875rem]",
                tab.active && "border-b border-black"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCardView key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/#collection"
          className="inline-flex h-9 items-center justify-center border border-black px-5 text-[0.6875rem] uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white"
        >
          View All
        </Link>
      </div>
    </section>
  )
}
