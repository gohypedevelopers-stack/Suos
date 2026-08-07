"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, Eye, EyeOff, Info, QrCode } from "lucide-react"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"

export function LoginPanel() {
  const [mobileNumber, setMobileNumber] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleMobileLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (mobileNumber.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number.")
      return
    }

    toast.info("Mobile login requires OTP service configuration.")
  }

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const password = String(formData.get("password") ?? "")

    setIsPending(true)

    try {
      const result = await authClient.signIn.email({ email, password })

      if (result.error) {
        setIsPending(false)
        toast.error("The email address or password is incorrect.")
        return
      }

      const destination = result.data?.user.role === "ADMIN" ? "/dashboard" : "/"
      window.location.replace(destination)
    } catch {
      setIsPending(false)
      toast.error("We couldn’t sign you in. Please try again.")
    }
  }

  async function handleGoogleLogin() {
    setIsPending(true)

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (result?.error) {
        setIsPending(false)
        toast.error("Google login is not configured yet.")
      }
    } catch {
      setIsPending(false)
      toast.error("We couldn’t connect to Google login. Please try again.")
    }
  }

  return (
    <div className="w-full text-black">
      <div>
        <h1 className="font-heading text-[24px] font-normal uppercase leading-none tracking-normal">
          Log in
        </h1>
        <p className="mt-3 max-w-sm text-justify text-[12px] uppercase leading-[1.6] tracking-normal text-black">
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
              }}
              placeholder="10-DIGIT MOBILE NUMBER"
              className="auth-form-input min-w-0 flex-1 bg-transparent px-3 text-[13px] uppercase outline-none placeholder:text-black/45"
            />

            <button
              type="submit"
              className="shrink-0 cursor-pointer bg-black px-5 text-[13px] font-normal uppercase text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Login
            </button>
          </div>

          <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-[12px] uppercase">
            <input
              type="checkbox"
              defaultChecked
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="flex size-4 shrink-0 items-center justify-center border border-black bg-white text-transparent transition-colors peer-checked:bg-black peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-black/30"
            >
              <Check className="size-3 stroke-[3]" />
            </span>
            <span>Notify me for updates and offers</span>
          </label>
        </fieldset>
      </form>

      <div className="my-5 flex items-center gap-3 text-[12px] uppercase text-black/50">
        <span aria-hidden="true" className="h-px flex-1 bg-black/15" />
        <span>OR</span>
        <span aria-hidden="true" className="h-px flex-1 bg-black/15" />
      </div>

      <form onSubmit={handleEmailLogin}>
        <fieldset disabled={isPending}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[13px] font-normal uppercase leading-none">
                Email address
              </span>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="YOU@EXAMPLE.COM"
                className="auth-form-input h-12 w-full border border-black bg-white px-4 text-[13px] outline-none placeholder:text-black/40 focus:ring-1 focus:ring-black"
              />
            </label>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-[13px] font-normal uppercase leading-none">
                Password
              </label>
              <span className="relative block">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="current-password"
                  placeholder="8+ CHARACTERS"
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  className="auth-form-input h-12 w-full border border-black bg-white px-4 pr-11 text-[13px] outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  disabled={password.length === 0}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 inline-flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center text-black/55 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:text-black/25"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="size-[18px] stroke-[1.7]" />
                  ) : (
                    <Eye aria-hidden="true" className="size-[18px] stroke-[1.7]" />
                  )}
                </button>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-3 h-12 w-full cursor-pointer bg-black px-5 text-[13px] font-normal uppercase text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-black/60"
          >
            {isPending ? "Logging in…" : "Login with email"}
          </button>
        </fieldset>
      </form>

      <div className="mt-3 flex items-start gap-2 text-justify text-[12px] uppercase leading-[1.5] tracking-normal text-black/50">
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

      <section className="mt-5" aria-labelledby="access-heading">
        <h2 id="access-heading" className="text-[13px] font-normal uppercase leading-none">
          Access with
        </h2>
        <p className="mt-2 max-w-md text-justify text-[12px] uppercase leading-[1.5] tracking-normal">
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
            onClick={() => toast.info("QR login is not configured yet.")}
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
