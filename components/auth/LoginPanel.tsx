"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, Eye, EyeOff, Info, QrCode } from "lucide-react"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { usePageContent } from "@/lib/site-content-context"

export function LoginPanel() {
  const page = usePageContent("loginPage")
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
        toast.error(result.error.message || "The email address or password is incorrect.")
        return
      }

      const role = result.data?.user.role
      const destination = role === "ADMIN" || role === "SUB_ADMIN" ? "/dashboard" : "/"
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
        <h1 className="font-heading text-[22px] font-normal uppercase leading-tight tracking-[0.02em] text-black sm:text-[24px]">
          {page.text("intro", "heading")}
        </h1>
        <p className="mt-3 max-w-sm text-left text-[12px] uppercase leading-[1.6] tracking-normal text-black/70">
          {page.text("intro", "text")}
        </p>
      </div>

      {page.show("mobile") ? (
        <form className="mt-6" onSubmit={handleMobileLogin}>
          <fieldset disabled={isPending}>
            <legend className="text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black">
              {page.text("mobile", "legend")}
            </legend>

            <div className="mt-3 flex h-12 w-full border border-black bg-white focus-within:ring-1 focus-within:ring-black">
              <div className="flex shrink-0 items-center gap-1.5 border-r border-black/20 px-2.5 sm:px-3 text-[12px] sm:text-[13px]">
                <Image
                  src="/images/india-flag.svg"
                  alt="India"
                  width={18}
                  height={12}
                  className="h-3 w-[18px] object-cover"
                />
                <span className="font-normal text-black">+91</span>
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
                placeholder="MOBILE NUMBER"
                className="auth-form-input min-w-0 flex-1 bg-transparent px-2.5 sm:px-3 text-[16px] sm:text-[13px] uppercase tracking-[0.02em] text-black outline-none placeholder:text-black/40"
              />

              <button
                type="submit"
                className="shrink-0 cursor-pointer bg-black px-4 sm:px-5 text-[12px] sm:text-[13px] font-normal uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                {page.text("mobile", "button")}
              </button>
            </div>

            <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 py-1 text-[12px] uppercase tracking-normal text-black/80">
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
              <span className="select-none">{page.text("mobile", "newsletter")}</span>
            </label>
          </fieldset>
        </form>
      ) : null}

      {page.show("mobile") && page.show("email") ? (
        <div className="my-6 flex items-center gap-3 text-[12px] font-normal uppercase tracking-[0.04em] text-black/45">
          <span aria-hidden="true" className="h-px flex-1 bg-black/15" />
          <span>OR</span>
          <span aria-hidden="true" className="h-px flex-1 bg-black/15" />
        </div>
      ) : null}

      {page.show("email") ? (
        <form onSubmit={handleEmailLogin} className={page.show("mobile") ? undefined : "mt-6"}>
          <fieldset disabled={isPending}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black">
                  Email address
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="YOU@EXAMPLE.COM"
                  className="auth-form-input h-12 w-full border border-black bg-white px-4 text-[16px] sm:text-[13px] font-normal uppercase tracking-[0.02em] text-black outline-none placeholder:text-black/40 focus:ring-1 focus:ring-black"
                />
              </label>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black"
                >
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
                    className="auth-form-input h-12 w-full border border-black bg-white px-4 pr-12 text-[16px] sm:text-[13px] font-normal uppercase tracking-[0.02em] text-black outline-none placeholder:text-black/40 focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    disabled={password.length === 0}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-1 top-1/2 inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center text-black/55 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:text-black/25"
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
              className="mt-4 h-12 w-full cursor-pointer bg-black px-5 text-[13px] font-normal uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
            >
              {isPending ? "Logging in…" : page.text("email", "button")}
            </button>
          </fieldset>
        </form>
      ) : null}

      {page.show("terms") ? (
        <div className="mt-4 flex items-start gap-2 text-left text-[12px] uppercase leading-[1.5] tracking-normal text-black/60">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 fill-black/20 stroke-white" />
          <p>
            {page.text("terms", "text")}{" "}
            <Link href="/terms" className="font-normal underline underline-offset-4 text-black hover:opacity-70 transition-opacity">
              T&amp;C
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-normal underline underline-offset-4 text-black hover:opacity-70 transition-opacity">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      ) : null}

      {page.show("social") || page.show("qr") ? (
        <section className="mt-6" aria-labelledby="access-heading">
          {page.show("social") ? (
            <>
              <h2 id="access-heading" className="text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black">
                {page.text("social", "heading")}
              </h2>
              <p className="mt-2 max-w-md text-left text-[12px] uppercase leading-[1.5] tracking-normal text-black/60">
                {page.text("social", "text")}{" "}
                <Link href="/privacy" className="font-normal underline underline-offset-4 text-black hover:opacity-70 transition-opacity">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          ) : null}

          <div className="mt-4 space-y-2.5">
            {page.show("social") ? (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isPending}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 border border-black bg-white px-4 text-[13px] font-normal uppercase tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
              >
                <Image
                  src="/images/google-icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="size-[18px]"
                />
                <span>{isPending ? "Connecting…" : page.text("social", "google")}</span>
              </button>
            ) : null}

            {page.show("qr") ? (
              <button
                type="button"
                onClick={() => toast.info("QR login is not configured yet.")}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 border border-black bg-white px-4 text-[13px] font-normal uppercase tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <QrCode aria-hidden="true" className="size-[18px] stroke-[1.6]" />
                <span>{page.text("qr", "button")}</span>
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {page.show("signup") ? (
        <p className="mt-6 text-center text-[13px] font-normal uppercase tracking-[0.04em] text-black">
          <span className="text-black/60">{page.text("signup", "text")}</span>{" "}
          <Link href="/signin" className="font-normal underline underline-offset-4 text-black hover:opacity-70 transition-opacity">
            {page.text("signup", "link")}
          </Link>
        </p>
      ) : null}
    </div>
  )
}
