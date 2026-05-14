import Image from "next/image"
import Link from "next/link"

import { Navbar } from "@/components/Navbar"

const heroPages = [
  { label: "1/4", active: false },
  { label: "2/4", active: true },
  { label: "3/4", active: false },
  { label: "4/4", active: false },
]

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#d4cdc1] text-white">
      <Navbar variant="overlay" className="pointer-events-auto" />

      <div className="absolute inset-0 grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-1">
        <div className="relative min-h-[50svh] lg:min-h-0">
          <Image
            src="/images/hero-left.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
        <div className="relative min-h-[50svh] lg:min-h-0">
          <Image
            src="/images/hero-right.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center grayscale"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/10" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-end justify-center px-5 pb-20 pt-[98px] sm:px-6 lg:pb-[7rem]">
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="font-heading text-[clamp(2.5rem,5.2vw,5.4rem)] font-semibold uppercase leading-none tracking-[-0.045em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
            Refine Your Style
          </h1>
          <Link
            href="/#collection"
            className="inline-flex items-center justify-center border border-white/85 px-5 py-2.5 text-[0.875rem] uppercase tracking-[0.12em] transition-colors hover:bg-white/10"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 right-7 z-20 flex items-center gap-2 text-white/85">
        <div className="flex items-center gap-2">
          {heroPages.map((page) => (
            <span
              key={page.label}
              className={
                page.active
                  ? "size-4 rounded-full bg-white"
                  : "size-3 rounded-full bg-white/35"
              }
            />
          ))}
        </div>
        <span className="ml-1 text-sm font-normal tracking-[0.04em]">
          2/4
        </span>
      </div>

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
      <span id="collection" className="sr-only">
        Collection
      </span>
    </section>
  )
}
