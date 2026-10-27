"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { usePageContent } from "@/lib/site-content-context"

export function SignUpPanel() {
  const page = usePageContent("signupPage")
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const fullName = String(formData.get("fullName") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (fullName.length < 2) {
      toast.error("Enter your full name.")
      return
    }

    if (password.length < 8) {
      toast.error("Use at least 8 characters for your password.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Your passwords do not match.")
      return
    }

    setIsPending(true)

    try {
      const result = await authClient.signUp.email({
        name: fullName,
        email,
        password,
      })

      if (result.error) {
        setIsPending(false)
        toast.error("We couldn’t create this account. Check your details or try logging in.")
        return
      }

      toast.success("Your account has been created.")
      router.replace("/")
      router.refresh()
    } catch {
      setIsPending(false)
      toast.error("We couldn’t create this account. Please try again.")
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

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="full-name" className="mb-2 block text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black">
            Full name
          </label>
          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="YOUR FULL NAME"
            className="auth-form-input h-12 w-full border border-black bg-white px-4 text-[16px] sm:text-[13px] font-normal uppercase tracking-[0.02em] text-black outline-none placeholder:text-black/40 focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="YOU@EXAMPLE.COM"
            className="auth-form-input h-12 w-full border border-black bg-white px-4 text-[16px] sm:text-[13px] font-normal uppercase tracking-[0.02em] text-black outline-none placeholder:text-black/40 focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-2 block text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="8+ CHARACTERS"
                onChange={(event) => {
                  setPasswordValue(event.target.value)
                }}
                className="auth-form-input h-12 w-full border border-black bg-white px-4 pr-12 text-[16px] sm:text-[13px] font-normal uppercase tracking-[0.02em] text-black outline-none placeholder:text-black/40 focus:ring-1 focus:ring-black"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                disabled={passwordValue.length === 0}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-1 top-1/2 inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center text-black/55 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:text-black/25"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="size-[18px] stroke-[1.7]" />
                ) : (
                  <Eye aria-hidden="true" className="size-[18px] stroke-[1.7]" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-[13px] font-normal uppercase leading-none tracking-[0.04em] text-black">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="REPEAT PASSWORD"
                onChange={(event) => setConfirmPasswordValue(event.target.value)}
                className="auth-form-input h-12 w-full border border-black bg-white px-4 pr-12 text-[16px] sm:text-[13px] font-normal uppercase tracking-[0.02em] text-black outline-none placeholder:text-black/40 focus:ring-1 focus:ring-black"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
                aria-pressed={showConfirmPassword}
                disabled={confirmPasswordValue.length === 0}
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                className="absolute right-1 top-1/2 inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center text-black/55 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:text-black/25"
              >
                {showConfirmPassword ? (
                  <EyeOff aria-hidden="true" className="size-[18px] stroke-[1.7]" />
                ) : (
                  <Eye aria-hidden="true" className="size-[18px] stroke-[1.7]" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 flex h-12 w-full items-center justify-center bg-black px-5 text-[13px] font-normal uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
        >
          <span>{isPending ? "Creating account…" : page.text("form", "button")}</span>
        </button>

        {page.show("terms") ? (
          <p className="mt-4 text-left text-[12px] uppercase leading-[1.5] tracking-normal text-black/60">
            {page.text("terms", "text")}{" "}
            <Link href="/terms" className="font-normal underline underline-offset-4 text-black hover:opacity-70 transition-opacity">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-normal underline underline-offset-4 text-black hover:opacity-70 transition-opacity">
              Privacy Policy
            </Link>
            . {page.text("terms", "after")}
          </p>
        ) : null}
      </form>

      {page.show("login") ? (
        <p className="mt-6 text-center text-[13px] font-normal uppercase tracking-[0.04em] text-black">
          <span className="text-black/60">{page.text("login", "text")}</span>{" "}
          <Link href="/login" className="font-normal underline underline-offset-4 text-black hover:opacity-70 transition-opacity">
            {page.text("login", "link")}
          </Link>
        </p>
      ) : null}
    </div>
  )
}
