"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react"
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
import { CartSidebar } from "@/components/cart/CartSidebar"
import { SearchSidebar } from "@/components/home/SearchSidebar"

type NavKey = "women" | "men" | "bestsellers"
type ActiveMenu = NavKey | "wishlist"

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
  onMouseLeave,
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
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>
  onFocus?: FocusEventHandler<HTMLAnchorElement>
  onBlur?: FocusEventHandler<HTMLAnchorElement>
  onClick?: MouseEventHandler<HTMLAnchorElement>
  ariaHaspopup?: "menu"
  ariaExpanded?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={selected ? "page" : undefined}
      aria-haspopup={ariaHaspopup}
      aria-expanded={ariaExpanded}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      className={cn(
        "group/link inline-flex flex-col items-start whitespace-nowrap uppercase pb-0.5 text-current transition-[color,opacity] duration-300 ease-out",
        mobile
          ? "flex-none text-[0.75rem] tracking-[0.18em]"
          : "text-[0.875rem] tracking-[0.12em]",
        active ? "opacity-100" : "hover:opacity-60"
      )}
    >
      <span className="leading-none">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "mt-[1px] h-px w-full origin-left bg-current transition-transform duration-200",
          active
            ? "scale-x-100"
            : "scale-x-0 group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
        )}
      />
    </Link>
  )
}

function IconButton({
  label,
  children,
  tone = "dark",
  onClick,
  ariaExpanded,
  ariaHaspopup,
}: {
  label: string
  children: ReactNode
  tone?: "dark" | "light"
  onClick?: () => void
  ariaExpanded?: boolean
  ariaHaspopup?: "menu" | "dialog"
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
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
              className="group/item inline-flex flex-col items-start text-left text-[0.95rem] leading-none tracking-[0.01em] text-black focus-visible:outline-none hover:text-black"
            >
              <span className="leading-none">{item}</span>
              <span
                aria-hidden="true"
                className="mt-[1px] h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 group-hover/item:scale-x-100 group-focus-visible/item:scale-x-100"
              />
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

function WishlistPanel() {
  return (
    <div className="h-full w-full bg-white text-black">
      <div className="mx-auto flex h-full w-full max-w-[1160px] flex-col px-6 py-8 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[0.78rem] font-medium uppercase tracking-[0.08em]">
            My Wishlist
          </h2>

          <button
            type="button"
            className="inline-flex h-8 items-center bg-black px-3 text-[0.75rem] font-medium text-white transition-opacity hover:opacity-80"
          >
            Share Wishlist
          </button>
        </div>

        <div className="flex flex-1 items-start justify-center pt-12">
          <div className="w-full bg-black px-4 py-2 text-center text-[0.78rem] text-white">
            There are no items in your Wishlist
          </div>
        </div>
      </div>
    </div>
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
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedNav, setSelectedNav] = useState<NavKey>(defaultNavKey)
  const [activeMenu, setActiveMenu] = useState<ActiveMenu | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const scrollFrameRef = useRef<number | null>(null)
  const menuCloseTimeoutRef = useRef<number | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const announcementHeightRef = useRef(0)
  const hasOpenMenu = Boolean(activeMenu)
  const isInteractiveSurface = isHovered || hasOpenMenu
  const isLightSurface = !isOverlay || isScrolled || isInteractiveSurface
  const tone: "dark" | "light" = isLightSurface ? "dark" : "light"
  const isWishlistOpen = activeMenu === "wishlist"

  const openMenu = (menu: NavKey) => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
      menuCloseTimeoutRef.current = null
    }

    setIsHovered(true)
    setActiveMenu(menu)
  }

  const closeMenu = () => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
      menuCloseTimeoutRef.current = null
    }

    setIsHovered(false)
    setActiveMenu(null)
  }

  const scheduleMenuClose = () => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
    }

    menuCloseTimeoutRef.current = window.setTimeout(() => {
      closeMenu()
    }, 90)
  }

  const cancelMenuClose = () => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
      menuCloseTimeoutRef.current = null
    }

    setIsHovered(true)
  }

  const toggleWishlist = () => {
    setActiveMenu((current) => (current === "wishlist" ? null : "wishlist"))
  }

  useEffect(() => {
    const updateSelectedNav = () => {
      setSelectedNav(getNavKeyFromHash(window.location.hash) ?? defaultNavKey)
    }

    updateSelectedNav()
    window.addEventListener("hashchange", updateSelectedNav)
    window.addEventListener("popstate", updateSelectedNav)

    return () => {
      if (menuCloseTimeoutRef.current !== null) {
        window.clearTimeout(menuCloseTimeoutRef.current)
        menuCloseTimeoutRef.current = null
      }
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
      <div className="relative h-full w-full px-4 sm:px-6 lg:px-8">
        <div className="hidden h-full lg:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-0">
          <nav
            aria-label="Primary"
            className="flex items-center gap-10 justify-self-start"
            onMouseEnter={cancelMenuClose}
            onMouseLeave={scheduleMenuClose}
          >
            {primaryNav.map((item) => (
              <NavLink
                key={item.key}
                href={item.href}
                active={activeMenu === item.key}
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

            <IconButton
              label="Cart"
              tone={tone}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="size-[18px] stroke-[1.7]" />
            </IconButton>

            <div className="flex shrink-0 items-center gap-4">
              <IconButton
                label="Wishlist"
                tone={tone}
                onClick={toggleWishlist}
                ariaHaspopup="menu"
                ariaExpanded={isWishlistOpen}
              >
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
              <IconButton
                label="Wishlist"
                tone={tone}
                onClick={toggleWishlist}
                ariaHaspopup="menu"
                ariaExpanded={isWishlistOpen}
              >
                <Heart className="size-[18px] stroke-[1.7]" />
              </IconButton>
              <IconButton
                label="Cart"
                tone={tone}
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="size-[18px] stroke-[1.7]" />
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
          </nav>
        </div>

        <div
          aria-hidden={!activeMenu}
          className={cn(
            "absolute left-0 top-full hidden w-full bg-white text-black shadow-[0_24px_60px_rgba(0,0,0,0.08)] transition-opacity duration-150 ease-out lg:block lg:h-[460px] lg:overflow-hidden",
            activeMenu
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          )}
          onMouseEnter={cancelMenuClose}
          onMouseLeave={scheduleMenuClose}
        >
          {activeMenu === "wishlist" ? (
            <WishlistPanel />
          ) : (
            <div className="grid h-full w-full gap-x-14 gap-y-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(10rem,12rem)_minmax(14rem,18rem)_minmax(0,1fr)] lg:px-8">
              <MenuSection
                title="Featured"
                items={megaMenuFeatured}
                open={Boolean(activeMenu)}
                onClose={closeMenu}
              />

              <MenuSection
                title="Categories"
                items={megaMenuCategories}
                open={Boolean(activeMenu)}
                onClose={closeMenu}
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
          )}
        </div>
      </div>

      <SearchSidebar open={searchOpen} onOpenChange={setSearchOpen} />
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  )

  return isOverlay ? (
    <div className="main-navbar-slot">{headerContent}</div>
  ) : (
    headerContent
  )
}
