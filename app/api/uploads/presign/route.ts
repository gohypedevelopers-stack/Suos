import { randomUUID } from "node:crypto"

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { getCurrentUser } from "@/lib/server/dal/auth"
import { getR2Env } from "@/lib/server/env"
import { getR2Client } from "@/lib/server/r2"
import { productImageUploadSchema } from "@/lib/validations/upload"

const extensionByContentType = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const input = productImageUploadSchema.safeParse(payload)

  if (!input.success) {
    return Response.json(
      { error: "Invalid upload request" },
      { status: 400 },
    )
  }

  const env = getR2Env()
  const extension = extensionByContentType[input.data.contentType]
  const objectKey = `products/${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`

  let uploadUrl: string
  try {
    uploadUrl = await getSignedUrl(
      getR2Client(),
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: objectKey,
        ContentType: input.data.contentType,
        ContentLength: input.data.size,
        CacheControl: "public, max-age=31536000, immutable",
      }),
      { expiresIn: 5 * 60 },
    )
  } catch {
    return Response.json(
      { error: "Upload service unavailable" },
      { status: 503 },
    )
  }

  return Response.json({
    objectKey,
    uploadUrl,
    publicUrl: `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${objectKey}`,
    expiresIn: 5 * 60,
  })
}
