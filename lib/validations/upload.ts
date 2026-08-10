import { z } from "zod"

import { productImageObjectKeySchema } from "@/lib/validations/product"

export const imageContentTypeSchema = z.enum([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
])

export const localImageObjectKeySchema = z
  .string()
  .regex(
    /^uploads\/(?:products|categories)\/\d{4}\/[0-9a-f-]{36}\.(?:avif|jpg|png|webp)$/,
    "Invalid local image key",
  )

const imageUploadSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  contentType: imageContentTypeSchema,
  size: z.number().int().positive().max(10 * 1024 * 1024),
})

export const productImageUploadSchema = imageUploadSchema

export const imageUploadRequestSchema = imageUploadSchema.extend({
  scope: z.enum(["product", "category"]).default("product"),
})

export type ImageUploadRequest = z.infer<typeof imageUploadRequestSchema>

export const attachProductImageSchema = z.object({
  productId: z.string().min(1),
  objectKey: productImageObjectKeySchema,
  altText: z.string().trim().max(300).nullable().optional(),
})
