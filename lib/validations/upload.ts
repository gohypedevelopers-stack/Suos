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
    /^uploads\/(?:products|categories|collections|banners)\/\d{4}\/[0-9a-f-]{36}\.(?:avif|jpg|png|webp)$/,
    "Invalid local image key",
  )

const imageUploadBaseSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  contentType: imageContentTypeSchema,
  size: z.number().int().positive().max(10 * 1024 * 1024).optional(),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024).optional(),
})

export const imageUploadSchema = imageUploadBaseSchema
  .refine((data) => data.size !== undefined || data.sizeBytes !== undefined, {
    message: "Image size is required",
    path: ["size"],
  })
  .transform((data) => ({
    filename: data.filename,
    contentType: data.contentType,
    size: (data.size ?? data.sizeBytes) as number,
  }))

export const productImageUploadSchema = imageUploadSchema

export const imageUploadRequestSchema = imageUploadBaseSchema
  .extend({
    scope: z.enum(["product", "category", "collection", "banner"]).default("product"),
  })
  .refine((data) => data.size !== undefined || data.sizeBytes !== undefined, {
    message: "Image size is required",
    path: ["size"],
  })
  .transform((data) => ({
    filename: data.filename,
    contentType: data.contentType,
    scope: data.scope,
    size: (data.size ?? data.sizeBytes) as number,
  }))

export type ImageUploadRequest = z.infer<typeof imageUploadRequestSchema>

export const attachProductImageSchema = z.object({
  productId: z.string().min(1),
  objectKey: productImageObjectKeySchema,
  altText: z.string().trim().max(300).nullable().optional(),
})
