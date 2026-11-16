import Image from "next/image"

const features = [
  {
    title: "Lower-water washing",
    description: "Wash processes designed to reduce water use.",
    image: "/responsible-denim/lower-water-washing.png",
  },
  {
    title: "Safer chemicals",
    description: "Inputs aligned with recognised safety standards.",
    image: "/responsible-denim/safer-chemicals.png",
  },
  {
    title: "Responsible denim",
    description: "Thoughtfully sourced materials and considered processes.",
    image: "/responsible-denim/responsible-denim.png",
  },
  {
    title: "Sustainable packaging",
    description: "Packaging designed to reduce material waste.",
    image: "/responsible-denim/sustainable-packaging.png",
  },
]

const certifications = ["OEKO-TEX®", "GOTS", "RoHS"]

/**
 * Home "What touches your skin matters": a large photo held on the left while
 * the right side scrolls (label, headline, a 2×2 grid of numbered practices
 * and the certifications).
 */
export function ResponsibleDenimSection() {
  return (
    <section className="grid w-full bg-white text-black lg:grid-cols-2">
      {/* Left: stays in view (desktop) while the right column scrolls past. */}
      <div className="relative aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-auto">
        <div data-reveal="zoom" className="relative h-full w-full overflow-hidden bg-neutral-100 lg:sticky lg:top-0 lg:h-[100svh]">
          <Image
            src="/responsible-denim/hand-denim.png"
            alt="Hand touching responsibly finished denim"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Right: label, headline, practices, certifications. */}
      <div className="px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-6">
        <p className="text-[14px] font-normal uppercase leading-[25px] tracking-normal text-[#6c6c6c] sm:text-[16px]">
          Considered beyond the surface
        </p>
        <h2 className="type-title mt-3 max-w-[640px]">
          What touches your skin matters
        </h2>

        <ul className="reveal-stagger mt-10 grid grid-cols-2 gap-x-0.5 gap-y-8 sm:mt-12 sm:gap-y-10">
          {features.map((feature, index) => (
            <li key={feature.title} data-reveal="up">
              <div className="hover-zoom relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </div>
              {/* Same type as the name and subtitle under a product card. */}
              <h3 className="mt-2.5 text-[12px] font-normal uppercase leading-none tracking-normal md:mt-3 md:text-[14px]">
                {String(index + 1).padStart(2, "0")} — {feature.title}
              </h3>
              <p className="mt-1.5 pr-3 text-[11px] leading-[1.3] tracking-normal text-[#7d7d7d] md:text-[14px]">{feature.description}</p>
            </li>
          ))}
        </ul>

        <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-2 text-[12px] uppercase leading-none tracking-normal text-[#7d7d7d] sm:mt-16 md:text-[14px]">
          {certifications.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
