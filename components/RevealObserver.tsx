"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Scroll-reveal for the storefront. Any element with a `data-reveal` attribute
 * ("up", "fade", "zoom", "text") starts hidden and animates in when it scrolls
 * into view; the look lives in globals.css (.reveal-ready). Page headings
 * (h1/h2 inside <main>) get "text" automatically: they rise out of a mask.
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

    // A masked heading is clipped to nothing while hidden, and Chrome then
    // reports it as never on screen, so headings are watched through their
    // parent block instead (parent -> headings waiting on it).
    const viaParent = new Map<Element, HTMLElement[]>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target
          if (target.hasAttribute("data-reveal")) target.classList.add("is-revealed")
          viaParent.get(target)?.forEach((el) => el.classList.add("is-revealed"))
          viaParent.delete(target)
          observer.unobserve(target)
        }
      },
      // Starts when the element's top reaches 90% down the screen ("top 90%").
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    )

    const track = (el: HTMLElement) => {
      const parent = el.parentElement
      if (el.dataset.reveal !== "text" || !parent) {
        observer.observe(el)
        return
      }
      viaParent.set(parent, [...(viaParent.get(parent) ?? []), el])
      observer.observe(parent)
    }

    const watch = (scope: ParentNode) => {
      // Headings rise out of a mask (layered on any block reveal around them).
      scope.querySelectorAll<HTMLElement>("main h1, main h2").forEach((el) => {
        if (el.closest("[data-no-text-reveal], [role='dialog']")) return
        // A heading's own plain fade-up is upgraded too; zoom etc. are left alone.
        if (el.hasAttribute("data-reveal") && el.dataset.reveal !== "up") return
        if (el.classList.contains("sr-only")) return
        el.dataset.reveal = "text"
      })
      // Rows: each card slides in from the right. A card that already has its
      // own fade-up (product cards) is switched over instead of doubled up.
      scope.querySelectorAll<HTMLElement>("[data-reveal-children]").forEach((row) => {
        const mode = row.dataset.revealChildren || "up"
        for (const child of Array.from(row.children) as HTMLElement[]) {
          const target =
            child.hasAttribute("data-reveal")
              ? child
              : child.querySelector<HTMLElement>(":scope > [data-reveal='up'], :scope > * > [data-reveal='up']") ?? child
          if (!target.classList.contains("is-revealed")) target.dataset.reveal = mode
        }
      })
      scope.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)").forEach((el) => {
        // Already visible at start: show without animating.
        if (!root.classList.contains("reveal-ready") && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-revealed")
          return
        }
        track(el)
      })
    }

    watch(document)
    root.classList.add("reveal-ready")

    // Sections rendered later (client navigation, lazy content).
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]:not(.is-revealed)")) track(node)
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
