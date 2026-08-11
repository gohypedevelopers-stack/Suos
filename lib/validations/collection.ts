import { z } from "zod"

export const collectionImageObjectKeySchema = z
  .string()
  .regex(
    /^(?:collections|uploads\/collections)\/\d{4}\/[0-9a-f-]{36}\.(?:avif|jpg|png|webp)$/,
    "Invalid collection image key",
  )

export const collectionInputSchema = z.object({
  title: z.string().trim().min(1, "Enter a collection title.").max(120),
  slug: z.string().trim().max(180).default(""),
  description: z.string().trim().max(2_000).default(""),
  isPublished: z.boolean().default(false),
  imageObjectKey: collectionImageObjectKeySchema.nullable().optional(),
  imageAltText: z.string().trim().max(300).nullable().optional(),
  productIds: z
    .array(z.string().trim().min(1))
    .max(500, "A collection can contain at most 500 products.")
    .default([])
    .transform((ids) => [...new Set(ids)]),
})

export type CollectionInput = z.infer<typeof collectionInputSchema>
