import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.")
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl })
  const prisma = new PrismaClient({ adapter })

  console.log("Seeding Editorial and Denim Carousel banners...")

  // 1. Editorial banners (Slots 0, 1, 2)
  const existingEditorial = await prisma.banner.findMany({
    where: { placement: "EDITORIAL" },
  })

  if (existingEditorial.length === 0) {
    await prisma.banner.createMany({
      data: [
        {
          title: "Model sitting in a denim set on a chair",
          subtitle: null,
          desktopImageKey: "/images/products/product6.png",
          mobileImageKey: null,
          ctaText: null,
          ctaLink: "/collections",
          placement: "EDITORIAL",
          textAlignment: "CENTER",
          overlayOpacity: 0,
          isActive: true,
          position: 0,
        },
        {
          title: "Model sitting in denim beside greenery",
          subtitle: null,
          desktopImageKey: "/images/products/product7.png",
          mobileImageKey: null,
          ctaText: null,
          ctaLink: "/collections",
          placement: "EDITORIAL",
          textAlignment: "CENTER",
          overlayOpacity: 0,
          isActive: true,
          position: 1,
        },
        {
          title: "Model reclining in a denim look across stacked screens",
          subtitle: null,
          desktopImageKey: "/images/products/product8.png",
          mobileImageKey: null,
          ctaText: null,
          ctaLink: "/collections",
          placement: "EDITORIAL",
          textAlignment: "CENTER",
          overlayOpacity: 0,
          isActive: true,
          position: 2,
        },
      ],
    })
    console.log("Created 3 default Editorial Grid banners in database.")
  } else {
    console.log(`Editorial banners already exist (${existingEditorial.length} found).`)
  }

  // 2. Denim Carousel banners
  const existingCarousel = await prisma.banner.findMany({
    where: { placement: "DENIM_CAROUSEL" },
  })

  if (existingCarousel.length === 0) {
    await prisma.banner.createMany({
      data: [
        {
          title: "Skinny Denim",
          subtitle: "Skinny",
          desktopImageKey: "/images/products/product5-white.png",
          mobileImageKey: null,
          ctaText: null,
          ctaLink: "/collections",
          placement: "DENIM_CAROUSEL",
          textAlignment: "CENTER",
          overlayOpacity: 0,
          isActive: true,
          position: 0,
        },
        {
          title: "Bootcut Denim",
          subtitle: "Bootcut",
          desktopImageKey: "/images/products/product5-white.png",
          mobileImageKey: null,
          ctaText: null,
          ctaLink: "/collections",
          placement: "DENIM_CAROUSEL",
          textAlignment: "CENTER",
          overlayOpacity: 0,
          isActive: true,
          position: 1,
        },
        {
          title: "Low-Rise Denim",
          subtitle: "Low-Rise",
          desktopImageKey: "/images/products/product5-white.png",
          mobileImageKey: null,
          ctaText: null,
          ctaLink: "/collections",
          placement: "DENIM_CAROUSEL",
          textAlignment: "CENTER",
          overlayOpacity: 0,
          isActive: true,
          position: 2,
        },
        {
          title: "Straight Denim",
          subtitle: "Straight",
          desktopImageKey: "/images/products/product5-white.png",
          mobileImageKey: null,
          ctaText: null,
          ctaLink: "/collections",
          placement: "DENIM_CAROUSEL",
          textAlignment: "CENTER",
          overlayOpacity: 0,
          isActive: true,
          position: 3,
        },
        {
          title: "Relaxed Denim",
          subtitle: "Relaxed",
          desktopImageKey: "/images/products/product5-white.png",
          mobileImageKey: null,
          ctaText: null,
          ctaLink: "/collections",
          placement: "DENIM_CAROUSEL",
          textAlignment: "CENTER",
          overlayOpacity: 0,
          isActive: true,
          position: 4,
        },
      ],
    })
    console.log("Created 5 default Denim Carousel slides in database.")
  } else {
    console.log(`Denim Carousel banners already exist (${existingCarousel.length} found).`)
  }

  console.log("Done!")
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
