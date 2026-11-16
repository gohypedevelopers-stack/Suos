"use client"

import Lenis from "lenis"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Site-wide motion: Lenis smooth (inertia) scrolling plus scroll-linked image
 * effects. The effects only write CSS variables; the look lives in
 * globals.css ("Scroll-linked motion").
 *
 *   data-parallax          photo drifts slowly against the scroll (--parallax: -1…1)
 *   data-parallax="out"    hero: media sinks and copy lifts away as it scrolls off (--parallax-out: 0…1)
 *   data-unfold            banner opens from a smaller frame as it enters (--unfold: 0…1)
 *   data-scroll-zoom       photo settles from a slight zoom as it scrolls in (--scroll-zoom: 1…0)
 *
 * Everything is skipped for visitors who prefer reduced motion.
 */
export function SmoothMotion() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)
  const fromHistoryRef = useRef(false)
  const lastPathRef = useRef(pathname)

  // Smooth scrolling, created once for the whole visit.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { duration: 1.6, offset: -70 },
      autoRaf: true,
      // Let drawers, dialogs and inner scroll areas scroll natively.
      prevent: (node) => Boolean(node.closest?.('[role="dialog"], [data-lenis-prevent], [data-radix-scroll-area-viewport]')),
    })

    // Pause while a dialog or drawer locks the page (Radix sets data-scroll-locked on <body>).
    const syncLock = () => {
      if (document.body.hasAttribute("data-scroll-locked")) lenis.stop()
      else lenis.start()
    }
    const lockObserver = new MutationObserver(syncLock)
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] })

    // Back / Forward: drop any glide still running so the browser can restore
    // the old page's position, and remember not to jump to the top.
    const onHistory = () => {
      fromHistoryRef.current = true
      lenis.stop()
      lenis.start()
    }
    window.addEventListener("popstate", onHistory)

    lenisRef.current = lenis
    return () => {
      window.removeEventListener("popstate", onHistory)
      lockObserver.disconnect()
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // A new page always opens at the top. Without this, a glide still running
  // from the previous page (click right after scrolling) carries on and lands
  // the new page half-way down.
  useEffect(() => {
    if (lastPathRef.current === pathname) return
    lastPathRef.current = pathname
    const lenis = lenisRef.current
    if (!lenis) return
    if (fromHistoryRef.current) {
      fromHistoryRef.current = false
      return
    }
    if (window.location.hash) return
    lenis.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  // Scroll-linked effects, re-scanned on every page.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const visible = new Set<HTMLElement>()
    const tracked = new Set<HTMLElement>()
    let frame = 0

    const update = () => {
      frame = 0
      const vh = window.innerHeight
      for (const el of visible) {
        const rect = el.getBoundingClientRect()
        if (el.hasAttribute("data-scroll-zoom")) {
          // 1 when the top edge enters at the bottom, 0 once the bottom edge reaches the middle.
          const progress = (vh - rect.top) / (rect.height + vh / 2)
          el.style.setProperty("--scroll-zoom", (1 - clamp(progress, 0, 1)).toFixed(4))
        } else if (el.hasAttribute("data-unfold")) {
          // Frame: opens from the top edge entering at the bottom until it reaches the top.
          el.style.setProperty("--unfold", clamp((vh - rect.top) / vh, 0, 1).toFixed(4))
          // Photo: settles from the same start until the banner's bottom reaches the bottom.
          el.style.setProperty("--unfold-zoom", clamp((vh - rect.top) / rect.height, 0, 1).toFixed(4))
        } else if (el.dataset.parallax === "out") {
          el.style.setProperty("--parallax-out", clamp(-rect.top / rect.height, 0, 1).toFixed(4))
        } else {
          // -1 entering at the bottom, 0 centred, 1 leaving at the top.
          const progress = (vh - rect.top) / (vh + rect.height)
          el.style.setProperty("--parallax", (clamp(progress, 0, 1) * 2 - 1).toFixed(4))
        }
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) visible.add(el)
          else visible.delete(el)
        }
        schedule()
      },
      { rootMargin: "10% 0px" },
    )

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-parallax], [data-unfold], [data-scroll-zoom]").forEach((el) => {
        if (tracked.has(el)) return
        tracked.add(el)
        // Start banners closed so they open as they arrive.
        if (el.hasAttribute("data-unfold") && el.getBoundingClientRect().top > window.innerHeight) {
          el.style.setProperty("--unfold", "0")
          el.style.setProperty("--unfold-zoom", "0")
        }
        io.observe(el)
      })
    }
    scan()

    let scanFrame = 0
    const mutations = new MutationObserver(() => {
      if (!scanFrame) scanFrame = requestAnimationFrame(() => ((scanFrame = 0), scan()))
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    schedule()

    return () => {
      io.disconnect()
      mutations.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(scanFrame)
    }
  }, [pathname])

  return null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
