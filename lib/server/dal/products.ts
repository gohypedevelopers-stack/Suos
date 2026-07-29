import "server-only"

import { getPrisma } from "@/lib/server/db"
import { assertAdmin } from "@/lib/server/dal/auth"

function imageUrl(objectKey: string) {
  const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "")
  return baseUrl ? `${baseUrl}/${objectKey}` : null
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

export async function listProductsForAdmin() {
  await assertAdmin()

  const prisma = getPrisma()
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      category: {
        select: {
          name: true,
        },
      },
      variants: {
        select: {
          price: true,
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
