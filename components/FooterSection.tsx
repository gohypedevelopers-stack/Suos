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
 * Footer: the SUOS / HELP / FOLLOW link columns and the newsletter, then the
 * legal links and copyright. Spacing follows the Calvin Klein footer: four
 * equal columns across the full width, roomy link rows (about 40px apart) and
 * a separate bottom block. Everything is edited in Website content → Footer;
 * links with an empty URL are hidden.
 */
export function FooterSection() {
  const { footer } = useSiteContent()
  const columns = footer.columns
    .map((column) => ({ ...column, links: column.links.filter((link) => link.href.trim()) }))
    .filter((column) => column.links.length > 0)

  return (
    <footer className="w-full bg-white text-black">
      <div className="px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pb-14 lg:pt-[70px]">
        <div className="reveal-stagger grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">
          {columns.map((column) => (
            <div key={column.title} data-reveal="soft">
              <h3 className="text-[15px] font-semibold uppercase leading-5 tracking-normal">{column.title}</h3>
              <ul className="mt-[18px] space-y-[21px] text-[15px] leading-5">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div data-reveal="soft" className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h3 className="text-[15px] font-semibold leading-5 tracking-normal">{footer.newsletterHeading}</h3>
            <form className="mt-[18px] max-w-[412px]" onSubmit={(event) => event.preventDefault()}>
              <label className="block border-b border-black pb-2">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  placeholder={footer.newsletterPlaceholder}
                  className="h-8 w-full bg-transparent text-[15px] text-black outline-none placeholder:text-black/55 selection:bg-black selection:text-white"
                />
              </label>
              <button
                type="submit"
                className="mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center border border-black bg-black px-8 text-[15px] text-white transition-opacity hover:opacity-85"
              >
                {footer.newsletterButton}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 text-[13px] leading-5 text-black/60 lg:mt-[120px]">
          <Link href="/" aria-label="SUOS home" className="mb-5 inline-block transition-opacity hover:opacity-70">
            <Image src="/logo.svg" alt="SUOS" width={260} height={120} className="block h-auto w-[5.5rem]" />
          </Link>
          {footer.legalLinks.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-y-1">
              {footer.legalLinks.map((link, index) => (
                <li key={`${link.label}-${link.href}`} className="flex items-center">
                  {index > 0 ? <span aria-hidden="true" className="mx-3">&bull;</span> : null}
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-1.5">{footer.copyright}</p>
          {footer.location.trim() ? (
            <p className="mt-4 flex items-center gap-1.5 text-[14px] text-black/80">
              <MapPin aria-hidden="true" className="size-4" strokeWidth={1.5} />
              {footer.location}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
