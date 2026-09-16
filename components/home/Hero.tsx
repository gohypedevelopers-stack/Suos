"use client"

import Image from "next/image"
import Link from "next/link"
// import { useEffect, useState } from "react"

// import { cn } from "@/lib/utils"

/*
type HeroSlide = {
  leftImage: string
  rightImage: string
}

const heroSlides: HeroSlide[] = [
  {
    leftImage: "/images/products/product1.png",
    rightImage: "/images/products/product2.png",
  },
  {
    leftImage: "/images/hero-left.png",
    rightImage: "/images/hero-right.png",
  },
  {
    leftImage: "/images/products/product3.png",
    rightImage: "/images/products/product4.png",
  },
  {
    leftImage: "/images/products/product8.png",
    rightImage: "/images/products/product9.png",
  },
]
*/

export function Hero() {
  /*
  const [activeSlide, setActiveSlide] = useState(1)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 5000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])
  */

  return (
    <section className="relative -mt-[var(--header-stack-height)] w-full bg-black text-white">
      {/* Static Single Banner Image with exact aspect ratio - 100% uncropped on all devices */}
      <div className="relative w-full aspect-[1672/941]">
        <Image
          src="/home-page-content/hero-1.png"
          alt="Hero Banner"
          fill
          priority
          sizes="100vw"
          className="object-contain w-full h-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

        {/* Center CTA Button placed near bottom of banner */}
        <div className="absolute inset-x-0 bottom-6 sm:bottom-10 lg:bottom-14 z-10 flex items-center justify-center px-5 sm:px-6">
          <Link
            href="/collections"
            className="inline-flex cursor-pointer items-center justify-center border border-white/85 bg-black/20 backdrop-blur-xs px-6 py-3 text-[13px] font-normal uppercase tracking-normal transition-colors hover:bg-white/10 shadow-sm"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      {/* 
      Commented out changing banner slides:
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeSlide

          return (
            <div
              key={slide.leftImage}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 grid grid-rows-2 transition-opacity duration-700 ease-out lg:grid-cols-2 lg:grid-rows-1",
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            >
              <div className="relative min-h-[50svh] lg:min-h-0">
                <Image
                  src={slide.leftImage}
                  alt=""
                  fill
                  priority={isActive}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="relative min-h-[50svh] lg:min-h-0">
                <Image
                  src={slide.rightImage}
                  alt=""
                  fill
                  priority={isActive}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center grayscale"
                />
              </div>
            </div>
          )
        })}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/10" />
      </div>
      */}

      {/* 
      Slide pagination controls commented out:
      <div className="absolute bottom-6 right-7 z-20 flex items-center gap-2 text-white/85">
        <div className="flex items-center gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.leftImage}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={index === activeSlide}
              onClick={() => setActiveSlide(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                index === activeSlide
                  ? "size-3 bg-white"
                  : "size-3 bg-white/35 hover:bg-white/60"
              )}
            />
          ))}
        </div>
        <span className="ml-1 text-sm font-normal tracking-[0.04em]">
          {activeSlide + 1}/{heroSlides.length}
        </span>
      </div>
      */}

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
