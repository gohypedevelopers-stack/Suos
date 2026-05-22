import type { ProductCard } from "@/components/home/TrendingSection"

const baseProducts: ProductCard[] = [
  {
    id: "collection-product-1",
    image: "/images/products/product1.png",
    alt: "Model wearing a blue denim outfit",
    badge: "NEW ARRIVAL",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product1.png",
      "/images/products/product5.png",
      "/images/products/product9.png",
      "/images/products/product13.png",
    ],
  },
  {
    id: "collection-product-2",
    image: "/images/products/product2.png",
    alt: "Model wearing a denim jacket in monochrome",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product2.png",
      "/images/products/product6.png",
      "/images/products/product10.png",
      "/images/products/product14.png",
    ],
  },
  {
    id: "collection-product-3",
    image: "/images/products/product3.png",
    alt: "Model seated in a black tailored look",
    badge: "BESTSELLER",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product3.png",
      "/images/products/product7.png",
      "/images/products/product11.png",
      "/images/products/product15.png",
    ],
  },
  {
    id: "collection-product-4",
    image: "/images/products/product4.png",
    alt: "Model wearing an all-black outfit",
    swatches: ["#0a1a2b", "#15436b", "#d1d9e2"],
    gallery: [
      "/images/products/product4.png",
      "/images/products/product8.png",
      "/images/products/product12.png",
      "/images/products/product5-white.png",
    ],
  },
]

export const collectionProducts: ProductCard[] = [
  ...baseProducts.map((product) => ({
    ...product,
    id: `${product.id}-row-1`,
  })),
  ...baseProducts.map((product) => ({
    ...product,
    id: `${product.id}-row-2`,
  })),
  ...baseProducts.map((product) => ({
    ...product,
    id: `${product.id}-row-3`,
  })),
]
