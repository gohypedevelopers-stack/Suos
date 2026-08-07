"use client"

import Image from "next/image"
import Link from "next/link"
import { Info, QrCode } from "lucide-react"
import { type FormEvent, useState } from "react"

import { authClient } from "@/lib/auth-client"

export function LoginPanel() {
  const [mobileNumber, setMobileNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isPending, setIsPending] = useState(false)

  function handleMobileLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (mobileNumber.length !== 10) {
      setMessage("Enter a valid 10-digit mobile number.")
      return
    }

    setMessage("Mobile login requires OTP service configuration.")
  }

  async function handleGoogleLogin() {
    setMessage("")
    setIsPending(true)

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })

    if (result?.error) {
      setIsPending(false)
      setMessage("Google login is not configured yet.")
    }
  }

  return (
    <div className="w-full text-black">
      <div>
        <h1 className="font-heading text-[24px] font-normal uppercase leading-none tracking-normal">
          Log in
        </h1>
        <p className="mt-3 max-w-sm text-[13px] leading-[1.6] text-black">
          Access your favourites, follow your orders, and stay connected to the latest edits.
        </p>
      </div>

      <form className="mt-6" onSubmit={handleMobileLogin}>
        <fieldset disabled={isPending}>
          <legend className="text-[13px] font-normal uppercase leading-none">
            Log in or register
          </legend>

          <div className="mt-3 flex h-12 border border-black bg-white focus-within:ring-1 focus-within:ring-black">
            <div className="flex shrink-0 items-center gap-2 border-r border-black/20 px-3 text-[13px]">
              <Image
                src="/images/india-flag.svg"
                alt=""
                width={18}
                height={12}
                className="h-3 w-[18px] object-cover"
              />
              <span>+ 91</span>
            </div>

            <label htmlFor="mobile-number" className="sr-only">
              10-digit mobile number
            </label>
            <input
              id="mobile-number"
              name="mobileNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              value={mobileNumber}
              onChange={(event) => {
                setMobileNumber(event.target.value.replace(/\D/g, "").slice(0, 10))
                setMessage("")
              }}
              placeholder="10-digit mobile number"
              className="min-w-0 flex-1 bg-transparent px-3 text-[13px] outline-none placeholder:text-black/45"
            />

            <button
              type="submit"
              className="shrink-0 cursor-pointer bg-black px-5 text-[13px] font-normal uppercase text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Login
            </button>
          </div>

          <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              defaultChecked
              className="size-4 cursor-pointer accent-black"
            />
            <span>Notify me for updates and offers</span>
          </label>
        </fieldset>
      </form>

      <div className="mt-2 flex items-start gap-2 text-[12px] leading-[1.5] text-black/50">
        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 fill-black/20 stroke-white" />
        <p>
          By proceeding, you agree to our{" "}
          <Link href="/terms" className="font-medium underline underline-offset-2 hover:text-black">
            T&amp;C
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium underline underline-offset-2 hover:text-black">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <p aria-live="polite" className="mt-2 min-h-5 text-[12px] text-red-700">
        {message}
      </p>

      <section className="mt-5" aria-labelledby="access-heading">
        <h2 id="access-heading" className="text-[13px] font-normal uppercase leading-none">
          Access with
        </h2>
        <p className="mt-2 max-w-md text-[12px] leading-[1.5]">
          By logging in with my social login, I agree to link my account in accordance with the{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-black/60">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isPending}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 border border-black bg-white px-4 text-[13px] font-normal uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
          >
            <Image
              src="/images/google-icon.svg"
              alt=""
              width={18}
              height={18}
              className="size-[18px]"
            />
            <span>{isPending ? "Connecting…" : "Continue with Google"}</span>
          </button>

          <button
            type="button"
            onClick={() => setMessage("QR login is not configured yet.")}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 border border-black bg-white px-4 text-[13px] font-normal uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <QrCode aria-hidden="true" className="size-[18px] stroke-[1.6]" />
            <span>Continue with QR</span>
          </button>
        </div>
      </section>

      <p className="mt-5 text-center text-[13px] font-normal uppercase">
        New to SUOS?{" "}
        <Link href="/signin" className="font-[500] underline underline-offset-2 hover:text-black/60">
          Create account
        </Link>
      </p>
    </div>
  )
}
