import { cn } from "@/lib/utils"

const marqueeText =
  "OEKO-TEX® | RoHS | GOTS | CONSIDERED WASHING | RESPONSIBLE PACKAGING | MADE WITH MORE IN MIND"

function MarqueeStrip() {
  return (
    <div className="flex shrink-0 items-center gap-16 pr-16 whitespace-nowrap">
      {Array.from({ length: 4 }).map((_, repeatIndex) => (
        <span key={`repeat-${repeatIndex}`} className="whitespace-nowrap">
          {marqueeText}
        </span>
      ))}
    </div>
  )
}

export function SustainabilityMarquee() {
  return (
    <section className="w-full overflow-hidden bg-black py-3 text-[13px] font-normal text-white">
      <h2 className="sr-only">Sustainability marquee</h2>

      <div
        className={cn(
          "flex w-max items-center animate-[marquee_26s_linear_infinite] motion-reduce:animate-none",
          "[will-change:transform]"
        )}
      >
        <MarqueeStrip />
        <MarqueeStrip />
      </div>
    </section>
  )
}
