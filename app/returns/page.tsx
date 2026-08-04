import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

export const metadata = {
  title: "Returns & Exchanges | SUOS",
}

const conditions = [
  "No Returns/ Only Exchanges are acceptable for products purchased on sale",
  "Sizes in exchange are subject to availability. The difference in amount (if any) will be sent back as a redeemable gift card.",
  "Do not hand over the product to the pick-up executive without the pickup slip or SMS confirmation.",
  "Self-Ship if your PIN code is not in the serviceable area. (Docket slip required for free refund)",
]

export default function ReturnsPage() {
  return (
    <main className="min-h-[calc(100svh-var(--header-stack-height))] bg-white text-black">
      <div className="grid min-h-[calc(100svh-var(--header-stack-height))] lg:grid-cols-2">
        <section className="relative hidden min-h-full overflow-hidden bg-[#091019] lg:block">
          <Image
            src="/images/products/product1.png"
            alt="SUOS denim editorial"
            fill
            priority
            sizes="50vw"
            className="object-cover object-top"
          />
        </section>

        <section className="flex items-center justify-center px-6 py-14 sm:px-12 lg:px-20 xl:px-24">
          <div className="w-full max-w-[474px]">
            <h1 className="font-heading text-[24px] font-normal uppercase leading-none">
              Place a refund/ exchange request
            </h1>

            <form className="mt-5 space-y-2" noValidate>
              <label className="sr-only" htmlFor="return-order-number">
                Order number
              </label>
              <input
                id="return-order-number"
                name="order-number"
                type="text"
                placeholder="Order number"
                className="h-[42px] w-full border border-black px-4 text-[13px] outline-none placeholder:text-black/60 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              />
              <label className="sr-only" htmlFor="return-email">
                Email address
              </label>
              <input
                id="return-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                className="h-[42px] w-full border border-black px-4 text-[13px] outline-none placeholder:text-black/60 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              />
              <button
                type="submit"
                className="mt-3 flex h-[42px] w-full items-center justify-center bg-black text-[13px] font-normal uppercase text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Proceed
              </button>
            </form>

            <ul className="mt-10 space-y-4 text-[13px] font-normal leading-[1.45]">
              {conditions.map((condition) => (
                <li key={condition} className="flex items-start gap-4">
                  <span className="mt-0.5 inline-flex size-3 shrink-0 items-center justify-center border border-black">
                    <Check aria-hidden="true" className="size-2 stroke-[2]" />
                  </span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 space-y-2 text-[13px] text-black/60">
              <p>
                Our full{" "}
                <Link href="/returns-policy" className="underline underline-offset-2 hover:text-black">
                  Return &amp; Exchange Policy
                </Link>
              </p>
              <p>
                By proceeding, you accept our{" "}
                <Link href="/terms" className="underline underline-offset-2 hover:text-black">
                  Terms &amp; Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
