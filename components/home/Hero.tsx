"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { HomeHeroBanner } from "@/lib/server/dal/banners"

const defaultFallbackBanner: HomeHeroBanner = {
  id: "default-hero",
  title: null,
  subtitle: null,
  desktopImageUrl: "/home-page-content/hero-1.png",
  mobileImageUrl: "/home-page-content/hero-mobile.jpg",
  ctaText: "Explore Collection",
  ctaLink: "/collections",
  textAlignment: "CENTER",
  overlayOpacity: 15,
}

export function Hero({ banners }: { banners?: HomeHeroBanner[] }) {
  const slides = banners && banners.length > 0 ? banners : [defaultFallbackBanner]
  const [activeSlide, setActiveSlide] = useState(0)

  // Continuous auto-rotation every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative -mt-[var(--header-stack-height)] w-full h-[100svh] min-h-[580px] bg-black text-white overflow-hidden">
      {slides.map((slide, index) => {
        const isActive = index === activeSlide

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0",
            )}
          >
            {/* Full-screen hero image covering full viewport without black letterboxing */}
            <div className="relative w-full h-full">
              {slide.mobileImageUrl ? (
                <>
                  <div className="relative block sm:hidden w-full h-full">
                    <Image
                      src={slide.mobileImageUrl}
                      alt={slide.title || "Hero Banner"}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                  <div className="relative hidden sm:block w-full h-full">
                    <Image
                      src={slide.desktopImageUrl}
                      alt={slide.title || "Hero Banner"}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                </>
              ) : (
                <Image
                  src={slide.desktopImageUrl}
                  alt={slide.title || "Hero Banner"}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center w-full h-full"
                />
              )}

              {/* Gradient Dark Overlay */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60"
                style={{
                  opacity: Math.max(0.2, (slide.overlayOpacity ?? 15) / 100),
                }}
              />
            </div>

            {/* Clickable full-slide link when button text is omitted */}
            {!slide.ctaText && slide.ctaLink && (
              <Link
                href={slide.ctaLink}
                className="absolute inset-0 z-10"
                aria-label={slide.title || "Hero banner"}
              />
            )}

            {/* Content & CTA Button (Only rendered if title, subtitle, or button exists) */}
            {(slide.title || slide.subtitle || slide.ctaText) && (
              <div
                className={cn(
                  "absolute inset-x-0 bottom-8 sm:bottom-12 lg:bottom-16 z-20 px-4 sm:px-8 flex flex-col pointer-events-none",
                  slide.textAlignment === "LEFT"
                    ? "items-start text-left max-w-7xl mx-auto"
                    : slide.textAlignment === "RIGHT"
                      ? "items-end text-right max-w-7xl mx-auto"
                      : "items-center text-center justify-center",
                )}
              >
                {slide.title && (
                  <h2 className="text-white text-sm sm:text-2xl lg:text-3xl font-serif font-normal uppercase tracking-[0.14em] drop-shadow-md leading-tight">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="mt-0.5 sm:mt-1 text-white/90 text-[9px] sm:text-xs uppercase tracking-[0.2em] font-light drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                )}

                {slide.ctaText && (
                  <div className={cn(slide.title || slide.subtitle ? "mt-2.5 sm:mt-4" : "")}>
                    <Link
                      href={slide.ctaLink || "/collections"}
                      className="inline-flex cursor-pointer pointer-events-auto items-center justify-center border border-white/85 bg-black/30 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 text-[10px] sm:text-[13px] font-normal uppercase tracking-[0.12em] sm:tracking-normal transition-colors hover:bg-white/10 shadow-sm"
                    >
                      {slide.ctaText}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Subtle Slide Indicator Dots (when multiple slides exist, no arrows) */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 right-6 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 cursor-pointer",
                idx === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
          <span className="ml-1 text-[10px] font-mono text-white/75">
            {activeSlide + 1}/{slides.length}
          </span>
        </div>
      )}

      {/* Screen-reader anchors preserved */}
      <span id="women" className="sr-only">
        Women
      </span>
      <span id="men" className="sr-only">
        Men
      </span>
      <span id="bestsellers" className="sr-only">
        Bestsellers
      </span>
      <span id="contact" className="sr-only">
        Contact Us
      </span>
      <span id="collections" className="sr-only">
        Collection
      </span>
    </section>
  )
}
