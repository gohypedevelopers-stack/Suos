import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const companyLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Help", href: "/#help" },
  { label: "Chat With Us", href: "/#chat" },
  { label: "Privacy Policy", href: "/#privacy" },
  { label: "Refund Policy", href: "/#refund" },
  { label: "Terms of Service", href: "/#terms" },
] as const

const quickLinks = [
  { label: "My Account", href: "/#account" },
  { label: "Returns/ Exchange", href: "/returns" },
  { label: "Order Tracking", href: "/track-order" },
] as const

const bottomLinks = [
  { label: "Privacy Policy", href: "/#privacy" },
  { label: "Terms of Use", href: "/#terms" },
  { label: "Returns", href: "/returns" },
] as const

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
      className="inline-flex w-fit transition-opacity hover:opacity-65"
    >
      {children}
    </Link>
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
      <h3 className="text-[15px] font-[500] uppercase tracking-[0.01em]">
        {title}
      </h3>
      <div className="mt-5 text-[13px] font-normal uppercase tracking-[0.02em] text-black/90">
        {children}
      </div>
    </div>
  )
}

export function FooterSection() {
  return (
    <footer className="w-full bg-white text-black">
      <div className="px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="border-b border-black/55 pb-2">
          <h2 className="font-heading text-[1.15rem] font-semibold uppercase tracking-[-0.02em] sm:text-[1.3rem]">
            More About SUOS
          </h2>
        </div>

        <div className="grid gap-10 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <FooterGroup title="Company">
            <div className="space-y-4">
              {companyLinks.map((link) => (
                <div key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </div>
              ))}
            </div>
          </FooterGroup>

          <FooterGroup title="Quick Links">
            <div className="space-y-4">
              {quickLinks.map((link) => (
                <div key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </div>
              ))}
            </div>
          </FooterGroup>

          <div>
            <h3 className="text-[15px] font-[500] uppercase tracking-[0.01em]">
              Contact
            </h3>

            <div className="mt-5 space-y-5 text-[13px] font-normal uppercase tracking-[0.02em] text-black/90">
              <div className="space-y-0.5">
                <p className="font-normal">For customer care</p>
                <p className="normal-case tracking-[-0.01em]">
                  customercare@suos.in
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="font-normal">For online orders</p>
                <p className="normal-case tracking-[-0.01em]">+91 000000000</p>
              </div>

              <div className="space-y-0.5">
                <p className="font-normal">Timings</p>
                <p className="normal-case tracking-[-0.01em]">
                  Mon-Sat : 9AM - 8PM
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-normal uppercase tracking-[0.01em]">
              Subscribe to our newsletter
            </h3>

            <div className="mt-6">
              <div className="flex items-center gap-3 border-b border-black/55 pb-2">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="Enter your email address"
                  className={cn(
                    "min-w-0 flex-1 bg-transparent text-[13px] font-normal text-black outline-none placeholder:text-black/75",
                    "selection:bg-black selection:text-white"
                  )}
                />
                <button
                  type="button"
                  aria-label="Submit newsletter email"
                  className="inline-flex size-8 items-center justify-center text-black transition-opacity hover:opacity-65"
                >
                  <ArrowRight className="size-5 stroke-[1.8]" />
                </button>
              </div>

              <button
                type="button"
                className="mt-5 flex h-14 w-full items-center justify-center bg-black text-[15px] font-normal uppercase tracking-normal text-white transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-black/55 py-4">
          <div className="grid gap-3 text-[13px] font-normal uppercase tracking-[0.04em] sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {bottomLinks.map((link) => (
              <FooterLink key={link.label} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
            <div className="lg:justify-self-end">Follow Us</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
