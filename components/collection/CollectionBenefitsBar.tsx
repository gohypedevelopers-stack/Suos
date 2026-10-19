import { CornerUpLeft, Lock, ShoppingBag } from "lucide-react"

const benefits = [
  {
    icon: ShoppingBag,
    title: "FREE SHIPPING",
    description: "On orders over $250 CAD",
    mobileDesc: "Over $250 CAD",
  },
  {
    icon: CornerUpLeft,
    title: "FREE RETURNS",
    description: "On full priced items only",
    mobileDesc: "Full price only",
  },
  {
    icon: Lock,
    title: "PAYMENT SECURE",
    description: "Guaranteed payment protection",
    mobileDesc: "100% Protected",
  },
] as const

export function CollectionBenefitsBar() {
  return (
    <section
      aria-label="Store benefits"
      className="w-full bg-accent px-3 py-5 sm:px-6 sm:py-7 lg:px-8"
    >
      <ul className="mx-auto grid max-w-[980px] grid-cols-3 items-center gap-2 sm:gap-8">
        {benefits.map(({ icon: Icon, title, description, mobileDesc }) => (
          <li key={title} className="flex min-w-0 justify-center">
            <div className="flex min-w-0 flex-col items-center gap-1.5 text-center text-black sm:flex-row sm:items-start sm:gap-3 sm:text-left">
              <Icon
                aria-hidden="true"
                className="size-5 shrink-0 stroke-[1.5] sm:size-6"
              />

              <div className="min-w-0">
                <p className="text-[11px] font-normal uppercase leading-[1.3] tracking-[0.04em] sm:text-[14px]">
                  {title}
                </p>
                <p className="mt-0.5 hidden text-[13px] leading-[1.4] text-black/70 sm:block">
                  {description}
                </p>
                <p className="mt-0.5 block text-[11px] leading-[1.3] text-black/60 sm:hidden">
                  {mobileDesc}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
