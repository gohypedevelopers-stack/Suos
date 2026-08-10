import "server-only"

import { getPrisma } from "@/lib/server/db"
import { assertAdmin } from "@/lib/server/dal/auth"

function imageUrl(objectKey: string) {
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
    optionValues: Record<string, string>
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
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      variants: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: {
          id: true,
          price: true,
          compareAtPrice: true,
          inventoryQuantity: true,
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
    const variant = product.variants[0]
    const image = product.images[0]

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: variant?.price.toString() ?? null,
      compareAtPrice: variant?.compareAtPrice?.toString() ?? null,
      isInStock: Boolean(variant && variant.inventoryQuantity > 0),
      image: image
        ? {
            url: imageUrl(image.objectKey),
            altText: image.altText,
          }
        : null,
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

function variantOptionValues(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, optionValue]) =>
        typeof key === "string" && typeof optionValue === "string",
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
