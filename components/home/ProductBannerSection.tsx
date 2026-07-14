import Image from "next/image"

export function ProductBannerSection() {
  return (
    <section className="relative aspect-[1440/449] w-full overflow-hidden bg-black">
      <Image
        src="/images/products/product15.png"
        alt="SUOS denim editorial banner"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
    </section>
  )
}
