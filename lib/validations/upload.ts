import { z } from "zod"

export const productImageUploadSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  contentType: z.enum([
    "image/avif",
    "image/jpeg",
    "image/png",
    "image/webp",
  ]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
})

export const attachProductImageSchema = z.object({
  productId: z.string().min(1),
  objectKey: z
    .string()
    .regex(
      /^products\/\d{4}\/[0-9a-f-]{36}\.(?:avif|jpg|png|webp)$/,
      "Invalid product image key",
    ),
  altText: z.string().trim().max(300).nullable().optional(),
})
