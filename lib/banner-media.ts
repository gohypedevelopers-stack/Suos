/** Banner media can be an image or a short looping video (MP4 / WebM). */
export const BANNER_VIDEO_CONTENT_TYPES = ["video/mp4", "video/webm"] as const
export const BANNER_IMAGE_CONTENT_TYPES = ["image/avif", "image/jpeg", "image/png", "image/webp"] as const

export const MAX_BANNER_IMAGE_BYTES = 10 * 1024 * 1024
export const MAX_BANNER_VIDEO_BYTES = 50 * 1024 * 1024

const VIDEO_EXTENSION = /\.(?:mp4|webm)(?:[?#].*)?$/i

export function isVideoMedia(urlOrKey: string | null | undefined): boolean {
  return Boolean(urlOrKey && VIDEO_EXTENSION.test(urlOrKey))
}

export function isBannerVideoContentType(contentType: string): boolean {
  return (BANNER_VIDEO_CONTENT_TYPES as readonly string[]).includes(contentType)
}
