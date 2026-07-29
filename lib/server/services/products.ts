import "server-only"

import { Prisma } from "@/generated/prisma/client"
import { assertAdmin } from "@/lib/server/dal/auth"
import { getPrisma } from "@/lib/server/db"
import {
  productInputSchema,
  type ProductInput,
} from "@/lib/validations/product"
import { attachProductImageSchema } from "@/lib/validations/upload"

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180)
}

async function createAvailableSlug(requestedSlug: string) {
  const prisma = getPrisma()
  const baseSlug = slugify(requestedSlug) || "product"
  const matchingSlugs = await prisma.product.findMany({
    where: {
      OR: [{ slug: baseSlug }, { slug: { startsWith: `${baseSlug}-` } }],
    },
    select: { slug: true },
  })

  const usedSlugs = new Set(matchingSlugs.map((product) => product.slug))

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 2
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1
  }

  return `${baseSlug}-${suffix}`
}

export async function createProduct(input: ProductInput) {
  await assertAdmin()
  const prisma = getPrisma()
  const product = productInputSchema.parse(input)
  const slug = await createAvailableSlug(product.slug ?? product.title)

  return prisma.product.create({
    data: {
      title: product.title,
      slug,
      description: product.description || null,
      status: product.status,
      categoryId: product.categoryId || null,
      variants: {
        create: {
          sku: product.sku,
          price: new Prisma.Decimal(product.price.toFixed(2)),
          compareAtPrice:
            product.compareAtPrice === null
              ? null
              : new Prisma.Decimal(product.compareAtPrice.toFixed(2)),
          inventoryQuantity: product.inventoryQuantity,
        },
      },
    },
    select: {
      id: true,
      slug: true,
    },
  })
}

export async function archiveProduct(productId: string) {
  await assertAdmin()
  const prisma = getPrisma()

  return prisma.product.update({
    where: { id: productId },
    data: { status: "ARCHIVED" },
    select: { id: true },
  })
}

export async function attachProductImage(input: unknown) {
  await assertAdmin()
  const prisma = getPrisma()
  const image = attachProductImageSchema.parse(input)

  const lastImage = await prisma.productImage.findFirst({
    where: { productId: image.productId },
    orderBy: { position: "desc" },
    select: { position: true },
  })

  return prisma.productImage.create({
    data: {
      productId: image.productId,
      objectKey: image.objectKey,
      altText: image.altText || null,
      position: (lastImage?.position ?? -1) + 1,
    },
    select: {
      id: true,
      objectKey: true,
      position: true,
    },
  })
}
