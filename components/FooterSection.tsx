"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ContactLineItem } from "@/components/ContactLines"
import { useSiteContent } from "@/lib/site-content-context"
import { cn } from "@/lib/utils"

const companyLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Help", href: "/#help" },
  { label: "Chat With Us", href: "/#chat" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/returns-policy#returns-policy" },
  { label: "Terms of Service", href: "/terms" },
] as const

const quickLinks = [
  { label: "My Account", href: "/#account" },
  { label: "Returns/ Exchange", href: "/returns" },
  { label: "Order Tracking", href: "/track-order" },
] as const

const bottomLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Returns", href: "/returns-policy" },
] as const

const headingClass =
  "text-[18px] font-medium uppercase leading-[22px] tracking-normal text-black sm:text-h4"

const bodyClass =
  "text-[14px] font-normal uppercase leading-[18px] tracking-normal text-black sm:text-body"

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit shrink-0 transition-colors hover:text-black hover:underline hover:underline-offset-4"
    >
      {children}
    </Link>
  )
}

function FooterLinkList({
  links,
}: {
  links: ReadonlyArray<{ label: string; href: string }>
}) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <FooterLink href={link.href}>{link.label}</FooterLink>
        </li>
      ))}
    </ul>
  )
}

function FooterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div data-reveal="up">
      <h3 className={headingClass}>{title}</h3>
      <div className={cn("mt-4", bodyClass)}>{children}</div>
    </div>
  )
}

export function FooterSection() {
  const { footer } = useSiteContent()
  return (
    <footer className="w-full bg-white text-black">
      <div className="px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="border-b border-black/20 pb-3">
          <h2 className="font-heading text-[18px] font-medium uppercase leading-[22px] tracking-normal sm:text-h4">
            More About SUOS
          </h2>
        </div>

        <div className="reveal-stagger grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-12">
          <FooterGroup title="Company">
            <FooterLinkList links={companyLinks} />
          </FooterGroup>

          <div className="flex flex-col gap-10 lg:contents">
            <FooterGroup title="Quick Links">
              <FooterLinkList links={quickLinks} />
            </FooterGroup>

            <FooterGroup title="Contact">
              <div className="space-y-4">
                {footer.contactGroups.map((group, index) => (
                  <div key={`${group.heading}-${index}`}>
                    <p>{group.heading}</p>
                    {group.lines.map((line, lineIndex) => (
                      <ContactLineItem
                        key={lineIndex}
                        line={line}
                        className="normal-case tracking-normal text-black"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </FooterGroup>
          </div>

          <div data-reveal="up" className="col-span-2 lg:col-span-1">
            <h3 className="text-[14px] font-normal uppercase leading-[18px] tracking-normal text-black sm:text-body">Subscribe to our newsletter</h3>

            <div className="mt-4">
              <div className="flex items-center gap-3 border-b border-black/40 pb-2">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="Enter your email address"
                  className={cn(
                    "h-8 min-w-0 flex-1 bg-transparent text-body font-normal tracking-normal text-black outline-none placeholder:text-black/55",
                    "selection:bg-black selection:text-white"
                  )}
                />
                <button
                  type="button"
                  aria-label="Submit newsletter email"
                  className="inline-flex size-8 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-65"
                >
                  <ArrowRight className="size-[18px] stroke-[1.5]" />
                </button>
              </div>

              <button
                type="button"
                className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center bg-black text-body-lg font-normal uppercase tracking-[0.01em] text-[#d9d9d9] transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-black/20 pt-5 pb-1">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[12px] font-normal uppercase leading-none tracking-normal text-black sm:text-caption">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {bottomLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
            <div className="shrink-0">Follow Us</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
