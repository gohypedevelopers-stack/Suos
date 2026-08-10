import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AppSidebar } from "@/components/admin-dashboard/app-sidebar"
import { ProductEditor } from "@/components/admin-dashboard/product-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { listCategoryOptionsForAdmin } from "@/lib/server/dal/categories"
import {
  getProductForAdmin,
  listCollectionOptionsForAdmin,
} from "@/lib/server/dal/products"

export const metadata: Metadata = {
  title: "Edit product | SUOS Admin",
  description: "Edit a product in the SUOS admin dashboard.",
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const [product, categories, collections] = await Promise.all([
    getProductForAdmin(productId),
    listCategoryOptionsForAdmin(),
    listCollectionOptionsForAdmin(),
  ])

  if (!product) {
    notFound()
  }

  const primaryVariant = product.variants[0]

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <ProductEditor
            key={product.id}
            categories={categories}
            collections={collections}
            initialProduct={{
              id: product.id,
              title: product.title,
              description: product.description ?? "",
              slug: product.slug,
              status: product.status === "ARCHIVED" ? "DRAFT" : product.status,
              categoryId: product.categoryId ?? "",
              collectionIds: product.collectionIds,
              tags: product.tags,
              price: primaryVariant?.price ?? "0.00",
              compareAtPrice: primaryVariant?.compareAtPrice ?? "",
              inventoryQuantity: String(primaryVariant?.inventoryQuantity ?? 0),
              sku: primaryVariant?.sku ?? "",
              images: product.images.map((image) => ({
                objectKey: image.objectKey,
                url: image.url,
                name: image.altText || product.title,
              })),
              variants: product.variants.map((variant) => ({
                title: variant.title,
                price: Number(variant.price),
                compareAtPrice: variant.compareAtPrice === null
                  ? null
                  : Number(variant.compareAtPrice),
                inventoryQuantity: variant.inventoryQuantity,
                optionValues: variant.optionValues,
              })),
              details: product.details,
            }}
          />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
