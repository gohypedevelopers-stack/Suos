import type { MetadataRoute } from "next"

import { getPrisma } from "@/lib/server/db"
import { getSiteUrl } from "@/lib/server/env"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/collections`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/size-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/returns`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/returns-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/track-order`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]

  try {
    const prisma = getPrisma()
    const [products, collections] = await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      }),
      prisma.collection.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
        take: 1000,
      }),
    ])

    return [
      ...staticPages,
      ...collections.map((collection) => ({
        url: `${siteUrl}/collections/${collection.slug}`,
        lastModified: collection.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: `${siteUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ]
  } catch (error) {
    console.error("[sitemap] catalogue unavailable, serving static pages only", error)
    return staticPages
  }
}
