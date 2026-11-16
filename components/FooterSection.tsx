"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ContactLineItem } from "@/components/ContactLines"
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

const columnTitle = "text-[15px] font-bold uppercase leading-5 tracking-normal sm:text-[16px]"
const smallCaps = "text-[12px] uppercase leading-4 tracking-normal sm:text-[13px]"
// Desktop columns (Figma): link columns and Contact keep fixed widths so they
// stay close together on wide screens; only the gap before the newsletter
// grows. The bottom row reuses it so its links line up under the columns.
const desktopGrid =
  "lg:grid-cols-[150px_170px_minmax(200px,1fr)_minmax(0,340px)] xl:grid-cols-[190px_220px_minmax(240px,1fr)_minmax(0,440px)] lg:gap-x-8 xl:gap-x-10"

/**
 * Footer (Figma "More about SUOS"): heading and rule; link columns, Contact
 * and the newsletter; then a rule with the legal links on the left and the
 * social links on the right. All text is edited in Website content → Footer;
 * links with an empty URL are hidden, and a column titled "Follow" provides
 * the social links.
 */
export function FooterSection() {
  const { footer } = useSiteContent()
  const visible = footer.columns
    .map((column) => ({ ...column, links: column.links.filter((link) => link.href.trim()) }))
    .filter((column) => column.links.length > 0)
  const isFollow = (title: string) => title.trim().toLowerCase().startsWith("follow")
  const columns = visible.filter((column) => !isFollow(column.title))
  const social = visible.filter((column) => isFollow(column.title)).flatMap((column) => column.links)
  const contactGroups = footer.contactGroups.filter((group) => group.lines.some((line) => line.value.trim()))

  return (
    <footer className="w-full bg-white text-black">
      <div className="px-4 pb-6 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        {footer.heading ? (
          <h2 className="border-b border-black/40 pb-2.5 text-[15px] font-bold uppercase leading-5 tracking-normal sm:text-[16px]">
            {footer.heading}
          </h2>
        ) : null}

        <div className={`reveal-stagger mt-6 grid grid-cols-2 gap-x-6 gap-y-9 sm:mt-8 sm:grid-cols-3 ${desktopGrid}`}>
          {columns.map((column) => (
            <div key={column.title} data-reveal="up">
              <h3 className={columnTitle}>{column.title}</h3>
              <ul className={`mt-4 space-y-3.5 ${smallCaps}`}>
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {contactGroups.length > 0 ? (
            <div data-reveal="up" className="col-span-2 sm:col-span-1">
              <h3 className={columnTitle}>{footer.contactHeading}</h3>
              <div className="mt-4 space-y-3.5">
                {contactGroups.map((group, index) => (
                  <div key={`${group.heading}-${index}`}>
                    {group.heading ? <p className={smallCaps}>{group.heading}</p> : null}
                    {group.lines
                      .filter((line) => line.value.trim())
                      .map((line, lineIndex) => (
                        <ContactLineItem key={lineIndex} line={line} className="text-[12px] leading-4 sm:text-[13px]" />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div data-reveal="up" className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h3 className={smallCaps}>{footer.newsletterHeading}</h3>
            <form className="mt-5 max-w-[460px] lg:max-w-none" onSubmit={(event) => event.preventDefault()}>
              <label className="flex items-center gap-3 border-b border-black pb-1.5">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  placeholder={footer.newsletterPlaceholder}
                  className="h-8 min-w-0 flex-1 bg-transparent text-[13px] text-black outline-none placeholder:text-black/70 selection:bg-black selection:text-white"
                />
                <button type="submit" aria-label={footer.newsletterButton} className="shrink-0 cursor-pointer p-1 transition-transform hover:translate-x-0.5">
                  <ArrowRight className="size-4" strokeWidth={1.5} />
                </button>
              </label>
              <button
                type="submit"
                className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center bg-black px-8 text-[14px] uppercase tracking-normal text-white transition-opacity hover:opacity-85"
              >
                {footer.newsletterButton}
              </button>
            </form>
          </div>
        </div>

        <div
          className={`mt-10 flex flex-col gap-4 border-t border-black/40 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:mt-12 lg:grid lg:items-center ${desktopGrid} ${smallCaps}`}
        >
          {footer.legalLinks.length > 0 ? (
            // On desktop the first two links sit under the first two columns and
            // the rest share the third, so they line up with the columns above.
            <ul className="flex flex-wrap gap-x-10 gap-y-2 lg:contents">
              {footer.legalLinks.slice(0, 2).map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <FooterLink link={link} />
                </li>
              ))}
              {footer.legalLinks.length > 2 ? (
                <li className="flex flex-wrap gap-x-10 gap-y-2">
                  {footer.legalLinks.slice(2).map((link) => (
                    <FooterLink key={`${link.label}-${link.href}`} link={link} />
                  ))}
                </li>
              ) : null}
            </ul>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:col-start-4 lg:justify-self-end">
            {footer.followHeading ? <span>{footer.followHeading}</span> : null}
            {social.map((link) => (
              <FooterLink key={`${link.label}-${link.href}`} link={link} />
            ))}
          </div>
        </div>

        {footer.copyright ? <p className="mt-4 text-[11px] leading-4 text-black/50">{footer.copyright}</p> : null}
      </div>
    </footer>
  )
}
