import { PrismaClient } from '../generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL || "postgresql://suos:suosghm@2026@127.0.0.1:5433/suos"
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database with sample products...')

  // Create a default category
  const category = await prisma.category.upsert({
    where: { slug: 'new-arrivals' },
    update: {},
    create: {
      name: 'New Arrivals',
      slug: 'new-arrivals',
      status: 'ACTIVE',
      visible: true,
    },
  })

  // Sample data to insert
  const sampleProducts = [
    {
      title: 'Bootcut Denim',
      slug: 'bootcut-denim',
      price: 3000,
      images: [
        '/images/products/product1.png',
        '/images/products/product5.png',
        '/images/products/product9.png',
        '/images/products/product13.png',
      ],
      colors: [{ name: 'Royal Brown', value: '#0a1a2b' }],
      sizes: ['28', '32', '36', '42'],
    },
    {
      title: 'Monochrome Jacket',
      slug: 'monochrome-jacket',
      price: 4500,
      images: [
        '/images/products/product2.png',
        '/images/products/product6.png',
        '/images/products/product10.png',
        '/images/products/product14.png',
      ],
      colors: [{ name: 'Navy', value: '#15436b' }],
      sizes: ['S', 'M', 'L'],
    },
    {
      title: 'Tailored Suit',
      slug: 'tailored-suit',
      price: 8900,
      images: [
        '/images/products/product3.png',
        '/images/products/product7.png',
        '/images/products/product11.png',
        '/images/products/product15.png',
      ],
      colors: [{ name: 'Black', value: '#000000' }],
      sizes: ['38', '40', '42'],
    },
    {
      title: 'All-Black Outfit',
      slug: 'all-black-outfit',
      price: 6500,
      images: [
        '/images/products/product4.png',
        '/images/products/product8.png',
        '/images/products/product12.png',
        '/images/products/product5-white.png',
      ],
      colors: [{ name: 'Black', value: '#000000' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      title: 'Vintage Bootcut Denim',
      slug: 'vintage-bootcut-denim',
      price: 3200,
      images: [
        '/home-page-content/product-monochrome.png',
        '/images/products/product1_b.png',
        '/images/products/product9_b.png',
        '/images/products/product13_b.png',
      ],
      colors: [{ name: 'Faded Blue', value: '#5b7c99' }],
      sizes: ['28', '32', '36', '42'],
    },
    {
      title: 'Classic Monochrome Jacket',
      slug: 'classic-monochrome-jacket',
      price: 4800,
      images: [
        '/home-page-content/product-allblack.png',
        '/images/products/product2_b.png',
        '/images/products/product10_b.png',
        '/images/products/product14_b.png',
      ],
      colors: [{ name: 'Charcoal', value: '#333333' }],
      sizes: ['S', 'M', 'L'],
    },
    {
      title: 'Elegant Tailored Suit',
      slug: 'elegant-tailored-suit',
      price: 9500,
      images: [
        '/home-page-content/product-vintage.png',
        '/images/products/product3_b.png',
        '/images/products/product11_b.png',
        '/images/products/product15_b.png',
      ],
      colors: [{ name: 'Midnight Blue', value: '#191970' }],
      sizes: ['38', '40', '42'],
    },
    {
      title: 'Urban All-Black Outfit',
      slug: 'urban-all-black-outfit',
      price: 6800,
      images: [
        '/home-page-content/product-urban.png',
        '/images/products/product4_b.png',
        '/images/products/product12_b.png',
        '/images/products/product5-white_c.png',
      ],
      colors: [{ name: 'Onyx Black', value: '#0f0f0f' }],
      sizes: ['S', 'M', 'L', 'XL'],
    }
  ]

  for (const p of sampleProducts) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        status: 'ACTIVE',
        categoryId: category.id,
        description: 'This is a beautifully crafted sample product imported into your new database.',
        images: {
          create: p.images.map((img, i) => ({
            objectKey: img,
            altText: p.title,
            position: i,
          }))
        },
        variants: {
          create: p.colors.flatMap(color => 
            p.sizes.map(size => ({
              title: `${color.name} / ${size}`,
              sku: `${p.slug}-${color.name}-${size}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              price: p.price,
              inventoryQuantity: 10,
              optionValues: {
                "Color": color,
                "Size": size
              }
            }))
          )
        }
      }
    })
    console.log(`Created product: ${product.title}`)
  }

  // Create sample collections
  const collectionsData = [
    {
      title: "Denim Edit",
      slug: "denim-edit",
      description: "Structured bootcut and vintage denim cuts crafted for clean movement.",
      imageObjectKey: "/home-page-content/product-urban.png",
      productSlugs: ["bootcut-denim", "vintage-bootcut-denim"],
    },
    {
      title: "Monochrome Collection",
      slug: "monochrome-collection",
      description: "Tailored outerwear, jackets, and all-black tonal essentials.",
      imageObjectKey: "/home-page-content/product-allblack.png",
      productSlugs: ["monochrome-jacket", "classic-monochrome-jacket", "all-black-outfit", "urban-all-black-outfit"],
    },
    {
      title: "Tailored Suits & Sets",
      slug: "tailored-suits",
      description: "Refined sartorial tailoring for elevated day-to-night styling.",
      imageObjectKey: "/home-page-content/product-vintage.png",
      productSlugs: ["tailored-suit", "elegant-tailored-suit"],
    },
  ]

  for (const c of collectionsData) {
    const products = await prisma.product.findMany({
      where: { slug: { in: c.productSlugs } },
      select: { id: true },
    })

    const collection = await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {
        isPublished: true,
      },
      create: {
        title: c.title,
        slug: c.slug,
        description: c.description,
        isPublished: true,
        imageObjectKey: c.imageObjectKey,
        imageAltText: c.title,
        products: {
          create: products.map((p, i) => ({
            productId: p.id,
            position: i,
          })),
        },
      },
    })
    console.log(`Created collection: ${collection.title}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
