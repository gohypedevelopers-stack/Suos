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
      product.variants.map(v => variantOptionValues(v.optionValues)["Size"]).filter(Boolean)
    ))
    
    // In our static data, swatches are just colors like "#0a1a2b", but from DB they might be "Blue" or hex codes depending on how admin inputs them.
    // If we assume admin inputs hex codes or standard css colors in "Color" option:
    const swatches = Array.from(new Set(
      product.variants.map(v => {
        const colorOpt = variantOptionValues(v.optionValues)["Color"] as any;
        if (colorOpt && typeof colorOpt === 'object' && 'value' in colorOpt) {
          return colorOpt.value as string;
        }
        return colorOpt as string;
      }).filter(Boolean)
    ))
    
    const image = product.images[0]
    const gallery = product.images.map(img => imageUrl(img.objectKey)).filter((url): url is string => url !== null)

    const badge = product.tags.find(t => t.toUpperCase() === "NEW ARRIVAL" || t.toUpperCase() === "BESTSELLER")?.toUpperCase()

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: variant ? `₹${variant.price.toString()}` : "N/A", // Default formatting for the UI
      compareAtPrice: variant?.compareAtPrice ? `₹${variant.compareAtPrice.toString()}` : null,
      isInStock: product.variants.some(v => v.inventoryQuantity > 0),
      image: image ? (imageUrl(image.objectKey) ?? "") : "",
      alt: image?.altText || product.title,
      gallery,
      sizes,
      swatches,
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
  const detailsBody = detailsList.find(d => d.name === "Body")?.value || product.description || ""

  const sizes = Array.from(new Set(
    product.variants.map(v => variantOptionValues(v.optionValues)["Size"]).filter(Boolean)
  ))
  
  // Create color objects: { name: "Royal Brown", value: "#6f5639" }
  const colorMap = new Map<string, string>()
  product.variants.forEach(v => {
    const opts = variantOptionValues(v.optionValues)
    
    let colorName = "Default"
    let colorValue = "#000000"
    
    if (opts["Color"]) {
      const colorOpt = opts["Color"]
      if (typeof colorOpt === 'object' && colorOpt !== null) {
        colorName = colorOpt.name || colorName
        colorValue = colorOpt.value || colorValue
      } else if (typeof colorOpt === 'string') {
        colorValue = colorOpt
        colorName = opts["Color Name"] || colorOpt
      }
      colorMap.set(colorName, colorValue)
    }
  })
  const colors = Array.from(colorMap.entries()).map(([name, value]) => ({ name, value }))
  
  // Default fallback if variants don't define colors properly yet
  if (colors.length === 0) {
    colors.push({ name: "Default", value: "#000000" })
  }

  const gallery = product.images.map(img => ({
    src: imageUrl(img.objectKey) ?? "",
    alt: img.altText ?? product.title,
    objectPosition: "center 36%" // fallback position
  })).filter(img => img.src)

  const variant = product.variants[0]

  return {
    id: product.id,
    slug: product.slug,
    editLabel: product.category?.name?.toUpperCase() || "PRODUCT",
    title: product.title,
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: product.category?.name || "Products" },
      { label: product.title },
    ],
    originalPrice: variant?.compareAtPrice ? `₹${variant.compareAtPrice.toString()}` : null,
    price: variant ? `₹${variant.price.toString()}` : "N/A",
    sold: "1,238 Sold", // Static fallback
    rating: "4.5", // Static fallback
    description: product.description || "",
    detailsBody: detailsBody,
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
    colorName: colors[0]?.name || "Default",
    colors,
    sizes,
    gallery,
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" as const },
      { label: "Easy exchange", detail: "14 days", icon: "exchange" as const },
      { label: "Secure checkout", detail: "COD available", icon: "shield" as const },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" as const },
    ],
    completeLook: gallery.slice(0, 3), // Fallback to using some gallery images
    sizeGuideImages: [
      "/size-charts/SU022026-27_TECHPACK_page_1.png",
      "/size-charts/SU022026-27_TECHPACK_page_2.png",
    ],
    fitType: "regular" as const,
  }
}
