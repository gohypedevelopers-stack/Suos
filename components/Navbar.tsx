"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Search, UserRound } from "lucide-react"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"
import { SearchSidebar } from "@/components/home/SearchSidebar"

type NavKey = "women" | "men" | "bestsellers"

type PrimaryNavItem = {
  key: NavKey
  label: string
  href: string
}

const primaryNav: PrimaryNavItem[] = [
  { key: "women", label: "Women", href: "/#women" },
  { key: "men", label: "Men", href: "/#men" },
  { key: "bestsellers", label: "Bestsellers", href: "/#bestsellers" },
]

const megaMenuFeatured = ["New", "Bestsellers", "Sale"]

const megaMenuCategories = [
  "Bootcut Jeans",
  "Low Waist Jeans",
  "Straight-Leg Jeans",
  "Wide-Leg Jeans",
  "Baggy / Loose Fit Jeans",
  "Mom Jeans",
  "Dad Jeans",
  "Flared Jeans",
]

const megaMenuCards = [
  {
    src: "/images/nav1.png",
    alt: "Editorial preview for the Off Beat Edit collection",
    eyebrow: "Spotlight",
    titleLines: ["Off Beat", "Edit"],
  },
  {
    src: "/images/nav2.png",
    alt: "Editorial preview for the Country Edit collection",
    eyebrow: "New Launch",
    titleLines: ["Country", "Edit"],
  },
]

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

function NavLink({
  href,
  children,
  active = false,
  selected = false,
  mobile = false,
  onMouseEnter,
  onFocus,
  onBlur,
  onClick,
  ariaHaspopup,
  ariaExpanded,
}: {
  href: string
  children: ReactNode
  active?: boolean
  selected?: boolean
  mobile?: boolean
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>
  onFocus?: FocusEventHandler<HTMLAnchorElement>
  onBlur?: FocusEventHandler<HTMLAnchorElement>
  onClick?: MouseEventHandler<HTMLAnchorElement>
  ariaHaspopup?: "menu"
  ariaExpanded?: boolean
}) {
  const isEmphasized = active

  return (
    <Link
      href={href}
      aria-current={selected ? "page" : undefined}
      aria-haspopup={ariaHaspopup}
      aria-expanded={ariaExpanded}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      className={cn(
        "relative whitespace-nowrap uppercase text-current transition-[color,opacity] duration-300 ease-out",
        mobile
          ? "flex-none text-[0.75rem] tracking-[0.18em]"
          : "text-[0.875rem] tracking-[0.12em]",
        isEmphasized ? "opacity-100" : "hover:opacity-60",
        isEmphasized &&
          "after:absolute after:left-0 after:top-full after:mt-1.5 after:h-px after:w-full after:bg-current after:content-['']"
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
  onClick,
}: {
  label: string
  children: ReactNode
  tone?: "dark" | "light"
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex size-9 items-center justify-center text-current transition-[color,opacity] duration-300 ease-out hover:opacity-60 focus-visible:outline-none focus-visible:ring-2",
        tone === "light"
          ? "focus-visible:ring-white/30"
          : "focus-visible:ring-black/25"
      )}
    >
      {children}
    </button>
  )
}

function MenuSection({
  title,
  items,
  open,
  onClose,
}: {
  title: string
  items: string[]
  open: boolean
  onClose: () => void
}) {
  return (
    <section className="min-w-0">
      <p className="text-[1rem] font-semibold uppercase tracking-[0.08em] text-black">
        {title}
      </p>

      <ul className="mt-7 space-y-4">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={onClose}
              className="block text-left text-[0.95rem] leading-[1.55] tracking-[0.01em] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:opacity-70"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function MenuCard({
  src,
  alt,
  eyebrow,
  titleLines,
}: {
  src: string
  alt: string
  eyebrow: string
  titleLines: string[]
}) {
  return (
    <article className="relative aspect-[314/412] overflow-hidden bg-neutral-100">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 48vw, 314px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.28)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]">
        <span className="text-[0.95rem] font-light uppercase tracking-[0.16em]">
          {eyebrow}
        </span>
        <div className="mt-3 space-y-0.5">
          {titleLines.map((line) => (
            <div
              key={line}
              className="text-[clamp(2rem,2.7vw,3.05rem)] font-light uppercase leading-[0.9] tracking-[-0.05em]"
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function getNavKeyFromHash(hash: string): NavKey | null {
  const normalized = hash.replace(/^#/, "").toLowerCase()

  if (
    normalized === "women" ||
    normalized === "men" ||
    normalized === "bestsellers"
  ) {
    return normalized
  }

  return null
}

export function Navbar({
  className,
}: {
  className?: string
}) {
  const defaultNavKey: NavKey = "men"
  const pathname = usePathname()
  const isOverlay = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedNav, setSelectedNav] = useState<NavKey>(defaultNavKey)
  const [activeMenu, setActiveMenu] = useState<NavKey | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const scrollFrameRef = useRef<number | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const announcementHeightRef = useRef(0)
  const hasOpenMenu = Boolean(activeMenu)
  const isInteractiveSurface = isHovered || hasOpenMenu
  const isLightSurface = !isOverlay || isScrolled || isInteractiveSurface
  const tone: "dark" | "light" = isLightSurface ? "dark" : "light"
  const visualActiveMenu = activeMenu ?? selectedNav

  const openMenu = (menu: NavKey) => {
    setActiveMenu(menu)
  }

  useEffect(() => {
    const updateSelectedNav = () => {
      setSelectedNav(getNavKeyFromHash(window.location.hash) ?? defaultNavKey)
    }

    updateSelectedNav()
    window.addEventListener("hashchange", updateSelectedNav)
    window.addEventListener("popstate", updateSelectedNav)

    return () => {
      window.removeEventListener("hashchange", updateSelectedNav)
      window.removeEventListener("popstate", updateSelectedNav)
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    const readAnnouncementHeight = () => {
      const rawValue = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--announcement-height")
        .trim()
      const parsedValue = Number.parseFloat(rawValue)

      return Number.isFinite(parsedValue) ? parsedValue : 50
    }

    const syncHeaderMetrics = () => {
      announcementHeightRef.current = readAnnouncementHeight()
    }

    const updateScrollState = () => {
      scrollFrameRef.current = null

      const nextIsScrolled = window.scrollY > announcementHeightRef.current

      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled
      )
    }

    const syncScrollState = () => {
      syncHeaderMetrics()
      updateScrollState()
    }

    const scheduleScrollStateUpdate = () => {
      if (scrollFrameRef.current !== null) {
        return
      }

      scrollFrameRef.current = window.requestAnimationFrame(updateScrollState)
    }

    syncScrollState()
    window.addEventListener("scroll", scheduleScrollStateUpdate, {
      passive: true,
    })
    window.addEventListener("pageshow", syncScrollState)
    window.addEventListener("resize", syncScrollState)

    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = null
      }

      window.removeEventListener("scroll", scheduleScrollStateUpdate)
      window.removeEventListener("pageshow", syncScrollState)
      window.removeEventListener("resize", syncScrollState)
    }
  }, [isOverlay])

  const headerContent = (
    <header
      ref={headerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setActiveMenu(null)
      }}
      className={cn(
        "main-navbar navbar-shell border-b",
        isScrolled ? "translate-y-0" : "translate-y-[var(--announcement-height)]",
        isOverlay ? "h-[98px]" : "lg:h-[98px]",
        isInteractiveSurface
          ? "bg-white text-black border-transparent shadow-none"
          : isLightSurface
            ? "bg-white text-black border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.08)]"
            : "bg-transparent text-white border-transparent shadow-none",
        isScrolled && "is-scrolled",
        className
      )}
    >
      <div className="h-full w-full px-4 sm:px-6 lg:px-8">
        <div className="hidden h-full lg:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-0">
          <nav
            aria-label="Primary"
            className="flex items-center gap-10 justify-self-start"
          >
            {primaryNav.map((item) => (
              <NavLink
                key={item.key}
                href={item.href}
                active={visualActiveMenu === item.key}
                selected={selectedNav === item.key}
                ariaHaspopup="menu"
                ariaExpanded={activeMenu === item.key}
                onMouseEnter={() => openMenu(item.key)}
                onFocus={() => openMenu(item.key)}
                onBlur={(event) => {
                  const nextTarget = event.relatedTarget as Node | null

                  if (
                    !nextTarget ||
                    !headerRef.current?.contains(nextTarget)
                  ) {
                    setActiveMenu(null)
                  }
                }}
                onClick={() => {
                  setSelectedNav(item.key)
                  setActiveMenu(null)
                }}
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
                "block h-auto w-[9.5rem] max-w-none transition-[filter] duration-300 ease-out",
                isOverlay && !isLightSurface && "invert"
              )}
            />
          </Link>

          <div className="flex items-center justify-self-end gap-4 xl:gap-6">
            <div className="relative h-[34px] w-[220px] shrink-0 xl:w-[266px]">
              <button
                type="button"
                aria-label="Search products"
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "relative flex h-full w-full items-center border border-current/80 bg-transparent px-4 pr-10 text-left text-[0.875rem] text-current outline-none transition-[color,border-color,opacity] duration-300 ease-out hover:opacity-80"
                )}
              >
                <span
                  className="block truncate text-current/80"
                >
                  What are you looking for?
                </span>
              </button>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 stroke-[1.75] text-current transition-colors duration-300 ease-out"
              />
            </div>

            <Link
              href="/#contact"
              className={cn(
                "shrink-0 whitespace-nowrap text-[0.875rem] uppercase tracking-[0.12em] text-current transition-[color,opacity] duration-300 ease-out hover:opacity-60"
              )}
            >
              Contact Us
            </Link>

            <div className="flex shrink-0 items-center gap-4">
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
            <IconButton
              label="Search"
              tone={tone}
              onClick={() => setSearchOpen(true)}
            >
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
                  "block h-auto w-[8.75rem] max-w-none transition-[filter] duration-300 ease-out",
                  isOverlay && !isLightSurface && "invert"
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
              "flex items-center gap-6 overflow-x-auto pb-1 text-[0.75rem] uppercase tracking-[0.18em] text-current transition-[color,opacity] duration-300 ease-out [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {primaryNav.map((item) => (
              <NavLink
                key={item.key}
                href={item.href}
                active={selectedNav === item.key}
                selected={selectedNav === item.key}
                mobile
                onClick={() => setSelectedNav(item.key)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              href="/#contact"
              className={cn(
                "flex-none whitespace-nowrap text-[0.75rem] uppercase tracking-[0.18em] text-current transition-[color,opacity] duration-300 ease-out hover:opacity-60"
              )}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>

      <div
        aria-hidden={!activeMenu}
        className={cn(
          "absolute left-0 top-full hidden w-full bg-white text-black shadow-[0_24px_60px_rgba(0,0,0,0.08)] transition-opacity duration-150 ease-out lg:block lg:h-[460px] lg:overflow-hidden",
          activeMenu
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <div className="grid h-full w-full gap-x-14 gap-y-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(10rem,12rem)_minmax(14rem,18rem)_minmax(0,1fr)] lg:px-8">
          <MenuSection
            title="Featured"
            items={megaMenuFeatured}
            open={Boolean(activeMenu)}
            onClose={() => setActiveMenu(null)}
          />

          <MenuSection
            title="Categories"
            items={megaMenuCategories}
            open={Boolean(activeMenu)}
            onClose={() => setActiveMenu(null)}
          />

          <div className="grid w-full max-w-[652px] min-w-0 grid-cols-2 gap-6 justify-self-end">
            {megaMenuCards.map((card) => (
              <MenuCard
                key={card.src}
                src={card.src}
                alt={card.alt}
                eyebrow={card.eyebrow}
                titleLines={card.titleLines}
              />
            ))}
          </div>
        </div>
      </div>

      <SearchSidebar open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )

  return isOverlay ? (
    <div className="main-navbar-slot">{headerContent}</div>
  ) : (
    headerContent
  )
}
