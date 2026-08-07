import type { ReactNode } from "react"

export function AuthFormPanel({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-full justify-center bg-white px-6 py-10 sm:px-10 lg:h-full lg:min-h-0 lg:items-start lg:px-16 lg:py-0 xl:px-24">
      <div className="w-full max-w-[474px] lg:pt-[clamp(3rem,9vh,6rem)]">
        {children}
      </div>
    </section>
  )
}
