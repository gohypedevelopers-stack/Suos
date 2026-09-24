import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

async function main() {
  const databaseUrl = process.env.DATABASE_URL || "postgresql://suos:suos@127.0.0.1:5432/suos"
  const adapter = new PrismaPg({ connectionString: databaseUrl })
  const prisma = new PrismaClient({ adapter })

  const existingCount = await prisma.banner.count()
  if (existingCount > 0) {
    console.log(`Banners already seeded (${existingCount} found).`)
    return
  }

  await prisma.banner.createMany({
    data: [
      {
        title: "STRAIGHT FIT DENIM",
        subtitle: "100% COTTON • NON STRETCH",
        desktopImageKey: "/home-page-content/hero-1.png",
        mobileImageKey: "/home-page-content/hero-mobile.jpg",
        ctaText: "EXPLORE COLLECTION",
        ctaLink: "/collections",
        placement: "HERO",
        textAlignment: "CENTER",
        overlayOpacity: 15,
        isActive: true,
        position: 0,
      },
      {
        title: "THE DENIM EDIT",
        subtitle: "TIMELESS SILHOUETTES",
        desktopImageKey: "/home-page-content/hero-2.png",
        mobileImageKey: null,
        ctaText: "SHOP THE EDIT",
        ctaLink: "/collections",
        placement: "MIDDLE",
        textAlignment: "CENTER",
        overlayOpacity: 10,
        isActive: true,
        position: 0,
      },
      {
        title: "ESSENTIAL CRAFTSMANSHIP",
        subtitle: "MADE TO LAST A LIFETIME",
        desktopImageKey: "/images/products/product15.png",
        mobileImageKey: null,
        ctaText: "DISCOVER MORE",
        ctaLink: "/collections",
        placement: "BOTTOM",
        textAlignment: "CENTER",
        overlayOpacity: 10,
        isActive: true,
        position: 0,
      },
    ],
  })

  console.log("Successfully seeded initial homepage banners!")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
