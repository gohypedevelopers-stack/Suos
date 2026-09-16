import Image from "next/image"

export function MotionBannerSection() {
  return (
    <section className="relative aspect-[2172/724] w-full overflow-hidden bg-black">
      <Image
        src="/home-page-content/hero-2.png"
        alt="Editorial fashion banner"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
    </section>
  )
}

