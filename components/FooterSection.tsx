"use client"

import Link from "next/link"

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
      className={`underline-offset-4 transition-opacity hover:opacity-60 ${className ?? ""}`}
    >
      {link.label}
    </Link>
  )
}

/**
 * Footer from the client's brief: SUOS / HELP / FOLLOW link columns and the
 * newsletter, then a copyright line with Privacy Policy and Terms. Everything
 * is edited in Website content → Footer; links with an empty URL are hidden.
 */
export function FooterSection() {
  const { footer } = useSiteContent()
  const columns = footer.columns
    .map((column) => ({ ...column, links: column.links.filter((link) => link.href.trim()) }))
    .filter((column) => column.links.length > 0)

  return (
    <footer className="w-full bg-white text-black">
      <div className="px-4 pb-6 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="reveal-stagger grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,0.7fr))_minmax(0,1.3fr)] lg:gap-x-12">
          {columns.map((column) => (
            <div key={column.title} data-reveal="up">
              <h3 className="text-[18px] font-medium uppercase leading-[22px] tracking-normal sm:text-h4">{column.title}</h3>
              <ul className="mt-5 space-y-2.5 text-[15px] leading-[20px] sm:text-body">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div data-reveal="up" className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h3 className="text-[18px] leading-[22px] tracking-normal sm:text-h4 sm:font-normal">{footer.newsletterHeading}</h3>
            <form
              className="mt-5 max-w-[420px]"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="block border-b border-black pb-2">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  placeholder={footer.newsletterPlaceholder}
                  className="h-8 w-full bg-transparent text-body text-black outline-none placeholder:text-black/60 selection:bg-black selection:text-white"
                />
              </label>
              <button
                type="submit"
                className="mt-6 inline-flex h-11 min-w-[160px] cursor-pointer items-center justify-center border border-black bg-black px-8 text-button uppercase text-white transition-opacity hover:opacity-85"
              >
                {footer.newsletterButton}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-black/15 pt-5 text-caption sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          {footer.legalLinks.length > 0 ? (
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {footer.legalLinks.map((link) => (
                <FooterLink key={`${link.label}-${link.href}`} link={link} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
