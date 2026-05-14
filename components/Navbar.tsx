import Image from "next/image"
import Link from "next/link"
import { Heart, Search, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"

const primaryNav = [
  { label: "Women", href: "/#women" },
  { label: "Men", href: "/#men", active: true },
  { label: "Bestsellers", href: "/#bestsellers" },
]

function NavLink({
  href,
  children,
  active = false,
  mobile = false,
  tone = "dark",
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  mobile?: boolean
  tone?: "dark" | "light"
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative whitespace-nowrap uppercase transition-opacity hover:opacity-60",
        mobile
          ? "flex-none text-[0.75rem] tracking-[0.18em]"
          : "text-[0.875rem] tracking-[0.12em]",
        active &&
          cn(
            "after:absolute after:left-0 after:top-full after:mt-1.5 after:h-px after:w-full after:content-['']",
            tone === "light" ? "after:bg-white" : "after:bg-black"
          )
      )}
    >
      {children}
    </Link>
  )
}

function IconButton({
  label,
  children,
  tone = "dark",
}: {
  label: string
  children: React.ReactNode
  tone?: "dark" | "light"
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-9 items-center justify-center transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2",
        tone === "light"
          ? "text-white focus-visible:ring-white/30"
          : "text-black focus-visible:ring-black/25"
      )}
    >
      {children}
    </button>
  )
}

export function Navbar({
  variant = "solid",
  className,
}: {
  variant?: "solid" | "overlay"
  className?: string
}) {
  const isOverlay = variant === "overlay"
  const tone: "dark" | "light" = isOverlay ? "light" : "dark"

  return (
    <header
      className={cn(
        isOverlay
          ? "absolute inset-x-0 top-0 z-20 h-[98px] bg-transparent text-white"
          : "border-b border-transparent bg-white text-black lg:h-[98px]",
        className
      )}
    >
      <div className="h-full w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="hidden h-full lg:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-0">
          <nav
            aria-label="Primary"
            className="flex items-center gap-10 justify-self-start"
          >
            {primaryNav.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                active={item.active}
                tone={tone}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            href="/"
            aria-label="SUOS home"
            className="justify-self-center transition-opacity hover:opacity-70"
          >
            <Image
              src="/logo.svg"
              alt="SUOS"
              width={260}
              height={120}
              priority
              className={cn(
                "block h-auto w-[9.5rem] max-w-none",
                isOverlay && "invert"
              )}
            />
          </Link>

          <div className="flex items-center justify-self-end gap-6">
            <div className="relative h-[34px] w-[266px]">
              <input
                type="search"
                aria-label="Search products"
                placeholder="What are you looking for?"
                className={cn(
                  "h-full w-full bg-transparent px-4 pr-10 text-[0.875rem] outline-none placeholder:transition-opacity",
                  isOverlay
                    ? "border border-white/80 text-white placeholder:text-white/80"
                    : "border border-black/80 text-black placeholder:text-black/80"
                )}
              />
              <Search
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 stroke-[1.75]",
                  isOverlay ? "text-white" : "text-black"
                )}
              />
            </div>

            <Link
              href="/#contact"
              className={cn(
                "whitespace-nowrap text-[0.875rem] uppercase tracking-[0.12em] transition-opacity hover:opacity-60",
                isOverlay ? "text-white" : "text-black"
              )}
            >
              Contact Us
            </Link>

            <div className="flex items-center gap-4">
              <IconButton label="Wishlist" tone={tone}>
                <Heart className="size-[18px] stroke-[1.7]" />
              </IconButton>
              <IconButton label="Account" tone={tone}>
                <UserRound className="size-[18px] stroke-[1.7]" />
              </IconButton>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-4 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <IconButton label="Search" tone={tone}>
              <Search className="size-[18px] stroke-[1.7]" />
            </IconButton>

            <Link
              href="/"
              aria-label="SUOS home"
              className="transition-opacity hover:opacity-70"
            >
              <Image
                src="/logo.svg"
                alt="SUOS"
                width={220}
                height={102}
                priority
                className={cn(
                  "block h-auto w-[8.75rem] max-w-none",
                  isOverlay && "invert"
                )}
              />
            </Link>

            <div className="flex items-center gap-2">
              <IconButton label="Wishlist" tone={tone}>
                <Heart className="size-[18px] stroke-[1.7]" />
              </IconButton>
              <IconButton label="Account" tone={tone}>
                <UserRound className="size-[18px] stroke-[1.7]" />
              </IconButton>
            </div>
          </div>

          <nav
            aria-label="Primary"
            className={cn(
              "flex items-center gap-6 overflow-x-auto pb-1 text-[0.75rem] uppercase tracking-[0.18em] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              isOverlay ? "text-white" : "text-black"
            )}
          >
            {primaryNav.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                active={item.active}
                mobile
                tone={tone}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              href="/#contact"
              className={cn(
                "flex-none whitespace-nowrap text-[0.75rem] uppercase tracking-[0.18em] transition-opacity hover:opacity-60",
                isOverlay ? "text-white" : "text-black"
              )}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
