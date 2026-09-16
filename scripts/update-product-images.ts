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
  "/home page content/ChatGPT Image Sep 16, 2026, 12_09_28 PM.png",
  "/home page content/ChatGPT Image Sep 16, 2026, 12_09_37 PM.png",
  "/home page content/ChatGPT Image Sep 16, 2026, 12_09_43 PM.png",
  "/home page content/ChatGPT Image Sep 16, 2026, 12_09_49 PM.png",
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
