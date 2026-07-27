import { CornerUpLeft, Lock, ShoppingCart } from "lucide-react"

const benefits = [
  {
    icon: ShoppingCart,
    title: "FREE SHIPPING",
    description: "On orders over $250 CAD",
  },
  {
    icon: CornerUpLeft,
    title: "FREE RETURNS",
    description: "On full priced items only",
  },
  {
    icon: Lock,
    title: "PAYMENT SECURE",
    description: "Guaranteed payment protection",
  },
] as const

export function CollectionBenefitsBar() {
  return (
    <section
      aria-label="Store benefits"
      className="-mx-4 bg-accent px-4 py-7 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <ul className="mx-auto grid max-w-[980px] gap-6 sm:grid-cols-3 sm:gap-8">
        {benefits.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex justify-center">
            <div className="flex w-full max-w-[250px] items-start gap-3 text-black">
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-6 shrink-0 stroke-[1.8]"
              />

              <div className="min-w-0">
                <p className="text-[13px] font-medium uppercase leading-tight tracking-[0.01em]">
                  {title}
                </p>
                <p className="text-[12px] leading-tight text-black/90">
                  {description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
