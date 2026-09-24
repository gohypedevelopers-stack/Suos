"use client"

import Link from "next/link"
import { ProductCardView, type ProductCard } from "@/components/home/TrendingSection"

const defaultRecommendedProducts: ProductCard[] = [
  {
    id: "rec-1",
    title: "VINTAGE WASH RELAXED DENIM",
    slug: "vintage-wash-relaxed-denim",
    image: "/images/nav1.png",
    alt: "Vintage Wash Relaxed Denim",
    badge: "RECOMMENDED",
    sizes: ["28", "30", "32", "34", "36"],
    swatches: ["#4a6b82", "#2c3e50", "#1a252f"],
    gallery: ["/images/nav1.png", "/home-page-content/hero-1.png"],
    price: "₹2,690",
    compareAtPrice: "₹3,490",
    description: "Classic relaxed fit denim crafted from responsible regenerative cotton with subtle whisker washing.",
    category: { name: "Straight", slug: "straight" },
  },
  {
    id: "rec-2",
    title: "MID-BLUE BAGGY FIT JEANS",
    slug: "mid-blue-baggy-fit-jeans",
    image: "/images/nav2.png",
    alt: "Mid-Blue Baggy Fit Jeans",
    badge: "HOT PICK",
    sizes: ["28", "30", "32", "34", "36"],
    swatches: ["#3b5998", "#1c2833"],
    gallery: ["/images/nav2.png", "/images/nav1.png"],
    price: "₹2,990",
    compareAtPrice: "₹3,990",
    description: "Relaxed baggy silhouette with authentic indigo dye and low-impact laser finishing.",
    category: { name: "Baggy", slug: "baggy" },
  },
  {
    id: "rec-3",
    title: "OBSIDIAN RAW INDIGO DENIM",
    slug: "obsidian-raw-indigo-denim",
    image: "/home-page-content/hero-1.png",
    alt: "Obsidian Raw Indigo Denim",
    badge: "BESTSELLER",
    sizes: ["30", "32", "34", "36"],
    swatches: ["#1b2631", "#212f3d"],
    gallery: ["/home-page-content/hero-1.png", "/images/nav2.png"],
    price: "₹3,290",
    compareAtPrice: "₹4,290",
    description: "Heavyweight clean raw denim with contrast selvedge seam and structured drape.",
    category: { name: "Raw", slug: "raw" },
  },
  {
    id: "rec-4",
    title: "CHARCOAL FADED UTILITY JEAN",
    slug: "charcoal-faded-utility-jean",
    image: "/images/nav1.png",
    alt: "Charcoal Faded Utility Jean",
    badge: "NEW IN",
    sizes: ["28", "30", "32", "34"],
    swatches: ["#34495e", "#2c3e50"],
    gallery: ["/images/nav1.png", "/home-page-content/hero-2.png"],
    price: "₹2,890",
    compareAtPrice: "₹3,690",
    description: "Modern utility silhouette with ergonomic pocketing and stone washed texture.",
    category: { name: "Utility", slug: "utility" },
  },
]

export function RecommendedSection({
  products = [],
}: {
  products?: ProductCard[]
}) {
  // Use real products if at least 4 are provided, otherwise supplement with defaults
  const displayProducts =
    products.length >= 4
      ? products.slice(0, 4)
      : [
          ...products,
          ...defaultRecommendedProducts.slice(products.length, 4),
        ]

  return (
    <section className="w-full bg-white px-3 sm:px-6 lg:px-8 py-10 md:py-16 text-black">
      <div className="flex w-full items-end justify-between">
        <h2 className="font-heading text-[22px] sm:text-[24px] font-normal uppercase leading-none tracking-[-0.04em]">
          Recommended
        </h2>

        <Link
          href="/collections"
          className="text-[12px] sm:text-[13px] font-normal uppercase tracking-wider text-black/60 transition-colors hover:text-black"
        >
          View All
        </Link>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayProducts.map((product) => (
          <ProductCardView key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
