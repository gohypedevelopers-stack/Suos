"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
    <div className="w-full max-w-[28rem] px-6 py-12 sm:px-10 lg:px-0 lg:py-16">
      <Image
        src="/logo.svg"
        alt="SUOS"
        width={450}
        height={208}
        priority
        className="mx-auto h-auto w-[min(100%,19rem)]"
      />

      <div className="mt-12">
        <h1 className="text-[1rem] font-normal uppercase leading-none">
          Create your account
        </h1>
        <p className="mt-3 max-w-sm text-[0.875rem] leading-[1.6] text-black">
          Save your favourites, follow your orders, and receive access to our latest edits.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="full-name" className="mb-2 block text-[0.875rem] font-medium uppercase leading-none">
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
            className="h-12 w-full border border-black bg-white px-4 text-[0.875rem] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-[0.875rem] font-medium uppercase leading-none">
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
            className="h-12 w-full border border-black bg-white px-4 text-[0.875rem] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-2 block text-[0.875rem] font-medium uppercase leading-none">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="8+ characters"
              onChange={() => setSubmission({ type: "idle" })}
              className="h-12 w-full border border-black bg-white px-4 text-[0.875rem] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-[0.875rem] font-medium uppercase leading-none">
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Repeat password"
              onChange={() => setSubmission({ type: "idle" })}
              className="h-12 w-full border border-black bg-white px-4 text-[0.875rem] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 pt-1 text-[0.875rem] leading-[1.45] text-black/70">
          <input required type="checkbox" className="mt-0.5 size-4 shrink-0 accent-black" />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-black">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-black">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <p
          aria-live="polite"
          className={`min-h-5 text-sm ${
            submission.type === "error"
              ? "text-red-700"
              : submission.type === "success"
                ? "text-emerald-700"
                : "text-transparent"
          }`}
        >
          {submission.type === "idle" ? "Form status" : submission.message}
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="flex h-14 w-full items-center justify-between bg-black px-5 text-[0.875rem] font-medium uppercase text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-black/60"
        >
          <span>{isPending ? "Creating account…" : "Create account"}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </form>

      <p className="mt-7 text-center text-[0.875rem] uppercase">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold underline underline-offset-4 hover:text-black/60">
          Log in
        </Link>
      </p>
    </div>
  )
}
