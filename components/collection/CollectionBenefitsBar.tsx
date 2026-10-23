import { CornerUpLeft, Lock, ShoppingBag } from "lucide-react"

import { resolvePage } from "@/lib/page-content"
import { getSiteContent } from "@/lib/server/dal/site-content"

const icons = [ShoppingBag, CornerUpLeft, Lock] as const

export async function CollectionBenefitsBar() {
  const page = resolvePage("collectionsPage", (await getSiteContent()).collectionsPage)
  if (!page.show("benefits")) return null
  const benefits = icons
    .map((icon, index) => ({
      icon,
      title: page.text("benefits", `title${index + 1}`),
      description: page.text("benefits", `text${index + 1}`),
      mobileDesc: page.text("benefits", `short${index + 1}`) || page.text("benefits", `text${index + 1}`),
    }))
    .filter((benefit) => benefit.title.trim())
  if (benefits.length === 0) return null

  return (
    <section
      aria-label="Store benefits"
      className="w-full bg-accent px-3 py-5 sm:px-6 sm:py-7 lg:px-8"
    >
      <ul
        className="mx-auto grid max-w-[980px] items-center gap-2 sm:gap-8"
        style={{ gridTemplateColumns: `repeat(${benefits.length}, minmax(0, 1fr))` }}
      >
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
