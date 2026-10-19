"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { useSiteContent } from "@/lib/site-content-context"
import { cn } from "@/lib/utils"

const companyLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Contact Us", href: "/contact" },
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
  { label: "Returns Policy", href: "/returns-policy" },
] as const

const headingClass =
  "text-[12px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black sm:text-[13px]"

const bodyClass =
  "text-[13px] font-normal uppercase leading-[1.6] tracking-[0.04em] text-black/80 sm:text-[14px]"

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
    <ul className="space-y-2">
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
    <div>
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
          <h2 className="font-heading text-[14px] font-normal uppercase leading-[1.4] tracking-[0.04em]">
            More About SUOS
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-12">
          <FooterGroup title="Company">
            <FooterLinkList links={companyLinks} />
          </FooterGroup>

          <div className="flex flex-col gap-10 lg:contents">
            <FooterGroup title="Quick Links">
              <FooterLinkList links={quickLinks} />
            </FooterGroup>

            <FooterGroup title="Contact">
              <div className="space-y-4">
                <div>
                  <p>For customer care</p>
                  <p className="break-all normal-case tracking-[0.01em] text-black">
                    {footer.careEmail}
                  </p>
                </div>

                <div>
                  <p>For online orders</p>
                  <p className="normal-case tracking-[0.01em] text-black">
                    {footer.ordersPhone}
                  </p>
                </div>

                <div>
                  <p>Timings</p>
                  <p className="normal-case tracking-[0.01em] text-black">
                    {footer.timings}
                  </p>
                </div>
              </div>
            </FooterGroup>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h3 className={headingClass}>Subscribe to our newsletter</h3>

            <div className="mt-4">
              <div className="flex items-center gap-3 border-b border-black/40 pb-2">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="Enter your email address"
                  className={cn(
                    "h-8 min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-[1.4] tracking-[0.01em] text-black outline-none placeholder:text-black/55",
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
                className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center bg-black text-[14px] font-normal uppercase leading-none tracking-[0.04em] text-white transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-black/20 pt-5 pb-1">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[11px] font-normal uppercase leading-[1.4] tracking-[0.04em] text-black/80 sm:text-[12px] lg:text-[13px]">
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
