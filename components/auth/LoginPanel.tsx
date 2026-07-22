"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Info, QrCode } from "lucide-react"
import { FormEvent, useState } from "react"

type LoginPanelProps = {
  onSuccess?: () => void
}

export function LoginPanel({ onSuccess }: LoginPanelProps) {
  const [phone, setPhone] = useState("")
  const [isOptedIn, setIsOptedIn] = useState(true)
  const [message, setMessage] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      setMessage("Enter a valid 10-digit mobile number to continue.")
      return
    }

    setMessage("We’ve sent a secure sign-in code to your mobile number.")
    onSuccess?.()
  }

  return (
    <div className="w-full max-w-[31.25rem] px-6 pb-14 pt-12 sm:px-10 lg:px-0 lg:pb-16 lg:pt-[clamp(3rem,7vh,6.7rem)]">
      <Image
        src="/logo.svg"
        alt="SUOS"
        width={510}
        height={236}
        priority
        className="h-auto w-[min(100%,25rem)]"
      />

      <form className="mt-14" onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend className="text-[0.875rem] font-medium uppercase tracking-[0.02em] text-black">
            Log in or register
          </legend>

          <div className="mt-5 flex h-[3.75rem] w-full border border-black bg-white">
            <button
              type="button"
              aria-label="Country code: India, plus 91"
              className="flex w-[5.75rem] shrink-0 items-center justify-center gap-2 border-r border-black text-[0.8125rem] transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black"
            >
              <Image
                src="/images/india-flag.svg"
                alt=""
                width={18}
                height={12}
                className="h-3 w-[1.125rem]"
              />
              <span>+91</span>
              <ChevronDown aria-hidden="true" className="size-3 stroke-[1.5]" />
            </button>

            <label htmlFor="mobile-number" className="sr-only">
              10-digit mobile number
            </label>
            <input
              id="mobile-number"
              name="mobile"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value.replace(/[^0-9\s]/g, ""))
                setMessage("")
              }}
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile number"
              maxLength={12}
              className="min-w-0 flex-1 px-4 text-[0.875rem] text-black placeholder:text-neutral-500 focus:outline-none"
            />

            <button
              type="submit"
              className="w-[6.5rem] shrink-0 bg-black px-3 text-[0.875rem] font-medium uppercase text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            >
              Login
            </button>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 text-[0.875rem] leading-none text-black">
            <input
              type="checkbox"
              checked={isOptedIn}
              onChange={(event) => setIsOptedIn(event.target.checked)}
              className="size-4 accent-[#2677e8]"
            />
            <span>Notify me for Updates and Offers</span>
          </label>

          <p className="mt-4 flex gap-3 text-[0.875rem] leading-[1.45] text-neutral-500">
            <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 fill-neutral-300 text-white" />
            <span>
              By proceeding, you are agreeing to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-black">
                T&amp;C
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-black">
                Privacy Policy.
              </Link>
            </span>
          </p>

          <p aria-live="polite" className="mt-3 min-h-5 text-[0.8125rem] text-neutral-700">
            {message}
          </p>
        </fieldset>
      </form>

      <section className="mt-8" aria-labelledby="social-login-heading">
        <h2 id="social-login-heading" className="text-[0.875rem] font-medium uppercase">
          Access with
        </h2>
        <p className="mt-2 max-w-[28rem] text-[0.875rem] leading-[1.6] text-black">
          By logging in with my social login, I agree to link my account in accordance with the{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-600">
            Privacy Policy
          </Link>
        </p>

        <div className="mt-5 grid gap-2">
          <button
            type="button"
            className="flex h-[3.5rem] w-full items-center justify-center gap-3 border border-black px-4 text-[1rem] font-medium uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <Image src="/images/google-icon.svg" alt="" width={20} height={20} className="size-5" />
            Continue with Google
          </button>
          <button
            type="button"
            className="flex h-[3.5rem] w-full items-center justify-center gap-3 border border-black px-4 text-[1rem] font-medium uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <QrCode aria-hidden="true" className="size-5 stroke-[1.6]" />
            Continue with QR
          </button>
        </div>
      </section>

      <p className="mt-6 text-center text-[0.875rem] uppercase">
        New to SUOS?{" "}
        <Link href="/signin" className="font-bold underline underline-offset-2 hover:text-neutral-600">
          Create account
        </Link>
      </p>
    </div>
  )
}
