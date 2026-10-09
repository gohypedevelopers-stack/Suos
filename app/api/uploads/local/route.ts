import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

import { z } from "zod"

import { hasPermission, type PermissionKey } from "@/lib/permissions"
import { getCurrentUser } from "@/lib/server/dal/auth"
import {
  imageContentTypeSchema,
  localImageObjectKeySchema,
} from "@/lib/validations/upload"

const maxImageSize = 10 * 1024 * 1024

const localUploadSchema = z.object({
  objectKey: localImageObjectKeySchema,
  contentType: imageContentTypeSchema,
})

export async function PUT(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "ADMIN" && user.role !== "SUB_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const url = new URL(request.url)
  const input = localUploadSchema.safeParse({
    objectKey: url.searchParams.get("objectKey"),
    contentType: url.searchParams.get("contentType"),
  })

  if (!input.success) {
    return Response.json({ error: "Invalid upload request" }, { status: 400 })
  }

  const folderPermission: Record<string, PermissionKey> = {
    products: "products.manage",
    categories: "categories.manage",
    collections: "collections.manage",
    banners: "banners.manage",
  }
  const folder = input.data.objectKey.split("/")[1] ?? "products"
  const requiredPermission = folderPermission[folder] ?? "products.manage"
  if (!hasPermission(user, requiredPermission)) {
    return Response.json(
      { error: `You don't have the "${requiredPermission}" permission.` },
      { status: 403 },
    )
  }

  const requestContentType = request.headers.get("content-type")?.split(";", 1)[0]
  if (requestContentType !== input.data.contentType) {
    return Response.json({ error: "Invalid image content type" }, { status: 400 })
  }

  const image = new Uint8Array(await request.arrayBuffer())
  if (image.byteLength === 0 || image.byteLength > maxImageSize) {
    return Response.json({ error: "Image must be between 1 byte and 10 MB." }, { status: 400 })
  }

  const destination = resolve(process.cwd(), "public", input.data.objectKey)
  const publicDirectory = resolve(process.cwd(), "public", "uploads")
  if (
    !destination.startsWith(`${publicDirectory}\\`) &&
    !destination.startsWith(`${publicDirectory}/`)
  ) {
    return Response.json({ error: "Invalid upload destination" }, { status: 400 })
  }

  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, image)

  return Response.json({ success: true })
}
