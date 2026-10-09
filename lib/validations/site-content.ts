import { z } from "zod"

const shortText = z.string().trim().max(200)
const mediumText = z.string().trim().max(1000)
const longText = z.string().trim().max(10000)
const imagePath = z
  .string()
  .trim()
  .min(1, "Choose an image.")
  .max(1024)
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Enter an image path or URL.")

const policyBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: longText }),
  z.object({ type: z.literal("list"), items: z.array(mediumText).max(50) }),
])

const policySectionSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Section ids use lowercase letters, numbers and dashes."),
  title: shortText.min(1, "Enter a section title."),
  navLabel: shortText,
  blocks: z.array(policyBlockSchema).max(100),
  subsections: z
    .array(z.object({ title: shortText.min(1), blocks: z.array(policyBlockSchema).max(50) }))
    .max(20),
})

export const policyContentSchema = z.object({
  title: shortText.min(1),
  metaTitle: shortText,
  metaDescription: mediumText,
  intro: z.array(longText).max(10),
  sections: z.array(policySectionSchema).min(1, "Add at least one section.").max(40),
})

export const siteContentSchemas = {
  announcements: z.object({
    left: shortText,
    center: shortText,
    right: shortText,
    mobile: z.array(shortText.min(1)).min(1, "Add at least one mobile message.").max(10),
  }),
  launchOffer: z.object({
    enabled: z.boolean(),
    label: shortText,
    endsAt: z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date and time."),
    ctaText: shortText.min(1),
    ctaHref: z.string().trim().min(1).max(500),
  }),
  lookbook: z.object({
    slides: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(80),
          image: imagePath,
          alt: shortText,
          objectPosition: z.string().trim().max(40).default("center"),
        }),
      )
      .min(1, "Add at least one slide.")
      .max(24),
  }),
  edits: z.object({
    heading: shortText.min(1),
    tabs: z.array(z.object({ label: shortText.min(1), active: z.boolean() })).max(8),
    slides: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(80),
          image: imagePath,
          alt: shortText,
          label: shortText,
          href: z.string().trim().max(500),
        }),
      )
      .min(1, "Add at least one slide.")
      .max(24),
  }),
  contact: z.object({
    eyebrow: shortText,
    titleLines: z.array(shortText).min(1).max(4),
    description: mediumText,
    phone: shortText,
    phoneHours: shortText,
    email: shortText,
    emailResponse: shortText,
    chatLabel: shortText,
    chatHours: shortText,
    faqs: z.array(z.object({ question: mediumText.min(1), answer: longText.min(1) })).max(30),
  }),
  footer: z.object({
    careEmail: shortText,
    ordersPhone: shortText,
    timings: shortText,
  }),
  returnsPage: z.object({
    title: shortText.min(1),
    image: imagePath,
    conditions: z.array(mediumText.min(1)).max(20),
  }),
  sizeGuide: z.object({
    title: shortText.min(1),
    subtitle: shortText,
    images: z.array(imagePath).max(40),
  }),
  privacyPolicy: policyContentSchema,
  termsPolicy: policyContentSchema,
  shippingPolicy: policyContentSchema,
} as const

export type SiteContentSchemas = typeof siteContentSchemas

export const siteContentKeySchema = z.enum([
  "announcements",
  "launchOffer",
  "lookbook",
  "edits",
  "contact",
  "footer",
  "returnsPage",
  "sizeGuide",
  "privacyPolicy",
  "termsPolicy",
  "shippingPolicy",
])
