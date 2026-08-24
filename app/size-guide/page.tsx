import Image from "next/image"

export const metadata = {
  title: "Size Guide | SUOS",
  description: "View our comprehensive size guide to find your perfect fit.",
}

const sizeGuideImages = [
  // SU02 series
  ...Array.from({ length: 7 }, (_, i) => `/size-charts/SU022026-27_TECHPACK_page_${i + 1}.png`),
  // SU20 series
  ...Array.from({ length: 8 }, (_, i) => `/size-charts/SU202026-27_TECHPACK_page_${i + 1}.png`),
]

export default function SizeGuidePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center bg-white py-10 md:py-20">
      <div className="mb-12 space-y-4 px-5 text-center">
        <h1 className="font-heading text-4xl font-normal uppercase tracking-tight sm:text-5xl">
          Size Guide
        </h1>
        <p className="font-sans text-sm font-normal uppercase tracking-wide text-black/60">
          Find your perfect fit
        </p>
      </div>

      <div className="flex w-full flex-col items-center">
        {sizeGuideImages.map((src, index) => (
          <div key={src} className="relative w-full max-w-4xl" style={{ minHeight: "600px" }}>
            <Image
              src={src}
              alt={`Size guide page ${index + 1}`}
              width={1600}
              height={2000}
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
