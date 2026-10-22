import Image from "next/image"
import { cn } from "@/lib/utils"

const bottomFeatures = [
  {
    title: "SUSTAINABLE PACKAGING",
    description: "Packaging designed to reduce material waste.",
    bgImage: "/responsible-denim/sustainable-packaging.png",
    textColor: "text-black",
  },
  {
    title: "LOWER-WATER WASHING",
    description: "Wash processes designed to reduce water use.",
    bgImage: "/responsible-denim/lower-water-washing.png",
    textColor: "text-black",
  },
  {
    title: "SAFER CHEMICALS",
    description: "Inputs aligned with recognised safety standards.",
    bgImage: "/responsible-denim/safer-chemicals.png",
    textColor: "text-black",
  },
  {
    title: "RESPONSIBLE DENIM",
    description: "Thoughtfully sourced materials and considered processes.",
    bgImage: "/responsible-denim/responsible-denim.png",
    textColor: "text-white",
  },
]

export function ResponsibleDenimSection() {
  return (
    <section className="w-full bg-white text-black">
      {/* Top Row: 3 Columns (Hand Image | Core Message Card | Looping Video) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_1fr] items-stretch">
        {/* Left: Hand on Denim Image */}
        <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[480px] w-full overflow-hidden bg-neutral-100">
          <Image
            src="/responsible-denim/hand-denim.png"
            alt="Hand touching responsibly finished denim"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-center"
          />
        </div>

        {/* Middle: Mission Statement Card */}
        <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left px-6 py-12 sm:px-10 lg:px-12 xl:px-16">
          <p className="text-[14px] sm:text-[16px] font-normal uppercase leading-[25px] tracking-normal text-[#6c6c6c]">
            Considered Beyond The Surface
          </p>

          <h2 className="mt-4 font-heading text-[28px] leading-[36px] sm:text-[40px] sm:leading-[50px] font-normal uppercase tracking-normal text-black">
            What Touches
            <br className="hidden sm:inline" />{" "}
            Your Skin Matters
          </h2>

          <p className="mt-5 max-w-[480px] mx-auto lg:mx-0 text-[16px] leading-[22px] sm:text-[20px] sm:leading-[25px] tracking-normal text-black">
            Our denim is washed and finished using inputs selected to meet
            recognised textile and chemical safety standards.
          </p>

          <div className="mt-6 sm:mt-10 w-full text-center lg:text-left">
            <p className="text-[20px] sm:text-[28px] leading-[25px] font-normal tracking-normal text-black">
              OEKO-TEX® &nbsp;|&nbsp; RoHS &nbsp;|&nbsp; GOTS
            </p>
          </div>
        </div>

        {/* Right: Looping Video with "TO A BRIGHTER TOMORROW" Overlay */}
        <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[480px] w-full overflow-hidden bg-neutral-900">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/responsible-denim/mountains.png"
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src="/Looping Video.mp4" type="video/mp4" />
          </video>

          {/* Top-Left Text Overlay */}
          <div className="absolute left-6 top-6 sm:left-8 sm:top-8 z-10">
            <p className="text-[14px] sm:text-[16px] font-normal uppercase tracking-normal text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-[25px]">
              To A<br />
              Brighter<br />
              Tomorrow
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: 4 Feature Cards (2x2 on Mobile, 4 in a row on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {bottomFeatures.map((feature) => (
          <div
            key={feature.title}
            className="relative aspect-square sm:aspect-[6/5] w-full overflow-hidden flex flex-col justify-center items-center text-center p-3 sm:p-6 lg:p-8"
          >
            {/* Background Texture Image */}
            <Image
              src={feature.bgImage}
              alt={feature.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center"
            />

            {/* Subtle scrim for contrast if needed */}
            <div className="absolute inset-0 bg-black/5" />

            {/* Card Content Overlay */}
            <div className={cn("relative z-10 max-w-[180px] sm:max-w-[260px] lg:max-w-[300px] flex flex-col items-center justify-center", feature.textColor)}>
              <h3 className="font-heading text-[16px] leading-[20px] sm:text-[22px] sm:leading-[28px] xl:text-[28px] xl:leading-[38px] font-normal uppercase tracking-normal drop-shadow-sm">
                {/* Figma sets each title on two lines, one word per line. */}
                {feature.title.split(" ").map((word, index) => (
                  <span key={word} className="block">
                    {index === 0 ? word : ` ${word}`}
                  </span>
                ))}
              </h3>
              <p className="mt-2 sm:mt-3 text-[13px] leading-[17px] sm:text-[16px] sm:leading-[21px] xl:text-[20px] xl:leading-[25px] text-center drop-shadow-sm">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
