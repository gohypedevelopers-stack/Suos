import { z } from "zod"

export const bannerPlacementSchema = z.enum([
  "HERO",
  "MIDDLE",
  "BOTTOM",
  "EDITORIAL",
  "DENIM_CAROUSEL",
])
export type BannerPlacement = z.infer<typeof bannerPlacementSchema>

export const bannerTextAlignmentSchema = z.enum(["LEFT", "CENTER", "RIGHT"])
export type BannerTextAlignment = z.infer<typeof bannerTextAlignmentSchema>

export const bannerImageObjectKeySchema = z
  .string()
  .trim()
  .min(1, "Image is required.")
  .refine(
    (key) =>
      key.startsWith("/") ||
      key.startsWith("uploads/") ||
      key.startsWith("banners/") ||
      key.startsWith("images/") ||
      key.startsWith("home-page-content/") ||
      /^(?:banners|uploads\/banners)\/\d{4}\/[0-9a-f-]{36}\.(?:avif|jpg|png|webp)$/i.test(key) ||
      /\.(?:avif|jpg|jpeg|png|webp|svg)$/i.test(key),
    "Invalid banner image key",
  )

export const bannerInputSchema = z.object({
  title: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z.string().trim().max(150, "Title must be at most 150 characters.").nullable().optional(),
  ),
  subtitle: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z.string().trim().max(250, "Subtitle must be at most 250 characters.").nullable().optional(),
  ),
  desktopImageKey: bannerImageObjectKeySchema,
  mobileImageKey: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    bannerImageObjectKeySchema.nullable().optional(),
  ),
  ctaText: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z.string().trim().max(60, "Button text must be at most 60 characters.").nullable().optional(),
  ),
  ctaLink: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z.string().trim().max(255, "Destination link must be at most 255 characters.").nullable().optional(),
  ),
  placement: bannerPlacementSchema.default("HERO"),
  textAlignment: bannerTextAlignmentSchema.default("CENTER"),
  overlayOpacity: z.coerce.number().int().min(0).max(100).default(20),
  isActive: z.boolean().default(true),
  position: z.coerce.number().int().min(0).default(0),
})

export type BannerInput = z.infer<typeof bannerInputSchema>

export const reorderBannerSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      position: z.number().int().min(0),
    }),
  ),
})
