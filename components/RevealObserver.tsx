"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Scroll-reveal for the storefront (Calvin Klein-style). Any element with a
 * `data-reveal` attribute ("up", "fade", "zoom") starts hidden and animates in
 * when it scrolls into view; the look lives in globals.css (.reveal-ready).
 *
 * Content is only hidden once this script runs, so pages still show
 * everything without JavaScript. Elements already on screen when it starts are
 * shown immediately, so nothing flickers.
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const root = document.documentElement

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-revealed")
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    )

    const watch = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)").forEach((el) => {
        // Already visible at start: show without animating.
        if (!root.classList.contains("reveal-ready") && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-revealed")
          return
        }
        observer.observe(el)
      })
    }

    watch(document)
    root.classList.add("reveal-ready")

    // Sections rendered later (client navigation, lazy content).
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]")) observer.observe(node)
            watch(node)
          }
        })
      }
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [pathname])

  return null
}
