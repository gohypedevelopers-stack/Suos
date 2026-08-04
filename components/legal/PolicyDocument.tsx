import type { ReactNode } from "react"

type PolicyNavigationItem = {
  href: string
  label: string
}

export function PolicyDocument({
  id,
  title,
  navigation,
  children,
}: {
  id?: string
  title: string
  navigation: readonly PolicyNavigationItem[]
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-[calc(var(--header-stack-height)+1rem)] border-t border-black/15 bg-white text-black"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[240px_minmax(0,800px)] lg:gap-20 lg:px-8 lg:py-20">
        <header className="self-start lg:sticky lg:top-[calc(var(--header-stack-height)+2rem)]">
          <p className="text-[13px] font-normal uppercase text-black/45">
            SUOS policies
          </p>
          <h1 className="mt-3 font-heading text-[24px] font-normal uppercase leading-[1.05] tracking-[-0.04em]">
            {title}
          </h1>

          <nav aria-label={`${title} sections`} className="mt-7 border-t border-black/15 pt-5">
            <ul className="grid gap-x-5 gap-y-3 text-[13px] font-normal text-black/60 sm:grid-cols-2 lg:grid-cols-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-black focus-visible:text-black"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <article className="min-w-0">{children}</article>
      </div>
    </section>
  )
}

export function PolicyIntroduction({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 pb-9 text-[13px] font-normal leading-[1.7] text-black/70">
      {children}
    </div>
  )
}

export function PolicySection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-[calc(var(--header-stack-height)+2rem)] border-t border-black/15 py-9"
    >
      <h2 className="text-[15px] font-[500] uppercase leading-tight">{title}</h2>
      <div className="mt-5 space-y-4 text-[13px] font-normal leading-[1.7] text-black/70">
        {children}
      </div>
    </section>
  )
}

export function PolicySubsection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="pt-4">
      <h3 className="text-[13px] font-[500] uppercase text-black">{title}</h3>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  )
}

export function PolicyList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 marker:text-black/45">{children}</ul>
}
