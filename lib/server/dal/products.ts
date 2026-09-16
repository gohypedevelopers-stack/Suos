import "server-only"

import { getPrisma } from "@/lib/server/db"
import { assertAdmin } from "@/lib/server/dal/auth"

function imageUrl(objectKey: string) {
  if (objectKey.startsWith("/")) {
    return objectKey
  }

  if (objectKey.startsWith("uploads/")) {
    return `/${objectKey}`
  }

  const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "")
  return baseUrl ? `${baseUrl}/${objectKey}` : null
}

export type AdminCollectionOption = {
  id: string
  title: string
}

export type AdminProductListItem = {
  id: string
  title: string
  slug: string
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  categoryName: string
  collectionNames: string[]
  tags: string[]
  vendor: string
  sku: string | null
  variantCount: number
  totalInventory: number
  minimumPrice: string | null
  image: { url: string | null; altText: string | null } | null
  updatedAt: string
}

export type AdminProductDetail = {
  id: string
  title: string
  slug: string
  description: string | null
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  categoryId: string | null
  categoryName: string
  collectionIds: string[]
  collectionNames: string[]
  tags: string[]
  vendor: string
  details: { name: string; value: string }[]
  images: {
    id: string
    objectKey: string
    url: string | null
    altText: string | null
  }[]
  variants: {
    id: string
    title: string
    sku: string
    price: string
    compareAtPrice: string | null
    inventoryQuantity: number
    optionValues: Record<string, any>
  }[]
  createdAt: string
  updatedAt: string
}

export async function listCollectionOptionsForAdmin(): Promise<
  AdminCollectionOption[]
> {
  await assertAdmin()
  const prisma = getPrisma()

  return prisma.collection.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  })
}

export const COLOR_SWATCH_MAP: Record<string, string> = {
  black: "#171717",
  white: "#ffffff",
  red: "#ef2b2d",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#eab308",
  orange: "#f97316",
  olive: "#808000",
  purple: "#9333ea",
  pink: "#ec4899",
  brown: "#8b5e3c",
  beige: "#d6c3a5",
  cream: "#f5ead2",
  gray: "#6b7280",
  grey: "#6b7280",
  navy: "#1e3a5f",
  teal: "#0f766e",
  cyan: "#06b6d4",
  aqua: "#06b6d4",
  lime: "#84cc16",
  maroon: "#7f1d1d",
  gold: "#d4a017",
  silver: "#a8a8a8",
  charcoal: "#333333",
  indigo: "#4b0082",
}

export function resolveColorHex(colorInput: string): string {
  if (!colorInput) return "#171717"
  const trimmed = colorInput.trim()
  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) {
    return trimmed
  }
  const normalized = trimmed.toLowerCase()
  return COLOR_SWATCH_MAP[normalized] ?? "#171717"
}

export async function listPublishedProducts() {
  const prisma = getPrisma()
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      tags: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      variants: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          price: true,
          compareAtPrice: true,
          inventoryQuantity: true,
          optionValues: true,
        },
      },
      images: {
        orderBy: { position: "asc" },
        take: 5,
        select: {
          objectKey: true,
          altText: true,
        },
      },
    },
  })

  return products.map((product) => {
    const variant = product.variants[0]
    
    const sizes = Array.from(new Set(
      product.variants.flatMap(v => {
        const opts = variantOptionValues(v.optionValues)
        const size = opts["Size"] || opts["size"]
        if (typeof size === "string" && size.trim()) {
          return [size.trim().toUpperCase()]
        }
        return []
      })
    ))
    
    const swatches = Array.from(new Set(
      product.variants.flatMap(v => {
        const opts = variantOptionValues(v.optionValues)
        const colorOpt = opts["Color"] || opts["color"]
        if (!colorOpt) return []
        if (typeof colorOpt === "object" && colorOpt !== null && "value" in colorOpt) {
          return [resolveColorHex(String(colorOpt.value))]
        }
        if (typeof colorOpt === "string") {
          return colorOpt.split(",").map(c => resolveColorHex(c.trim())).filter(Boolean)
        }
        return []
      })
    ))
    
    const image = product.images[0]
    const gallery = product.images.map(img => imageUrl(img.objectKey)).filter((url): url is string => url !== null)

    const badge = product.tags.find(t => 
      ["NEW ARRIVAL", "BESTSELLER", "SALE", "HOT", "TRENDING", "LIMITED"].includes(t.toUpperCase())
    )?.toUpperCase() || (product.tags.length > 0 ? product.tags[0].toUpperCase() : undefined)

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: variant ? `₹${variant.price.toString()}` : "N/A",
      compareAtPrice: variant?.compareAtPrice ? `₹${variant.compareAtPrice.toString()}` : null,
      isInStock: product.variants.some(v => v.inventoryQuantity > 0),
      image: image ? (imageUrl(image.objectKey) ?? "") : (gallery[0] ?? ""),
      alt: image?.altText || product.title,
      gallery: gallery.length > 0 ? gallery : (image ? [imageUrl(image.objectKey) ?? ""] : []),
      sizes: sizes.length > 0 ? sizes : ["28", "32", "36", "42"],
      swatches: swatches.length > 0 ? swatches : ["#171717"],
      badge,
    }
  })
}

export async function listProductsForAdmin(): Promise<AdminProductListItem[]> {
  await assertAdmin()

  const prisma = getPrisma()
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      tags: true,
      vendor: true,
      updatedAt: true,
      category: {
        select: {
          name: true,
        },
      },
      variants: {
        orderBy: { createdAt: "asc" },
        select: {
          sku: true,
          price: true,
          inventoryQuantity: true,
        },
      },
      collections: {
        orderBy: { position: "asc" },
        select: {
          collection: { select: { title: true } },
        },
      },
      images: {
        orderBy: { position: "asc" },
        take: 1,
        select: {
          objectKey: true,
          altText: true,
        },
      },
    },
  })

  return products.map((product) => {
    const totalInventory = product.variants.reduce(
      (total, variant) => total + variant.inventoryQuantity,
      0,
    )
    const image = product.images[0]

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      status: product.status,
      categoryName: product.category?.name ?? "Uncategorized",
      collectionNames: product.collections.map(({ collection }) => collection.title),
      tags: product.tags,
      vendor: product.vendor,
      sku: product.variants[0]?.sku ?? null,
      variantCount: product.variants.length,
      totalInventory,
      minimumPrice:
        product.variants
          .map((variant) => variant.price)
          .sort((a, b) => a.comparedTo(b))[0]
          ?.toString() ?? null,
      image: image
        ? {
            url: imageUrl(image.objectKey),
            altText: image.altText,
          }
        : null,
      updatedAt: product.updatedAt.toISOString(),
    }
  })
}

function productDetails(value: unknown): { name: string; value: string }[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((detail) => {
    if (!detail || typeof detail !== "object") {
      return []
    }

    const { name, value: detailValue } = detail as {
      name?: unknown
      value?: unknown
    }
    return typeof name === "string" && typeof detailValue === "string"
      ? [{ name, value: detailValue }]
      : []
  })
}

function variantOptionValues(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, optionValue]) => typeof key === "string"
    ),
  )
}

export async function getProductForAdmin(
  productId: string,
): Promise<AdminProductDetail | null> {
  await assertAdmin()
  const prisma = getPrisma()
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      status: true,
      vendor: true,
      tags: true,
      details: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { id: true, name: true } },
      collections: {
        orderBy: { position: "asc" },
        select: { collection: { select: { id: true, title: true } } },
      },
      images: {
        orderBy: { position: "asc" },
        select: { id: true, objectKey: true, altText: true },
      },
      variants: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          sku: true,
          price: true,
          compareAtPrice: true,
          inventoryQuantity: true,
          optionValues: true,
        },
      },
    },
  })

  if (!product) {
    return null
  }

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    status: product.status,
    categoryId: product.category?.id ?? null,
    categoryName: product.category?.name ?? "Uncategorized",
    collectionIds: product.collections.map(({ collection }) => collection.id),
    collectionNames: product.collections.map(({ collection }) => collection.title),
    tags: product.tags,
    vendor: product.vendor,
    details: productDetails(product.details),
    images: product.images.map((image) => ({
      id: image.id,
      objectKey: image.objectKey,
      url: imageUrl(image.objectKey),
      altText: image.altText,
    })),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      price: variant.price.toString(),
      compareAtPrice: variant.compareAtPrice?.toString() ?? null,
      inventoryQuantity: variant.inventoryQuantity,
      optionValues: variantOptionValues(variant.optionValues),
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}

export async function getProductBySlug(slug: string) {
  const prisma = getPrisma()
  const product = await prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      details: true,
      tags: true,
      category: { select: { name: true } },
      collections: { select: { collection: { select: { title: true } } } },
      images: {
        orderBy: { position: "asc" },
        select: { objectKey: true, altText: true },
      },
      variants: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          price: true,
          compareAtPrice: true,
          inventoryQuantity: true,
          optionValues: true,
        },
      },
    },
  })

  if (!product) return null

  const detailsList = productDetails(product.details)
  const detailsBody = detailsList.find(d => d.name.toUpperCase() === "BODY")?.value || product.description || ""

  const sizes = Array.from(new Set(
    product.variants.flatMap(v => {
      const opts = variantOptionValues(v.optionValues)
      const size = opts["Size"] || opts["size"]
      if (typeof size === "string" && size.trim()) {
        return [size.trim().toUpperCase()]
      }
      return []
    })
  ))
  
  const colorMap = new Map<string, string>()
  product.variants.forEach(v => {
    const opts = variantOptionValues(v.optionValues)
    const colorOpt = opts["Color"] || opts["color"]
    if (colorOpt) {
      if (typeof colorOpt === "object" && colorOpt !== null) {
        const name = colorOpt.name || colorOpt.label || "Color"
        const value = resolveColorHex(colorOpt.value || colorOpt.hex || name)
        colorMap.set(name, value)
      } else if (typeof colorOpt === "string") {
        const parts = colorOpt.split(",")
        for (const part of parts) {
          const colorName = part.trim()
          if (colorName) {
            colorMap.set(colorName, resolveColorHex(colorName))
          }
        }
      }
    }
  })
  const colors = Array.from(colorMap.entries()).map(([name, value]) => ({ name, value }))
  
  if (colors.length === 0) {
    colors.push({ name: "Default", value: "#171717" })
  }

  const gallery = product.images.map(img => ({
    src: imageUrl(img.objectKey) ?? "",
    alt: img.altText ?? product.title,
    objectPosition: "center 36%"
  })).filter(img => img.src)

  const variant = product.variants[0]

  const careDetail = detailsList.find(d => /care|wash/i.test(d.name))
  const shippingDetail = detailsList.find(d => /shipping|delivery/i.test(d.name))

  const careNotes = careDetail
    ? careDetail.value.split(/\n|;/).map(s => s.trim()).filter(Boolean)
    : [
        "Machine wash cold, inside out.",
        "Do not bleach or tumble dry.",
        "Hang dry to preserve the drape.",
        "Steam lightly to refresh the finish.",
      ]

  const shippingNotes = shippingDetail
    ? shippingDetail.value.split(/\n|;/).map(s => s.trim()).filter(Boolean)
    : [
        "Standard delivery in 2-4 business days.",
        "Free exchange within 14 days.",
        "Cash on delivery available on select pin codes.",
      ]

  return {
    id: product.id,
    slug: product.slug,
    editLabel: product.category?.name?.toUpperCase() || "SUOS",
    title: product.title,
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: product.category?.name || "Products" },
      { label: product.title },
    ],
    originalPrice: variant?.compareAtPrice ? `₹${variant.compareAtPrice.toString()}` : null,
    price: variant ? `₹${variant.price.toString()}` : "N/A",
    sold: "1,238 Sold",
    rating: "4.5",
    description: product.description || "",
    details: detailsList,
    detailsBody: detailsBody,
    careNotes,
    shippingNotes,
    colorName: colors[0]?.name || "Default",
    colors,
    sizes: sizes.length > 0 ? sizes : ["28", "32", "36", "42"],
    gallery: gallery.length > 0 ? gallery : [{ src: "/home-page-content/product-urban.png", alt: product.title }],
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" as const },
      { label: "Easy exchange", detail: "14 days", icon: "exchange" as const },
      { label: "Secure checkout", detail: "COD available", icon: "shield" as const },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" as const },
    ],
    completeLook: gallery.slice(0, 3),
    sizeGuideImages: [
      "/size-charts/SU022026-27_TECHPACK_page_1.png",
      "/size-charts/SU022026-27_TECHPACK_page_2.png",
    ],
    fitType: "regular" as const,
  }
}
