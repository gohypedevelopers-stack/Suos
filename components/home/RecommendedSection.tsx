"use client"

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

const CAROUSEL_SIZE = 6

/** Homepage "You May Also Like": a horizontal, scroll-snapping row of 6 cards. */
export function RecommendedSection({
  products = [],
  usePlaceholders = true,
}: {
  products?: ProductCard[]
  /** Fill a short list with the sample cards (homepage only). */
  usePlaceholders?: boolean
}) {
  // Real products first; optionally fill any gap with the placeholder cards.
  const displayProducts = [
    ...products.slice(0, CAROUSEL_SIZE),
    ...(usePlaceholders
      ? defaultRecommendedProducts.slice(0, Math.max(0, CAROUSEL_SIZE - products.length))
      : []),
  ]

  return (
    <section className="w-full bg-white py-10 md:py-16 text-black">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <h2 className="font-heading text-[28px] sm:text-[32px] lg:text-h2 font-normal uppercase leading-none tracking-normal">
          You May Also Like
        </h2>
      </div>

      <div
        className="mt-6 sm:mt-8 flex snap-x snap-mandatory items-start gap-0.5 overflow-x-auto overscroll-x-contain px-3 [scrollbar-width:none] sm:gap-1 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
        aria-label="You may also like"
      >
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="w-[46vw] shrink-0 snap-start sm:w-[34vw] md:w-[26vw] lg:w-[calc((100%-5*0.25rem)/6)]"
          >
            <ProductCardView product={product} variant="compact" />
          </div>
        ))}
      </div>
    </section>
  )
}
