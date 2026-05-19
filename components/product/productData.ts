export type ProductImage = {
  src: string
  alt: string
  objectPosition?: string
}

export type ProductSwatch = {
  name: string
  value: string
}

export type DeliveryPerk = {
  label: string
  detail: string
  icon: "truck" | "exchange" | "shield" | "card"
}

export type ProductDetail = {
  slug: string
  editLabel: string
  title: string
  breadcrumb: Array<{
    label: string
    href?: string
  }>
  originalPrice: string
  price: string
  sold: string
  rating: string
  description: string
  detailsBody: string
  careNotes: string[]
  shippingNotes: string[]
  colorName: string
  colors: ProductSwatch[]
  sizes: string[]
  gallery: ProductImage[]
  deliveryPerks: DeliveryPerk[]
  completeLook: ProductImage[]
}

const sharedChairPose = {
  src: "/images/products/product6.png",
  alt: "Model in a monochrome studio look seated in a chrome chair with a black bag beside the set",
}

export const featuredProduct: ProductDetail = {
  slug: "bootcut-denim",
  editLabel: "EDIT NAME",
  title: "BOOTCUT DENIM",
  breadcrumb: [
    { label: "Homepage", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Bootcut Denim" },
    { label: "Royal Brown, 8" },
  ],
  originalPrice: "₹3,000",
  price: "₹2,800",
  sold: "1,238 Sold",
  rating: "4.5",
  description:
    "A structured bootcut denim in a deep matte wash, cut to hold the leg cleanly before widening at the hem. The silhouette stays tailored through the seat and thigh, then opens into a longer editorial line.",
  detailsBody:
    "Dense denim with a soft, polished finish and a clean waistband shape. Designed to stay sharp in motion, the fit keeps the profile lean before easing out below the knee.",
  careNotes: [
    "Machine wash cold, inside out.",
    "Do not bleach or tumble dry.",
    "Hang dry to preserve the drape.",
    "Steam lightly to refresh the finish.",
  ],
  shippingNotes: [
    "Standard delivery in 2-4 business days.",
    "Free exchange within 14 days.",
    "Cash on delivery available on select pin codes.",
  ],
  colorName: "Royal Brown",
  colors: [
    { name: "Royal Brown", value: "#6f5639" },
    { name: "Ivory Mist", value: "#ebe8e1" },
    { name: "Slate Blue", value: "#5b82ab" },
    { name: "Midnight", value: "#111722" },
  ],
  sizes: ["6", "8", "10", "14", "18", "20"],
  gallery: [
    { ...sharedChairPose, objectPosition: "center 36%" },
    { ...sharedChairPose, objectPosition: "center 36%" },
    { ...sharedChairPose, objectPosition: "center 36%" },
    { ...sharedChairPose, objectPosition: "center 36%" },
    { ...sharedChairPose, objectPosition: "center 36%" },
    { ...sharedChairPose, objectPosition: "center 36%" },
    { ...sharedChairPose, objectPosition: "center 36%" },
  ],
  deliveryPerks: [
    {
      label: "Fast delivery",
      detail: "2-4 days",
      icon: "truck",
    },
    {
      label: "Easy exchange",
      detail: "14 days",
      icon: "exchange",
    },
    {
      label: "Secure checkout",
      detail: "COD available",
      icon: "shield",
    },
    {
      label: "Tracked shipping",
      detail: "Live updates",
      icon: "card",
    },
  ],
  completeLook: [
    { ...sharedChairPose, objectPosition: "center 32%" },
    { ...sharedChairPose, objectPosition: "center 40%" },
    { ...sharedChairPose, objectPosition: "center 28%" },
  ],
}

