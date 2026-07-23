import { Mail, MessageCircle, Phone } from "lucide-react"

export const metadata = {
  title: "Contact Us | SUOS",
}

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Orders are typically dispatched within 1–2 business days. Delivery timelines are shown at checkout and vary by destination.",
  },
  {
    question: "What is the return policy?",
    answer:
      "Unworn items with original tags can be returned within 14 days of delivery. Please refer to our returns policy for full details.",
  },
  {
    question: "Do you offer alterations?",
    answer:
      "We do not currently offer alterations. Our client services team can help you select the right fit before you place an order.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order has shipped, we will email your tracking link. You can also find the latest status in your order confirmation.",
  },
]

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
      <div className="flex items-center gap-4 text-[22px] text-black/55">
        {icon}
        <h2 className="font-normal uppercase">{title}</h2>
      </div>
      <div className="pl-10 text-[22px] leading-[1.65] text-black">{children}</div>
    </article>
  )
}

export default function ContactPage() {
  return (
    <main className="bg-white text-black">
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-24 pt-28 sm:px-8 lg:px-20 lg:pb-32 lg:pt-[8.5rem]">
        <section aria-labelledby="contact-heading">
          <p className="text-[1rem] uppercase">Contact us</p>
          <h1
            id="contact-heading"
            className="mt-8 max-w-[32rem] text-[70px] font-normal uppercase leading-[1.02] tracking-[-0.055em]"
          >
            Let’s
            <br />
            connect.
          </h1>
          <p className="mt-5 max-w-[31rem] text-[1rem] leading-[1.65] text-black/60">
            Our client services team is available to assist you with orders,
            styling advice, and any questions about the collection.
          </p>
        </section>

        <div className="mt-20 border-t border-black/55 pt-14 lg:mt-20 lg:pt-16">
          <section aria-label="Contact methods" className="grid gap-10 md:grid-cols-3 md:gap-8">
            <ContactMethod
              icon={<Phone aria-hidden="true" className="size-5 stroke-[1.25]" />}
              title="Call us"
              className="md:justify-self-start"
            >
              <p>+ 91 1800 123 4567</p>
              <p className="text-black/55">Mon - Fri, 9 AM - 9 PM IST</p>
            </ContactMethod>
            <ContactMethod
              icon={<Mail aria-hidden="true" className="size-5 stroke-[1.25]" />}
              title="Email"
              className="md:justify-self-center"
            >
              <p>info@suos.in</p>
              <p className="text-black/55">Response within 24 hours</p>
            </ContactMethod>
            <ContactMethod
              icon={<MessageCircle aria-hidden="true" className="size-5 stroke-[1.25]" />}
              title="Live chat"
              className="md:justify-self-end"
            >
              <p>Available on site</p>
              <p className="text-black/55">Mon - Fri, 10 AM - 7 PM IST</p>
            </ContactMethod>
          </section>

          <div className="mt-24 grid gap-20 lg:mt-28 lg:grid-cols-2 lg:gap-28">
            <section aria-labelledby="message-heading">
              <h2
                id="message-heading"
                className="text-[22px] font-normal uppercase text-black/55"
              >
                Send a message
              </h2>

              <form className="mt-20 space-y-14" noValidate>
                <div className="grid gap-12 sm:grid-cols-2 sm:gap-6">
                  <label className="block border-b border-black/55 pb-3 text-[22px] text-black/55">
                    <span className="sr-only">Full name</span>
                    <input
                      name="name"
                      type="text"
                      placeholder="FULL NAME"
                      className="w-full bg-transparent uppercase outline-none placeholder:text-black/55"
                    />
                  </label>
                  <label className="block border-b border-black/55 pb-3 text-[22px] text-black/55">
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

                <label className="block border-b border-black/55 pb-3 text-[22px] text-black/55">
                  <span className="sr-only">Select subject</span>
                  <select
                    name="subject"
                    defaultValue=""
                    className="w-full appearance-none bg-transparent uppercase outline-none"
                  >
                    <option value="" disabled>
                      SELECT SUBJECT
                    </option>
                    <option value="order">Order enquiry</option>
                    <option value="styling">Styling advice</option>
                    <option value="returns">Returns and exchanges</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="block border-b border-black/55 pb-3 text-[22px] text-black/55">
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
                  className="flex h-[59px] w-full items-center justify-center bg-black text-[18px] uppercase text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  Send message
                </button>
              </form>
            </section>

            <section aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="text-[22px] font-normal uppercase text-black/55"
              >
                Frequently asked
              </h2>

              <div className="mt-14 divide-y divide-black/55">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-7 text-[22px] leading-tight marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30">
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
