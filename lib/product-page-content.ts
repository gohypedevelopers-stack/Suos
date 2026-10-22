import { z } from "zod"

/**
 * Per-product storefront copy and imagery that has no column of its own
 * (stored in `products.pageContent`). Images are object keys picked from the
 * product's own Media, so no separate upload flow is needed.
 */
export const PRODUCT_HIGHLIGHT_COUNT = 3

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().max(max).optional().default(""),
  )

export const productHighlightSchema = z.object({
  imageKey: optionalText(512),
  title: optionalText(80),
  text: optionalText(400),
})

export const productPageContentSchema = z.object({
  /** One line under the title (Figma: "A classic bootcut silhouette…"). */
  subtitle: optionalText(240),
  /** e.g. Model is 5'9" wearing a size 32 */
  modelInfo: optionalText(160),
  /** e.g. We recommend sizing down for a closer fit. */
  fitNote: optionalText(240),
  /** Text under the "It's in the Details" heading. */
  highlightsIntro: optionalText(300),
  highlights: z.array(productHighlightSchema).max(PRODUCT_HIGHLIGHT_COUNT).default([]),
  /** Full-width image below "You May Also Like". */
  lifestyleImageKey: optionalText(512),
})

export type ProductHighlight = z.infer<typeof productHighlightSchema>
export type ProductPageContent = z.infer<typeof productPageContentSchema>

export const emptyProductPageContent: ProductPageContent = {
  subtitle: "",
  modelInfo: "",
  fitNote: "",
  highlightsIntro: "",
  highlights: [],
  lifestyleImageKey: "",
}

/** Reads the stored JSON leniently; anything malformed falls back to empty. */
export function parseProductPageContent(value: unknown): ProductPageContent {
  const result = productPageContentSchema.safeParse(value ?? {})
  return result.success ? result.data : emptyProductPageContent
}
