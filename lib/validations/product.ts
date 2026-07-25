import { z } from "zod"

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
    sku: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9][A-Z0-9._-]{1,63}$/),
    price: z.coerce.number().finite().nonnegative().max(99_999_999),
    compareAtPrice: optionalMoneySchema,
    inventoryQuantity: z.coerce.number().int().min(0).max(10_000_000),
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
