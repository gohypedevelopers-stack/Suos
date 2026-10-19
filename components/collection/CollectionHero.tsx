import Image from "next/image"
import Link from "next/link"

export function CollectionHero({
  image,
  alt,
  ctaLabel,
  ctaHref,
  heightClassName = "h-[62vh] min-h-[380px] sm:h-[70vh]",
}: {
  image: string
  alt: string
  ctaLabel?: string
  ctaHref?: string
  heightClassName?: string
}) {
  return (
    <section className={`relative w-full overflow-hidden bg-[#e7e7e4] ${heightClassName}`}>
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      ) : null}

      {ctaLabel && ctaHref ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <Link
            href={ctaHref}
            className="inline-flex h-10 min-w-[150px] items-center justify-center border border-white bg-white/0 px-8 text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-white backdrop-blur-[1px] transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[14px]"
          >
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </section>
  )
}
