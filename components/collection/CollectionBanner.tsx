import Image from "next/image"
import Link from "next/link"

/** Full-width editorial banner image, optionally linking somewhere. */
export function CollectionBanner({
  image,
  alt,
  href,
}: {
  image: string
  alt: string
  href?: string
}) {
  if (!image) return null

  const content = (
    <Image
      src={image}
      alt={alt}
      fill
      sizes="100vw"
      className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
    />
  )

  const className =
    "group relative block h-[48vh] min-h-[300px] w-full overflow-hidden bg-[#e7e7e4] sm:h-[64vh]"

  return href ? (
    <Link href={href} className={className} aria-label={alt}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}
