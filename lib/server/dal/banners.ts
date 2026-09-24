import "server-only"

import { assertAdmin } from "@/lib/server/dal/auth"
import { getPrisma } from "@/lib/server/db"
import type { BannerPlacement, BannerTextAlignment } from "@/lib/validations/banner"

function imageUrl(objectKey: string | null | undefined): string | null {
  if (!objectKey) return null
  if (objectKey.startsWith("http://") || objectKey.startsWith("https://")) {
    return objectKey
  }
  if (objectKey.startsWith("/")) {
    return objectKey
  }
  if (objectKey.startsWith("uploads/")) {
    return `/${objectKey}`
  }
  const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "")
  return baseUrl ? `${baseUrl}/${objectKey}` : `/${objectKey}`
}

export type AdminBannerListItem = {
  id: string
  title: string | null
  subtitle: string | null
  desktopImageUrl: string
  desktopImageKey: string
  mobileImageUrl: string | null
  mobileImageKey: string | null
  ctaText: string | null
  ctaLink: string | null
  placement: BannerPlacement
  textAlignment: BannerTextAlignment
  overlayOpacity: number
  isActive: boolean
  position: number
  updatedAt: string
}

export type AdminBannerDetail = {
  id: string
  title: string | null
  subtitle: string | null
  desktopImageKey: string
  desktopImageUrl: string
  mobileImageKey: string | null
  mobileImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  placement: BannerPlacement
  textAlignment: BannerTextAlignment
  overlayOpacity: number
  isActive: boolean
  position: number
}

export type HomeHeroBanner = {
  id: string
  title: string | null
  subtitle: string | null
  desktopImageUrl: string
  mobileImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  textAlignment: BannerTextAlignment
  overlayOpacity: number
}

export type HomeBannerSectionItem = {
  id: string
  title: string | null
  subtitle: string | null
  desktopImageUrl: string
  mobileImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  overlayOpacity: number
}

export type HomeBanners = {
  hero: HomeHeroBanner[]
  middle: HomeBannerSectionItem | null
  bottom: HomeBannerSectionItem | null
}

export async function listBannersForAdmin(): Promise<AdminBannerListItem[]> {
  await assertAdmin()
  const prisma = getPrisma()

  if (!prisma || !("banner" in prisma) || !prisma.banner) {
    return []
  }

  const banners = await prisma.banner.findMany({
    orderBy: [
      { placement: "asc" },
      { position: "asc" },
      { createdAt: "desc" },
    ],
  })

  return banners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    desktopImageUrl: imageUrl(banner.desktopImageKey) ?? banner.desktopImageKey,
    desktopImageKey: banner.desktopImageKey,
    mobileImageUrl: imageUrl(banner.mobileImageKey),
    mobileImageKey: banner.mobileImageKey,
    ctaText: banner.ctaText,
    ctaLink: banner.ctaLink,
    placement: banner.placement as BannerPlacement,
    textAlignment: banner.textAlignment as BannerTextAlignment,
    overlayOpacity: banner.overlayOpacity,
    isActive: banner.isActive,
    position: banner.position,
    updatedAt: banner.updatedAt.toISOString(),
  }))
}

export async function listHeroSlidesForAdmin(): Promise<AdminBannerListItem[]> {
  await assertAdmin()
  const prisma = getPrisma()

  if (!prisma || !("banner" in prisma) || !prisma.banner) {
    return []
  }

  const banners = await prisma.banner.findMany({
    where: { placement: "HERO" },
    orderBy: [
      { position: "asc" },
      { createdAt: "asc" },
    ],
  })

  return banners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    desktopImageUrl: imageUrl(banner.desktopImageKey) ?? banner.desktopImageKey,
    desktopImageKey: banner.desktopImageKey,
    mobileImageUrl: imageUrl(banner.mobileImageKey),
    mobileImageKey: banner.mobileImageKey,
    ctaText: banner.ctaText,
    ctaLink: banner.ctaLink,
    placement: banner.placement as BannerPlacement,
    textAlignment: banner.textAlignment as BannerTextAlignment,
    overlayOpacity: banner.overlayOpacity,
    isActive: banner.isActive,
    position: banner.position,
    updatedAt: banner.updatedAt.toISOString(),
  }))
}

export async function getBannerForAdmin(id: string): Promise<AdminBannerDetail | null> {
  await assertAdmin()
  const prisma = getPrisma()

  if (!prisma || !("banner" in prisma) || !prisma.banner) {
    return null
  }

  const banner = await prisma.banner.findUnique({
    where: { id },
  })

  if (!banner) return null

  return {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    desktopImageKey: banner.desktopImageKey,
    desktopImageUrl: imageUrl(banner.desktopImageKey) ?? banner.desktopImageKey,
    mobileImageKey: banner.mobileImageKey,
    mobileImageUrl: imageUrl(banner.mobileImageKey),
    ctaText: banner.ctaText,
    ctaLink: banner.ctaLink,
    placement: banner.placement as BannerPlacement,
    textAlignment: banner.textAlignment as BannerTextAlignment,
    overlayOpacity: banner.overlayOpacity,
    isActive: banner.isActive,
    position: banner.position,
  }
}

export async function getHomeBanners(): Promise<HomeBanners> {
  const defaultFallback: HomeBanners = {
    hero: [
      {
        id: "default-hero",
        title: null,
        subtitle: null,
        desktopImageUrl: "/home-page-content/hero-1.png",
        mobileImageUrl: "/home-page-content/hero-mobile.jpg",
        ctaText: "EXPLORE COLLECTION",
        ctaLink: "/collections",
        textAlignment: "CENTER",
        overlayOpacity: 15,
      },
    ],
    middle: {
      id: "default-middle",
      title: null,
      subtitle: null,
      desktopImageUrl: "/home-page-content/hero-2.png",
      mobileImageUrl: null,
      ctaText: null,
      ctaLink: "/collections",
      overlayOpacity: 0,
    },
    bottom: {
      id: "default-bottom",
      title: null,
      subtitle: null,
      desktopImageUrl: "/images/products/product15.png",
      mobileImageUrl: null,
      ctaText: null,
      ctaLink: "/collections",
      overlayOpacity: 0,
    },
  }

  try {
    const prisma = getPrisma()

    if (!prisma || !("banner" in prisma) || !prisma.banner) {
      return defaultFallback
    }

    const activeBanners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
    })

    const heroBanners = activeBanners.filter((b) => b.placement === "HERO")
    const middleBanners = activeBanners.filter((b) => b.placement === "MIDDLE")
    const bottomBanners = activeBanners.filter((b) => b.placement === "BOTTOM")

    const hero: HomeHeroBanner[] =
      heroBanners.length > 0
        ? heroBanners.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            desktopImageUrl: imageUrl(b.desktopImageKey) ?? b.desktopImageKey,
            mobileImageUrl: imageUrl(b.mobileImageKey),
            ctaText: b.ctaText,
            ctaLink: b.ctaLink,
            textAlignment: (b.textAlignment as BannerTextAlignment) || "CENTER",
            overlayOpacity: b.overlayOpacity,
          }))
        : defaultFallback.hero

    const hasConfiguredBanners = activeBanners.length > 0
    const middleBanner = middleBanners[0]
    const middle: HomeBannerSectionItem | null = middleBanner
      ? {
          id: middleBanner.id,
          title: middleBanner.title,
          subtitle: middleBanner.subtitle,
          desktopImageUrl: imageUrl(middleBanner.desktopImageKey) ?? middleBanner.desktopImageKey,
          mobileImageUrl: imageUrl(middleBanner.mobileImageKey),
          ctaText: middleBanner.ctaText,
          ctaLink: middleBanner.ctaLink,
          overlayOpacity: middleBanner.overlayOpacity,
        }
      : hasConfiguredBanners ? null : defaultFallback.middle

    const bottomBanner = bottomBanners[0]
    const bottom: HomeBannerSectionItem | null = bottomBanner
      ? {
          id: bottomBanner.id,
          title: bottomBanner.title,
          subtitle: bottomBanner.subtitle,
          desktopImageUrl: imageUrl(bottomBanner.desktopImageKey) ?? bottomBanner.desktopImageKey,
          mobileImageUrl: imageUrl(bottomBanner.mobileImageKey),
          ctaText: bottomBanner.ctaText,
          ctaLink: bottomBanner.ctaLink,
          overlayOpacity: bottomBanner.overlayOpacity,
        }
      : hasConfiguredBanners ? null : defaultFallback.bottom

    return { hero, middle, bottom }
  } catch (error) {
    console.error("Error retrieving banners in getHomeBanners:", error)
    return defaultFallback
  }
}
