import "server-only"

import { assertAdmin } from "@/lib/server/dal/auth"
import { getPrisma } from "@/lib/server/db"

function imageUrl(objectKey: string | null) {
  if (!objectKey) {
    return null
  }

  if (objectKey.startsWith("uploads/")) {
    return `/${objectKey}`
  }

  const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "")
  return baseUrl ? `${baseUrl}/${objectKey}` : null
}

export type AdminCollectionListItem = {
  id: string
  title: string
  slug: string
  description: string | null
  isPublished: boolean
  productCount: number
  image: { url: string | null; altText: string | null } | null
}

export type AdminCollectionProduct = {
  id: string
  title: string
  sku: string | null
  price: string | null
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  image: { url: string | null; altText: string | null } | null
}

export type AdminCollectionEditor = {
  id: string
  title: string
  slug: string
  description: string | null
  isPublished: boolean
  image: { objectKey: string; url: string | null; altText: string | null } | null
  products: AdminCollectionProduct[]
}

function toCollectionProduct(product: {
  id: string
  title: string
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  variants: { sku: string; price: { toString(): string } }[]
  images: { objectKey: string; altText: string | null }[]
}): AdminCollectionProduct {
  const variant = product.variants[0]
  const image = product.images[0]

  return {
    id: product.id,
    title: product.title,
    status: product.status,
    sku: variant?.sku ?? null,
    price: variant?.price.toString() ?? null,
    image: image
      ? { url: imageUrl(image.objectKey), altText: image.altText }
      : null,
  }
}

export async function listCollectionsForAdmin(): Promise<
  AdminCollectionListItem[]
> {
  await assertAdmin()
  const prisma = getPrisma()
  const collections = await prisma.collection.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      isPublished: true,
      imageObjectKey: true,
      imageAltText: true,
      _count: { select: { products: true } },
    },
  })

  return collections.map((collection) => ({
    id: collection.id,
    title: collection.title,
    slug: collection.slug,
    description: collection.description,
    isPublished: collection.isPublished,
    productCount: collection._count.products,
    image: collection.imageObjectKey
      ? {
          url: imageUrl(collection.imageObjectKey),
          altText: collection.imageAltText,
        }
      : null,
  }))
}

export async function listProductsForCollectionAssignment(): Promise<
  AdminCollectionProduct[]
> {
  await assertAdmin()
  const prisma = getPrisma()
  const products = await prisma.product.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      status: true,
      variants: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { sku: true, price: true },
      },
      images: {
        orderBy: { position: "asc" },
        take: 1,
        select: { objectKey: true, altText: true },
      },
    },
  })

  return products.map(toCollectionProduct)
}

export async function getCollectionForAdmin(
  collectionId: string,
): Promise<AdminCollectionEditor | null> {
  await assertAdmin()
  const prisma = getPrisma()
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      isPublished: true,
      imageObjectKey: true,
      imageAltText: true,
      products: {
        orderBy: { position: "asc" },
        select: {
          product: {
            select: {
              id: true,
              title: true,
              status: true,
              variants: {
                orderBy: { createdAt: "asc" },
                take: 1,
                select: { sku: true, price: true },
              },
              images: {
                orderBy: { position: "asc" },
                take: 1,
                select: { objectKey: true, altText: true },
              },
            },
          },
        },
      },
    },
  })

  if (!collection) {
    return null
  }

  return {
    id: collection.id,
    title: collection.title,
    slug: collection.slug,
    description: collection.description,
    isPublished: collection.isPublished,
    image: collection.imageObjectKey
      ? {
          objectKey: collection.imageObjectKey,
          url: imageUrl(collection.imageObjectKey),
          altText: collection.imageAltText,
        }
      : null,
    products: collection.products.map(({ product }) => toCollectionProduct(product)),
  }
}
