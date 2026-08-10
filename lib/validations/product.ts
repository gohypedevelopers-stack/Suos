import { z } from "zod"

export const productImageObjectKeySchema = z
  .string()
  .regex(
    /^(?:products|uploads\/products)\/\d{4}\/[0-9a-f-]{36}\.(?:avif|jpg|png|webp)$/,
    "Invalid product image key",
  )

const optionalMoneySchema = z
  .preprocess(
    (value) => {
      if (value === null || value === undefined || value === "") {
        return null
      }

      return Number(value)
    },
    z.number().finite().nonnegative().max(99_999_999).nullable(),
  )
  .optional()
  .transform((value) => value ?? null)

const requiredMoneySchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined || value === "") {
      return undefined
    }

    return Number(value)
  },
  z.number().finite().nonnegative().max(99_999_999),
)

const requiredQuantitySchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined || value === "") {
      return undefined
    }

    return Number(value)
  },
  z.number().int().min(0).max(10_000_000),
)

const skuSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9][A-Z0-9._-]{1,63}$/)

const optionalSkuSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  skuSchema.optional(),
)

const productVariantSchema = z
  .object({
    title: z.string().trim().min(1).max(120).default("Default"),
    sku: optionalSkuSchema,
    price: requiredMoneySchema,
    compareAtPrice: optionalMoneySchema,
    inventoryQuantity: requiredQuantitySchema,
    optionValues: z.record(z.string().min(1).max(60), z.string().min(1).max(120)).default({}),
  })
  .superRefine((value, context) => {
    if (
      value.compareAtPrice !== null &&
      value.compareAtPrice < value.price
    ) {
      context.addIssue({
        code: "custom",
        path: ["compareAtPrice"],
        message: "Compare-at price must be greater than or equal to the price.",
      })
    }
  })

export const productInputSchema = z
  .object({
    title: z.string().trim().min(2).max(160),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(180)
      .optional(),
    description: z.string().trim().max(10_000).optional(),
    status: z.enum(["DRAFT", "ACTIVE"]).default("DRAFT"),
    categoryId: z.string().trim().min(1).nullable().optional(),
    sku: optionalSkuSchema,
    price: requiredMoneySchema,
    compareAtPrice: optionalMoneySchema,
    inventoryQuantity: requiredQuantitySchema,
    variants: z.array(productVariantSchema).max(100).default([]),
    images: z.array(productImageObjectKeySchema).max(20).default([]),
    collectionIds: z
      .array(z.string().trim().min(1))
      .max(100)
      .default([])
      .transform((ids) => [...new Set(ids)]),
    tags: z
      .array(z.string().trim().min(1).max(60))
      .max(30)
      .default([])
      .transform((tags) => [...new Set(tags)]),
    details: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(80),
          value: z.string().trim().min(1).max(2_000),
        }),
      )
      .max(30)
      .default([]),
  })
  .superRefine((value, context) => {
    if (
      value.compareAtPrice !== null &&
      value.compareAtPrice < value.price
    ) {
      context.addIssue({
        code: "custom",
        path: ["compareAtPrice"],
        message: "Compare-at price must be greater than or equal to the price.",
      })
    }
  })

export type ProductInput = z.infer<typeof productInputSchema>
