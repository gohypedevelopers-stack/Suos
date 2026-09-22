import { CornerUpLeft, Lock, ShoppingCart } from "lucide-react"

const benefits = [
  {
    icon: ShoppingCart,
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
      className="-mx-4 bg-accent px-2.5 py-4 sm:-mx-6 sm:px-6 sm:py-7 lg:-mx-8 lg:px-8"
    >
      <ul className="mx-auto grid grid-cols-3 max-w-[980px] gap-2 sm:gap-8 items-center">
        {benefits.map(({ icon: Icon, title, description, mobileDesc }) => (
          <li key={title} className="flex justify-center">
            <div className="flex items-center sm:items-start gap-1.5 sm:gap-3 text-black">
              <Icon
                aria-hidden="true"
                className="size-4 sm:size-6 shrink-0 stroke-[1.8]"
              />

              <div className="min-w-0">
                <p className="text-[10px] sm:text-[13px] font-semibold uppercase leading-tight tracking-[0.01em] truncate">
                  {title}
                </p>
                <p className="hidden sm:block text-[12px] leading-tight text-black/90">
                  {description}
                </p>
                <p className="block sm:hidden text-[9px] leading-tight text-black/70 truncate">
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
