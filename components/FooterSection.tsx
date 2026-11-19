"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

import { useSiteContent } from "@/lib/site-content-context"
import type { NavMenuLink } from "@/lib/site-content"

const isExternal = (href: string) => /^https?:\/\//.test(href)

function FooterLink({ link, className }: { link: NavMenuLink; className?: string }) {
  const external = isExternal(link.href)
  return (
    <Link
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`link-swap ${className ?? ""}`}
    >
      {link.label}
    </Link>
  )
}

/**
 * Footer, built to the footer design spec (Inter):
 * - Desktop (≥1024px): 4 link columns + newsletter in one row, 40px gaps,
 *   32px side padding, 70px top / 56px bottom.
 * - Tablet (≥640px): the 4 link columns in a row, newsletter on its own row (400px wide).
 * - Mobile: link columns two per row, newsletter full width.
 * Column headings 15px semibold uppercase → links 18px below, 21px apart
 * (15px regular, 80% black). Bottom block: SUOS logo, Contact Us (13px),
 * copyright and location (14px, 60% black), 12px apart.
 * Everything is edited in Website content → Footer; links with an empty URL are hidden.
 */
export function FooterSection() {
  const { footer } = useSiteContent()
  const columns = footer.columns
    .map((column) => ({ ...column, links: column.links.filter((link) => link.href.trim()) }))
    .filter((column) => column.links.length > 0)
  const bottomLinks = footer.bottomLinks.filter((link) => link.href.trim())

  return (
    <footer className="w-full bg-white text-black">
      <div className="px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pt-[70px]">
        <div className="reveal-stagger grid grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
          {columns.map((column) => (
            <div key={column.title} data-reveal="soft">
              <h3 className="text-[15px] font-semibold uppercase leading-5 tracking-normal text-black">{column.title}</h3>
              <ul className="mt-[18px] flex flex-col gap-[21px] text-[15px] leading-5 text-black/80">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <FooterLink link={link} className="transition-colors hover:text-black" />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div data-reveal="soft" className="col-span-2 sm:col-span-4 sm:max-w-[400px] lg:col-span-1 lg:max-w-none">
            <h3 className="text-[15px] font-semibold leading-5 tracking-normal text-black">{footer.newsletterHeading}</h3>
            <form className="mt-[18px]" onSubmit={(event) => event.preventDefault()}>
              <label className="block border-b border-black pb-2">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  placeholder={footer.newsletterPlaceholder}
                  className="h-5 w-full bg-transparent text-[15px] leading-5 text-black outline-none placeholder:text-black/55 selection:bg-black selection:text-white"
                />
              </label>
              <button
                type="submit"
                className="mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center bg-black px-8 text-[15px] text-white transition-opacity hover:opacity-85"
              >
                {footer.newsletterButton}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start gap-3 lg:mt-[120px]">
          <Link href="/" aria-label="SUOS home" className="mb-3 transition-opacity hover:opacity-70">
            <Image src="/logo.svg" alt="SUOS" width={260} height={120} className="block h-auto w-[88px]" />
          </Link>
          {bottomLinks.length > 0 ? (
            <ul className="flex flex-wrap items-center text-[13px] leading-5 text-black/60">
              {bottomLinks.map((link, index) => (
                <li key={`${link.label}-${link.href}`} className="flex items-center">
                  {index > 0 ? <span aria-hidden="true" className="mx-3">&bull;</span> : null}
                  <FooterLink link={link} className="transition-colors hover:text-black" />
                </li>
              ))}
            </ul>
          ) : null}
          {footer.copyright.trim() ? (
            <p className="text-[14px] leading-5 text-black/60">{footer.copyright}</p>
          ) : null}
          {footer.location.trim() ? (
            <p className="mt-1 flex items-center gap-1.5 text-[14px] leading-5 text-black/80">
              <MapPin aria-hidden="true" className="size-4" strokeWidth={1.5} />
              {footer.location}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
