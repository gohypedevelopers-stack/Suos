import Image from "next/image"
import Link from "next/link"
import { Info, QrCode } from "lucide-react"

export const metadata = {
  title: "Login | SUOS",
}

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100svh-var(--header-stack-height))] bg-white text-black">
      <div className="grid min-h-[calc(100svh-var(--header-stack-height))] lg:grid-cols-2">
        <section className="relative hidden min-h-full overflow-hidden bg-[#101820] lg:block">
          <div className="absolute inset-x-0 top-0 -bottom-2">
            <Image
              src="/images/products/product1.png"
              alt="SUOS editorial"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 69vh"
              className="object-cover object-top grayscale-[12%]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,24,0.42)_0%,rgba(5,25,38,0.14)_42%,rgba(200,224,232,0.12)_100%)]" />
        </section>

        <section className="flex min-h-full items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[474px]">
            <div className="mb-12 text-center lg:mb-[4.35rem]">
              <Image
                src="/logo.svg"
                alt="SUOS"
                width={474}
                height={220}
                priority
                className="mx-auto h-auto w-[min(100%,24rem)]"
              />
            </div>

            <form className="space-y-5" noValidate>
              <fieldset>
                <legend className="mb-5 text-[1rem] font-normal uppercase leading-none">
                  Log in or register
                </legend>

                <label className="sr-only" htmlFor="mobile-number">
                  10-digit mobile number
                </label>
                <div className="flex h-[59px] border border-black">
                  <div className="flex shrink-0 items-center gap-2 border-r border-black px-3 text-[0.9rem] sm:px-4">
                    <Image
                      src="/images/india-flag.svg"
                      alt=""
                      width={20}
                      height={14}
                      className="h-auto w-5 border border-black/15"
                    />
                    <span>+ 91</span>
                  </div>
                  <input
                    id="mobile-number"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="10-digit mobile number"
                    className="min-w-0 flex-1 border-0 px-3 text-[0.95rem] text-black placeholder:text-black/55 focus:outline-none sm:px-4"
                  />
                  <button
                    type="submit"
                    className="w-[102px] shrink-0 bg-black text-[1rem] uppercase text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    Login
                  </button>
                </div>
              </fieldset>

              <div className="space-y-2 text-[16px] leading-[1.6]">
                <label className="flex w-fit cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-4 accent-[#1677ff]"
                  />
                  <span>Notify me for Updates and Offers</span>
                </label>
                <p className="flex items-start gap-3 text-black/55">
                  <Info aria-hidden="true" className="mt-1 size-4 shrink-0 fill-black/20 text-white" />
                  <span>
                    By proceeding, you are agreeing to our{" "}
                    <Link href="/terms" className="font-medium underline underline-offset-2 hover:text-black">
                      T&amp;C
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-medium underline underline-offset-2 hover:text-black">
                      Privacy Policy.
                    </Link>
                  </span>
                </p>
              </div>

              <div className="pt-5">
                <h2 className="text-[16px] font-normal uppercase leading-none">Access with</h2>
                <p className="mt-2 text-[16px] leading-[1.65]">
                  By logging in with my social login, I agree to link my account in
                  accordance with the{" "}
                  <Link href="/privacy" className="underline underline-offset-2">
                    Privacy Policy
                  </Link>
                </p>

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center gap-3 border border-black text-[18px] uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    <Image
                      src="/images/google-icon.svg"
                      alt=""
                      width={22}
                      height={22}
                      className="size-[22px]"
                    />
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center gap-3 border border-black text-[18px] uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    <QrCode aria-hidden="true" className="size-5" />
                    Continue with QR
                  </button>
                </div>
              </div>
            </form>

            <p className="mt-5 text-center text-[16px] uppercase">
              New to SUOS?{" "}
              <Link href="/account/create" className="font-bold underline underline-offset-2">
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
