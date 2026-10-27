import type { ReactNode } from "react"

export function AuthFormPanel({ children }: { children: ReactNode }) {
  return (
    <section className="flex w-full justify-center bg-white px-4 py-8 sm:px-8 sm:py-10 lg:items-start lg:px-16 lg:py-0 xl:px-24">
      <div className="w-full max-w-[440px] sm:max-w-[474px] lg:py-[clamp(3rem,9vh,6rem)]">
        {children}
      </div>
    </section>
  )
}
