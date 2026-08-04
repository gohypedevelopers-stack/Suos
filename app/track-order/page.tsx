import Link from "next/link"

export const metadata = {
  title: "Track Your Order | SUOS",
}

const inputClassName =
  "h-[59px] w-full border border-black bg-white px-5 text-[13px] font-normal text-black outline-none placeholder:text-black/60 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"

const actionClassName =
  "flex h-[59px] w-full items-center justify-center bg-black px-5 text-[13px] font-normal uppercase text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"

export default function TrackOrderPage() {
  return (
    <main className="flex min-h-[calc(100svh-var(--header-stack-height))] bg-white text-black">
      <div className="mx-auto grid w-full max-w-[1600px] px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-20 lg:py-[6.25rem]">
        <section className="lg:border-r lg:border-black/55 lg:pr-[6rem]">
          <h1 className="font-heading text-[24px] font-normal uppercase leading-none tracking-[-0.04em]">
            Track your order
          </h1>
          <p className="mt-5 text-[13px] font-normal text-black/60">
            Enter your details below to view your order status
          </p>

          <form className="mt-7 space-y-3" noValidate>
            <label className="sr-only" htmlFor="order-number">
              Order number
            </label>
            <input
              id="order-number"
              name="order-number"
              type="text"
              autoComplete="off"
              placeholder="Order Number (from order confirmation email)*"
              className={inputClassName}
            />

            <label className="sr-only" htmlFor="track-email">
              Email address
            </label>
            <input
              id="track-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email*"
              className={inputClassName}
            />

            <label className="sr-only" htmlFor="shipping-postcode">
              Shipping ZIP code
            </label>
            <input
              id="shipping-postcode"
              name="postcode"
              type="text"
              autoComplete="postal-code"
              placeholder="Shipping Zip Code*"
              className={inputClassName}
            />

            <button type="submit" className={`${actionClassName} mt-11`}>
              Check order status
            </button>
          </form>

          <Link
            href="/privacy"
            className="mt-7 inline-block text-[13px] font-normal text-black/60 underline underline-offset-2 transition-colors hover:text-black"
          >
            Privacy Policy
          </Link>
        </section>

        <section className="mt-16 lg:mt-0 lg:pl-[6rem]">
          <h2 className="font-heading text-[24px] font-normal uppercase leading-none tracking-[-0.04em]">
            Have an account
          </h2>
          <p className="mt-5 text-[13px] font-normal text-black/60">
            Sign in below to view your order history
          </p>

          <form className="mt-7 space-y-3" noValidate>
            <label className="sr-only" htmlFor="account-email">
              Email address
            </label>
            <input
              id="account-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email*"
              className={inputClassName}
            />

            <label className="sr-only" htmlFor="account-password">
              Password
            </label>
            <input
              id="account-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password*"
              className={inputClassName}
            />

            <div className="flex items-center justify-between gap-4 pt-2 text-[13px] font-normal text-black/60">
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="size-4 accent-black" />
                <span>Remember me</span>
              </label>
              <Link
                href="/login"
                className="underline underline-offset-2 transition-colors hover:text-black"
              >
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className={`${actionClassName} mt-9`}>
              Sign in
            </button>
            <p className="py-0.5 text-center text-[13px] font-normal uppercase text-black/60">Or</p>
            <button type="button" className={actionClassName}>
              Email me a verification code
            </button>
          </form>

          <p className="mx-auto mt-3 max-w-[31rem] text-center text-[13px] font-normal leading-[1.65] text-black/60">
            By submitting my information I agree to the SUOS{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-black">
              Terms
            </Link>
            ,{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-black">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-black">
              Terms and Conditions.
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
