"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import {
  attachProductImage,
  archiveProduct,
  createProduct,
} from "@/lib/server/services/products"
import { productInputSchema } from "@/lib/validations/product"

export type ProductActionState =
  | { status: "idle" }
  | { status: "success"; productId: string }
  | { status: "error"; message: string; fields?: Record<string, string[]> }

export async function createProductAction(
  input: unknown,
): Promise<ProductActionState> {
  const result = productInputSchema.safeParse(input)

  if (!result.success) {
    return {
      status: "error",
      message: "Check the highlighted product fields.",
      fields: z.flattenError(result.error).fieldErrors,
    }
  }

  try {
    const product = await createProduct(result.data)
    revalidatePath("/dashboard/products")
    revalidatePath("/collections")

    return {
      status: "success",
      productId: product.id,
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return { status: "error", message: "Sign in to continue." }
    }

    if (error instanceof Error && error.message === "Forbidden") {
      return { status: "error", message: "Administrator access is required." }
    }

    return {
      status: "error",
      message: "The product could not be saved. Try again.",
    }
  }
}

export async function archiveProductAction(productId: string) {
  const id = z.string().min(1).parse(productId)
  await archiveProduct(id)
  revalidatePath("/dashboard/products")
  revalidatePath("/collections")

  return { success: true }
}

export async function attachProductImageAction(input: unknown) {
  const image = await attachProductImage(input)
  revalidatePath("/dashboard/products")

  return {
    success: true,
    imageId: image.id,
  }
}
