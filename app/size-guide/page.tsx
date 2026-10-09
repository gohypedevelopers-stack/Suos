import Image from "next/image"

import { getSiteContent } from "@/lib/server/dal/site-content"

export const metadata = {
  title: "Size Guide | SUOS",
  description: "View our comprehensive size guide to find your perfect fit.",
}

export const dynamic = "force-dynamic"

export default async function SizeGuidePage() {
  const { sizeGuide } = await getSiteContent()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center bg-white py-10 md:py-20">
      <div className="mb-12 space-y-4 px-5 text-center">
        <h1 className="font-heading text-4xl font-normal uppercase tracking-tight sm:text-5xl">
          {sizeGuide.title}
        </h1>
        <p className="font-sans text-sm font-normal uppercase tracking-wide text-black/60">
          {sizeGuide.subtitle}
        </p>
      </div>

      <div className="flex w-full flex-col items-center">
        {sizeGuide.images.map((src, index) => (
          <div key={`${src}-${index}`} className="relative w-full max-w-4xl" style={{ minHeight: "600px" }}>
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
