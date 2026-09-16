import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

const databaseUrl = process.env.DATABASE_URL || "postgresql://suos:suosghm@2026@127.0.0.1:5433/suos"

const adapter = new PrismaPg({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5_000,
  max: 1,
})
const prisma = new PrismaClient({ adapter })

const newImages = [
  "/home-page-content/product-urban.png",
  "/home-page-content/product-vintage.png",
  "/home-page-content/product-allblack.png",
  "/home-page-content/product-monochrome.png",
]

async function main() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, title: true, slug: true, images: { select: { id: true } } },
    })

    console.log(`Found ${products.length} products to update.`)

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const newImg = newImages[i]

      // Delete existing images for this product or update first image
      await prisma.productImage.deleteMany({
        where: { productId: product.id },
      })

      await prisma.productImage.create({
        data: {
          productId: product.id,
          objectKey: newImg,
          altText: product.title,
          position: 0,
        },
      })

      console.log(`Updated product ${product.title} (${product.id}) with image ${newImg}`)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
