"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { type FormEvent, useState } from "react"

import { authClient } from "@/lib/auth-client"

type SubmissionState =
  | { type: "idle" }
  | { type: "error"; message: string }
  | { type: "success"; message: string }

export function SignUpPanel() {
  const router = useRouter()
  const [submission, setSubmission] = useState<SubmissionState>({ type: "idle" })
  const [isPending, setIsPending] = useState(false)
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
      setSubmission({ type: "error", message: "Enter your full name." })
      return
    }

    if (password.length < 8) {
      setSubmission({ type: "error", message: "Use at least 8 characters for your password." })
      return
    }

    if (password !== confirmPassword) {
      setSubmission({ type: "error", message: "Your passwords do not match." })
      return
    }

    setIsPending(true)
    setSubmission({ type: "idle" })

    const result = await authClient.signUp.email({
      name: fullName,
      email,
      password,
    })

    if (result.error) {
      setIsPending(false)
      setSubmission({
        type: "error",
        message: "We couldn’t create this account. Check your details or try logging in.",
      })
      return
    }

    setSubmission({ type: "success", message: "Your account has been created." })
    router.replace("/")
    router.refresh()
  }

  return (
    <div className="w-full">
      <div>
        <h1 className="font-heading text-[24px] font-normal uppercase leading-none tracking-normal">
          Create your account
        </h1>
        <p className="mt-3 max-w-sm text-[13px] leading-[1.6] text-black">
          Save your favourites, follow your orders, and receive access to our latest edits.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="full-name" className="mb-2 block text-[13px] font-normal uppercase leading-none">
            Full name
          </label>
          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="Your full name"
            onChange={() => setSubmission({ type: "idle" })}
            className="h-12 w-full border border-black bg-white px-4 text-[13px] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-[13px] font-normal uppercase leading-none">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            onChange={() => setSubmission({ type: "idle" })}
            className="h-12 w-full border border-black bg-white px-4 text-[13px] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-2 block text-[13px] font-normal uppercase leading-none">
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
                placeholder="8+ characters"
                onChange={() => setSubmission({ type: "idle" })}
                className="h-12 w-full border border-black bg-white px-4 pr-11 text-[13px] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 inline-flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center text-black/55 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
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
            <label htmlFor="confirm-password" className="mb-2 block text-[13px] font-normal uppercase leading-none">
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
                placeholder="Repeat password"
                onChange={() => setSubmission({ type: "idle" })}
                className="h-12 w-full border border-black bg-white px-4 pr-11 text-[13px] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 inline-flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center text-black/55 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
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

        {submission.type !== "idle" ? (
          <p
            aria-live="polite"
            className={`text-[13px] ${
              submission.type === "error" ? "text-red-700" : "text-emerald-700"
            }`}
          >
            {submission.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="flex h-14 w-full items-center justify-center bg-black px-5 text-[13px] font-normal uppercase text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-black/60"
        >
          <span>{isPending ? "Creating account…" : "Create account"}</span>
        </button>

        <p className="text-[12px] leading-[1.5] text-black/60">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="font-medium underline underline-offset-2 hover:text-black">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium underline underline-offset-2 hover:text-black">
            Privacy Policy
          </Link>
          . You also consent to receive marketing and promotional communications from SUOS. You may unsubscribe at any time.
        </p>
      </form>

      <p className="mt-5 text-center text-[13px] font-normal uppercase">
        Already have an account?{" "}
        <Link href="/login" className="font-[500] underline underline-offset-4 hover:text-black/60">
          Log in
        </Link>
      </p>
    </div>
  )
}
