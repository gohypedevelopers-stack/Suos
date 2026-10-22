"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Search, UserRound, Menu, X, ChevronRight, ChevronDown } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react"
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
import { CartIcon } from "@/components/icons/CartIcon"
import { SearchSidebar } from "@/components/home/SearchSidebar"
import { WishlistSidebar } from "@/components/wishlist/WishlistSidebar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { useSiteContent } from "@/lib/site-content-context"
import type { NavMenuCard, NavMenuLink } from "@/lib/site-content"

type NavKey = "women" | "men" | "bestsellers" | "collections"
type MegaMenuKey = "collections" | "men"
type ActiveMenu = MegaMenuKey | "wishlist"

type PrimaryNavItem = {
  key: NavKey
  label: string
  href: string
  /** Items without a mega menu (Bestsellers) render as a plain link. */
  hasMenu: boolean
}

const megaMenuOrder: MegaMenuKey[] = ["collections", "men"]

const megaMenuRevealTransition: Transition = {
  type: "spring",
  stiffness: 145,
  damping: 24,
  mass: 0.8,
  bounce: 0,
}

const megaMenuCloseTransition: Transition = {
  duration: 0.16,
  ease: [0.4, 0, 1, 1],
}

const megaMenuContentTransition: Transition = {
  type: "tween",
  duration: 0.56,
  ease: [0.16, 1, 0.3, 1],
}

const megaMenuContentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: { x: 0 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
  }),
}

/**
 * Height of the landscape promo cards in the mega menus. Derived from the
 * viewport width so three 3:2 cards plus the link column always fit the row:
 * 3 x (1.5 x h) = 100vw - 384px (page padding + link column + gaps).
 */
const NAV_CARD_HEIGHT = "clamp(150px, calc((100vw - 384px) / 4.5), 300px)"
/** Mega menu panel = card row + its vertical padding (py-7). */
const MEGA_MENU_HEIGHT = `calc(${NAV_CARD_HEIGHT} + 56px)`

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
        "group/link inline-flex flex-col items-start whitespace-nowrap pb-0.5 font-[400] uppercase text-current transition-[color,opacity] duration-300 ease-out",
        mobile
          ? "flex-none text-[12px] tracking-normal"
          : "text-body tracking-normal",
        active ? "opacity-100" : "hover:opacity-60"
      )}
    >
      <span className="leading-[1.2]">{children}</span>
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
        "relative inline-flex size-9 cursor-pointer items-center justify-center text-current transition-[color,opacity] duration-300 ease-out hover:opacity-60 focus-visible:outline-none focus-visible:ring-2",
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
  items: NavMenuLink[]
  open: boolean
  onClose: () => void
}) {
  return (
    <section className="min-w-0">
      <p className="text-[13px] font-[400] uppercase leading-[1.4] tracking-normal text-black">
        {title}
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            <Link
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={onClose}
              className="inline-flex cursor-pointer items-start text-left text-[14px] font-[400] uppercase leading-[1.4] tracking-normal text-black/55 transition-colors duration-200 hover:text-black focus-visible:text-black focus-visible:outline-none"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Landscape promo card, locked to a 3:2 aspect ratio (height comes from
// NAV_CARD_HEIGHT, width from the ratio). Recommended upload: 1200 × 800 px (3:2).
function MenuCard({
  card,
  open = true,
  onClose,
}: {
  card: NavMenuCard
  open?: boolean
  onClose?: () => void
}) {
  const { image, alt, eyebrow, title, href } = card

  return (
    <Link
      href={href || "/collections"}
      tabIndex={open ? 0 : -1}
      onClick={onClose}
      style={{ height: NAV_CARD_HEIGHT }}
      className="group/card relative block aspect-[3/2] shrink-0 cursor-pointer overflow-hidden bg-neutral-100"
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 1280px) 25vw, 450px"
        // Load with the page so the cards are ready the moment a menu opens.
        loading="eager"
        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.28)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]">
        {eyebrow ? (
          <span className="text-[12px] font-[400] uppercase leading-[1.4] tracking-normal">
            {eyebrow}
          </span>
        ) : null}
        {title ? (
          <div className="mt-1.5 text-[clamp(1.25rem,1.8vw,2rem)] font-[400] uppercase leading-[1.15] tracking-normal">
            {title}
          </div>
        ) : null}
      </div>
    </Link>
  )
}

function WishlistPanel() {
  return (
    <div className="h-full w-full bg-white text-black">
      <div className="mx-auto flex h-full w-full max-w-[1160px] flex-col px-6 py-8 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[0.78rem] font-medium uppercase tracking-normal">
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
    normalized === "bestsellers" ||
    normalized === "collections"
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
  const { navigation } = useSiteContent()
  const primaryNav: PrimaryNavItem[] = [
    { key: "collections", label: navigation.collectionsLabel || "Collections", href: "/collections", hasMenu: true },
    { key: "men", label: "Men", href: "/shop", hasMenu: true },
    { key: "bestsellers", label: "Bestsellers", href: navigation.bestsellersHref || "/shop?filter=bestsellers", hasMenu: false },
  ]
  // Link columns per mega menu; the mobile drawer reuses the same structure.
  const menuGroups: Record<MegaMenuKey, { title: string; items: NavMenuLink[] }[]> = {
    collections: [{ title: "Edits", items: navigation.edits }],
    men: [
      { title: "Collection", items: navigation.menCollections },
      { title: "Categories", items: navigation.categories },
      { title: "Featured", items: navigation.menFeatured },
    ],
  }
  // Collections: image 1 left, images 2-3 right. Men: images 2-3 right.
  // Older saved content may have fewer images, so every slot is optional.
  const navCards = navigation.cards.slice(0, 3)
  const collectionsLeftCard = navCards[0]
  const collectionsRightCards = navCards.slice(1, 3)
  const menCards = navCards.length > 2 ? navCards.slice(1, 3) : navCards.slice(0, 2)
  const isOverlay = pathname === "/"
  const { wishlist, isLoaded, setIsSidebarOpen } = useWishlist()
  const { isCartOpen, setIsCartOpen, totalItems } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<MegaMenuKey | null>(null)
  const [selectedNav, setSelectedNav] = useState<NavKey>(defaultNavKey)
  const [activeMenu, setActiveMenu] = useState<ActiveMenu | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [menuSlideDirection, setMenuSlideDirection] = useState(1)
  const prefersReducedMotion = useReducedMotion()
  const scrollFrameRef = useRef<number | null>(null)
  const isScrolledRef = useRef(false)
  const menuCloseTimeoutRef = useRef<number | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const announcementHeightRef = useRef(0)
  const hasOpenMenu = Boolean(activeMenu)
  const isInteractiveSurface = isHovered || hasOpenMenu
  const isHeroTransparent = isOverlay && !isScrolled && !isInteractiveSurface
  const isLightSurface = !isHeroTransparent
  const tone: "dark" | "light" = isLightSurface ? "dark" : "light"
  const isWishlistOpen = activeMenu === "wishlist"

  const openMenu = (menu: MegaMenuKey) => {
    if (menuCloseTimeoutRef.current !== null) {
      window.clearTimeout(menuCloseTimeoutRef.current)
      menuCloseTimeoutRef.current = null
    }

    setIsHovered(true)
    const currentMenuIndex = megaMenuOrder.indexOf(activeMenu as MegaMenuKey)
    const nextMenuIndex = megaMenuOrder.indexOf(menu)

    if (currentMenuIndex !== -1 && currentMenuIndex !== nextMenuIndex) {
      setMenuSlideDirection(nextMenuIndex > currentMenuIndex ? 1 : -1)
    }

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
    }, 280)
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
      if (pathname === "/collections" || pathname?.startsWith("/collections/")) {
        setSelectedNav("collections")
        return
      }
      if (pathname === "/shop") {
        const filter = new URLSearchParams(window.location.search).get("filter")
        setSelectedNav(filter === "bestsellers" ? "bestsellers" : "men")
        return
      }
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
  }, [pathname])

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

      const announcementHeight = announcementHeightRef.current
      const scrollY = Math.max(0, window.scrollY)
      const navbarScrollOffset = Math.min(announcementHeight, scrollY)
      const nextIsScrolled = navbarScrollOffset >= announcementHeight
      const navbarTranslateY = -navbarScrollOffset


      if (headerRef.current) {
        headerRef.current.style.transform = `translate3d(0, ${navbarTranslateY}px, 0)`
      }

      if (isScrolledRef.current !== nextIsScrolled) {
        isScrolledRef.current = nextIsScrolled
        setIsScrolled(nextIsScrolled)
      }
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
      onMouseEnter={cancelMenuClose}
      onMouseLeave={scheduleMenuClose}
      className={cn(
        "main-navbar navbar-shell border-b",
        "h-14 sm:h-16 lg:h-[98px]",
        isInteractiveSurface
          ? "!bg-white text-black border-transparent shadow-none"
          : isLightSurface
            ? "!bg-white text-black border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.08)]"
            : "!bg-transparent text-white border-transparent shadow-none",
        isScrolled && "is-scrolled",
        className
      )}
    >
      <div className="relative h-full w-full px-4 sm:px-6 lg:px-8">
        <div className="relative z-[1] hidden h-full lg:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-0">
          <nav
            aria-label="Primary"
            className="flex h-full items-center gap-10 justify-self-start"
            onMouseEnter={cancelMenuClose}
          >
            {primaryNav.map((item) => {
              const menuKey = item.hasMenu ? (item.key as MegaMenuKey) : null

              return (
              <NavLink
                key={item.key}
                href={item.href}
                active={menuKey !== null && activeMenu === menuKey}
                selected={selectedNav === item.key}
                ariaHaspopup={menuKey ? "menu" : undefined}
                ariaExpanded={menuKey ? activeMenu === menuKey : undefined}
                // Bestsellers has no dropdown: hovering it closes any open menu.
                onMouseEnter={() => {
                  if (menuKey) {
                    openMenu(menuKey)
                    return
                  }
                  cancelMenuClose()
                  setActiveMenu(null)
                }}
                onFocus={() => (menuKey ? openMenu(menuKey) : setActiveMenu(null))}
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
              )
            })}
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
                "block h-auto w-[8.5rem] max-w-none transition-[filter,opacity] duration-300 ease-out",
                isOverlay && !isLightSurface && "invert"
              )}
            />
          </Link>

          <div
            className="flex items-center justify-self-end gap-2 xl:gap-3"
            onMouseEnter={scheduleMenuClose}
          >
            <IconButton
              label="Search products"
              tone={tone}
              onClick={() => setSearchOpen(true)}
              ariaHaspopup="dialog"
              ariaExpanded={searchOpen}
            >
              <Search className="size-[18px] stroke-[1.7]" />
            </IconButton>

            <Link
              href="/login"
              aria-label="Profile"
              className="inline-flex size-9 cursor-pointer items-center justify-center text-current transition-[color,opacity] duration-300 ease-out hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30"
            >
              <UserRound className="size-[18px] stroke-[1.7]" />
            </Link>

            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => setIsSidebarOpen(true)}
              className={cn(
                "inline-flex size-9 cursor-pointer items-center justify-center text-current transition-[color,opacity] duration-300 ease-out hover:opacity-60 focus-visible:outline-none focus-visible:ring-2",
                tone === "light"
                  ? "focus-visible:ring-white/30"
                  : "focus-visible:ring-black/25"
              )}
            >
              <span className="relative inline-flex items-center justify-center">
                <Heart className="size-[18px] stroke-[1.7]" />
                {wishlist.length > 0 && isLoaded && (
                  <span
                    className={cn(
                      "absolute -right-1.5 -top-1 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full px-[3px] text-[9px] font-bold leading-none ring-1",
                      tone === "light"
                        ? "bg-white text-black ring-black/20"
                        : "bg-black text-white ring-white"
                    )}
                  >
                    {wishlist.length}
                  </span>
                )}
              </span>
            </button>

            <IconButton
              label="Cart"
              tone={tone}
              onClick={() => setIsCartOpen(true)}
            >
              <span className="relative inline-flex items-center justify-center">
                <CartIcon />
                {totalItems > 0 && isLoaded && (
                  <span
                    className={cn(
                      "absolute -right-1.5 -top-1 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full px-[3px] text-[9px] font-bold leading-none ring-1",
                      tone === "light"
                        ? "bg-white text-black ring-black/20"
                        : "bg-black text-white ring-white"
                    )}
                  >
                    {totalItems}
                  </span>
                )}
              </span>
            </IconButton>
          </div>
        </div>

        {/* Mobile Header: Single row with Hamburger */}
        <div className="relative z-[1] flex h-full items-center justify-between lg:hidden">
          <div className="z-10 flex items-center gap-1">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                "inline-flex size-9 cursor-pointer items-center justify-center text-current transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2",
                tone === "light"
                  ? "focus-visible:ring-white/30"
                  : "focus-visible:ring-black/25"
              )}
            >
              <Menu className="size-[20px] stroke-[1.8]" />
            </button>

            <IconButton
              label="Search"
              tone={tone}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-[18px] stroke-[1.7]" />
            </IconButton>
          </div>

          <Link
            href="/"
            aria-label="SUOS home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
          >
            <Image
              src="/logo.svg"
              alt="SUOS"
              width={160}
              height={70}
              priority
              className={cn(
                "block h-auto w-[6rem] max-w-none transition-[filter,opacity] duration-300 ease-out",
                isOverlay && !isLightSurface && "invert"
              )}
            />
          </Link>

          <div className="z-10 flex items-center gap-1">
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => setIsSidebarOpen(true)}
              className={cn(
                "inline-flex size-9 cursor-pointer items-center justify-center text-current transition-[color,opacity] duration-300 ease-out hover:opacity-60 focus-visible:outline-none focus-visible:ring-2",
                tone === "light"
                  ? "focus-visible:ring-white/30"
                  : "focus-visible:ring-black/25"
              )}
            >
              <span className="relative inline-flex items-center justify-center">
                <Heart className="size-[18px] stroke-[1.7]" />
                {wishlist.length > 0 && isLoaded && (
                  <span
                    className={cn(
                      "absolute -right-1.5 -top-1 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full px-[3px] text-[9px] font-bold leading-none ring-1",
                      tone === "light"
                        ? "bg-white text-black ring-black/20"
                        : "bg-black text-white ring-white"
                    )}
                  >
                    {wishlist.length}
                  </span>
                )}
              </span>
            </button>

            <IconButton
              label="Cart"
              tone={tone}
              onClick={() => setIsCartOpen(true)}
            >
              <span className="relative inline-flex items-center justify-center">
                <CartIcon />
                {totalItems > 0 && isLoaded && (
                  <span
                    className={cn(
                      "absolute -right-1.5 -top-1 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full px-[3px] text-[9px] font-bold leading-none ring-1",
                      tone === "light"
                        ? "bg-white text-black ring-black/20"
                        : "bg-black text-white ring-white"
                    )}
                  >
                    {totalItems}
                  </span>
                )}
              </span>
            </IconButton>
          </div>
        </div>

        <AnimatePresence>
          {activeMenu && activeMenu !== "wishlist" && (
            <motion.div
              aria-hidden={false}
              initial={
                prefersReducedMotion
                  ? false
                  : { clipPath: "inset(0 0 100% 0)" }
              }
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : {
                      clipPath: "inset(0 0 100% 0)",
                      transition: megaMenuCloseTransition,
                    }
              }
              transition={
                prefersReducedMotion ? { duration: 0 } : megaMenuRevealTransition
              }
              style={{ height: MEGA_MENU_HEIGHT }}
              className="absolute left-0 top-full hidden w-full overflow-hidden !bg-white text-black shadow-[0_24px_60px_rgba(0,0,0,0.08)] [will-change:clip-path] lg:block"
              onMouseEnter={cancelMenuClose}
              onMouseLeave={scheduleMenuClose}
            >
              <AnimatePresence
                initial={false}
                custom={menuSlideDirection}
              >
                <motion.div
                  key={activeMenu}
                  custom={menuSlideDirection}
                  variants={megaMenuContentVariants}
                  initial={prefersReducedMotion ? false : "enter"}
                  animate="center"
                  exit={prefersReducedMotion ? undefined : "exit"}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : megaMenuContentTransition
                  }
                  className="absolute inset-0"
                >
                  {activeMenu === "collections" ? (
                    <div className="flex h-full w-full items-start gap-12 px-4 py-7 sm:px-6 lg:px-8">
                      {collectionsLeftCard ? (
                        <MenuCard
                          card={collectionsLeftCard}
                          open={Boolean(activeMenu)}
                          onClose={closeMenu}
                        />
                      ) : null}

                      <div className="min-w-[10rem] flex-1">
                        {menuGroups.collections.map((group) => (
                          <MenuSection
                            key={group.title}
                            title={group.title}
                            items={group.items}
                            open={Boolean(activeMenu)}
                            onClose={closeMenu}
                          />
                        ))}
                      </div>

                      {collectionsRightCards.length > 0 ? (
                        <div className="flex shrink-0 gap-4">
                          {collectionsRightCards.map((card, index) => (
                            <MenuCard
                              key={`${card.image}-${index}`}
                              card={card}
                              open={Boolean(activeMenu)}
                              onClose={closeMenu}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-start gap-12 px-4 py-7 sm:px-6 lg:px-8">
                      <div className="grid min-w-0 flex-1 grid-cols-3 gap-x-8 xl:gap-x-12">
                        {menuGroups.men.map((group) => (
                          <MenuSection
                            key={group.title}
                            title={group.title}
                            items={group.items}
                            open={Boolean(activeMenu)}
                            onClose={closeMenu}
                          />
                        ))}
                      </div>

                      {menCards.length > 0 ? (
                        <div className="flex shrink-0 gap-4">
                          {menCards.map((card, index) => (
                            <MenuCard
                              key={`${card.image}-${index}`}
                              card={card}
                              open={Boolean(activeMenu)}
                              onClose={closeMenu}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SearchSidebar open={searchOpen} onOpenChange={setSearchOpen} />
      <CartSidebar open={isCartOpen} onOpenChange={setIsCartOpen} />
      <WishlistSidebar />

      {/* Mobile Navigation Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          overlayClassName="!z-[10000] bg-black/60 backdrop-blur-[2px]"
          className="!z-[10001] flex flex-col justify-between border-r border-white/10 bg-black p-0 text-white shadow-2xl"
          style={{ width: "min(100vw, 340px)", maxWidth: "none" }}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Explore products, collections, and account.
          </SheetDescription>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="transition-opacity hover:opacity-70"
            >
              <Image
                src="/logo.svg"
                alt="SUOS"
                width={140}
                height={65}
                className="h-auto w-[5.5rem] invert"
              />
            </Link>
            <SheetClose asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex size-9 cursor-pointer items-center justify-center text-white/80 transition-colors hover:text-white"
              >
                <X className="size-5 stroke-[2]" />
              </button>
            </SheetClose>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-6">
              <p className="text-[11px] font-medium uppercase leading-[1.4] tracking-normal text-white/40">
                Menu
              </p>
              <nav className="flex flex-col gap-2">
                {primaryNav.map((item) => {
                  const menuKey = item.hasMenu ? (item.key as MegaMenuKey) : null
                  const groups = menuKey ? menuGroups[menuKey] : null
                  const expanded = menuKey !== null && mobileExpanded === menuKey

                  return (
                    <div key={item.key}>
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={item.href}
                          onClick={() => {
                            setSelectedNav(item.key)
                            setMobileMenuOpen(false)
                          }}
                          className={cn(
                            "flex-1 py-2.5 text-[17px] font-normal uppercase leading-[1.2] tracking-normal transition-colors hover:text-white/70",
                            selectedNav === item.key ? "text-white" : "text-white/80"
                          )}
                        >
                          {item.label}
                        </Link>
                        {groups ? (
                          <button
                            type="button"
                            aria-label={`${expanded ? "Hide" : "Show"} ${item.label} menu`}
                            aria-expanded={expanded}
                            onClick={() =>
                              setMobileExpanded((current) =>
                                current === menuKey ? null : menuKey
                              )
                            }
                            className="inline-flex size-9 cursor-pointer items-center justify-center text-white/50 transition-colors hover:text-white"
                          >
                            <ChevronDown
                              className={cn(
                                "size-4 stroke-[1.5] transition-transform duration-200",
                                expanded && "rotate-180"
                              )}
                            />
                          </button>
                        ) : (
                          <ChevronRight className="mr-2.5 size-4 stroke-[1.5] text-white/40" />
                        )}
                      </div>

                      {groups && expanded ? (
                        <div className="space-y-5 pb-3 pl-1 pt-1">
                          {groups.map((group) => (
                            <div key={group.title}>
                              <p className="text-[11px] uppercase leading-[1.4] tracking-normal text-white/40">
                                {group.title}
                              </p>
                              <ul className="mt-2 space-y-1">
                                {group.items.map((link) => (
                                  <li key={`${link.label}-${link.href}`}>
                                    <Link
                                      href={link.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block py-1.5 text-[14px] uppercase leading-[1.4] tracking-normal text-white/75 transition-colors hover:text-white"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </nav>

              <div className="my-1 h-px w-full bg-white/10" />

              <p className="text-[11px] font-medium uppercase leading-[1.4] tracking-normal text-white/40">
                Account & Utilities
              </p>

              <div className="flex flex-col gap-2 text-[14px] uppercase leading-[1.4] tracking-normal text-white/75">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSearchOpen(true)
                  }}
                  className="flex items-center gap-3 py-2 text-left transition-colors hover:text-white cursor-pointer"
                >
                  <Search className="size-4 stroke-[1.8]" />
                  <span>Search Products</span>
                </button>

                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 transition-colors hover:text-white"
                >
                  <UserRound className="size-4 stroke-[1.8]" />
                  <span>My Account</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setIsSidebarOpen(true)
                  }}
                  className="flex items-center justify-between py-2 text-left transition-colors hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="size-4 stroke-[1.8]" />
                    <span>Wishlist</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setIsCartOpen(true)
                  }}
                  className="flex items-center justify-between py-2 text-left transition-colors hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CartIcon className="size-4" strokeWidth={1.8} />
                    <span>Bag / Cart</span>
                  </div>
                  {totalItems > 0 && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer in Drawer */}
          <div className="border-t border-white/10 p-5">
            <p className="text-[11px] uppercase leading-[1.4] tracking-normal text-white/40">
              SUOS ORIGINALS — FREE SHIPPING OVER ₹2,900
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )

  return isOverlay ? (
    <div className="main-navbar-slot">{headerContent}</div>
  ) : (
    headerContent
  )
}
