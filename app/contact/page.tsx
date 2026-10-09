import { Mail, MessageCircle, Phone } from "lucide-react"

import { submitContactAction } from "@/app/actions/contact"
import { ContactSubjectSelect } from "@/components/storefront/contact-subject-select"
import { getSiteContent } from "@/lib/server/dal/site-content"

export const metadata = {
  title: "Contact Us | SUOS",
}

export const dynamic = "force-dynamic"

function ContactMethod({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <article className={`space-y-3 ${className ?? ""}`}>
      <div className="flex items-center gap-4 text-[18px] text-black/55">
        {icon}
        <h2 className="font-normal uppercase">{title}</h2>
      </div>
      <div className="pl-10 text-[18px] leading-[1.65] text-black">{children}</div>
    </article>
  )
}

const STATUS_MESSAGES: Record<string, string> = {
  sent: "Thank you. Your message has been received and we will reply within 24 hours.",
  invalid: "Please fill in your name, email, a subject and a message before sending.",
  error: "We couldn’t send your message right now. Please email us directly instead.",
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const [{ status }, { contact }] = await Promise.all([searchParams, getSiteContent()])
  const statusMessage = status ? STATUS_MESSAGES[status] : undefined

  return (
    <main className="bg-white text-black">
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-24 pt-28 sm:px-8 lg:px-20 lg:pb-32 lg:pt-[8.5rem]">
        <section aria-labelledby="contact-heading">
          <p className="text-[1rem] uppercase">{contact.eyebrow}</p>
          <h1
            id="contact-heading"
            className="mt-8 max-w-[32rem] text-6xl font-normal uppercase leading-[1.1] tracking-tight sm:text-[68px]"
          >
            {contact.titleLines.map((line, index) => (
              <span key={index}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-[31rem] text-[1rem] leading-[1.65] text-black/60">
            {contact.description}
          </p>
        </section>

        <div className="mt-20 border-t border-black/55 pt-14 lg:mt-20 lg:pt-16">
          <section aria-label="Contact methods" className="grid gap-10 md:grid-cols-3 md:gap-8">
            <ContactMethod
              icon={<Phone aria-hidden="true" className="size-5 stroke-[1.25]" />}
              title="Call us"
              className="md:justify-self-start"
            >
              <p>{contact.phone}</p>
              <p className="text-black/55">{contact.phoneHours}</p>
            </ContactMethod>
            <ContactMethod
              icon={<Mail aria-hidden="true" className="size-5 stroke-[1.25]" />}
              title="Email"
              className="md:justify-self-center"
            >
              <p>{contact.email}</p>
              <p className="text-black/55">{contact.emailResponse}</p>
            </ContactMethod>
            <ContactMethod
              icon={<MessageCircle aria-hidden="true" className="size-5 stroke-[1.25]" />}
              title="Live chat"
              className="md:justify-self-end"
            >
              <p>{contact.chatLabel}</p>
              <p className="text-black/55">{contact.chatHours}</p>
            </ContactMethod>
          </section>

          <div className="mt-24 grid gap-20 lg:mt-28 lg:grid-cols-2 lg:gap-28">
            <section aria-labelledby="message-heading">
              <h2
                id="message-heading"
                className="text-[18px] font-normal uppercase text-black/55"
              >
                Send a message
              </h2>

              <form action={submitContactAction} className="mt-20 space-y-14" noValidate>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <div className="grid gap-12 sm:grid-cols-2 sm:gap-6">
                  <label className="block border-b border-black/55 pb-3 text-sm text-black/55">
                    <span className="sr-only">Full name</span>
                    <input
                      name="name"
                      type="text"
                      placeholder="FULL NAME"
                      className="w-full bg-transparent uppercase outline-none placeholder:text-black/55"
                    />
                  </label>
                  <label className="block border-b border-black/55 pb-3 text-sm text-black/55">
                    <span className="sr-only">Email address</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="EMAIL ADDRESS"
                      className="w-full bg-transparent uppercase outline-none placeholder:text-black/55"
                    />
                  </label>
                </div>

                <ContactSubjectSelect />

                <label className="block border-b border-black/55 pb-3 text-sm text-black/55">
                  <span className="sr-only">Your message</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="YOUR MESSAGE"
                    className="w-full resize-none bg-transparent uppercase outline-none placeholder:text-black/55"
                  />
                </label>

                <button
                  type="submit"
                  className="flex h-[59px] w-full items-center justify-center bg-black text-sm uppercase text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  Send message
                </button>
                {statusMessage ? (
                  <p role="status" className="text-[13px] leading-[1.65] text-black/60">
                    {statusMessage}
                  </p>
                ) : null}
              </form>
            </section>

            <section aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="text-[18px] font-normal uppercase text-black/55"
              >
                Frequently asked
              </h2>

              <div className="mt-14 divide-y divide-black/55">
                {contact.faqs.map((faq) => (
                  <details key={faq.question} className="group py-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-7 text-[18px] leading-tight marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="text-[1.6rem] font-light leading-none transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-[35rem] pb-7 text-[1rem] leading-[1.65] text-black/60">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
