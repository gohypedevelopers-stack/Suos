"use client"

import Link from "next/link"
import { type FormEvent, useState } from "react"

import { authClient } from "@/lib/auth-client"

export function EmailLoginForm() {
  const [message, setMessage] = useState("")
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const password = String(formData.get("password") ?? "")

    setMessage("")
    setIsPending(true)

    const result = await authClient.signIn.email({
      email,
      password,
    })

    if (result.error) {
      setIsPending(false)
      setMessage("The email address or password is incorrect.")
      return
    }

    const destination = result.data?.user.role === "ADMIN" ? "/dashboard" : "/"
    window.location.replace(destination)
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <fieldset disabled={isPending} className="space-y-5">
          <legend className="mb-5 font-heading text-[24px] font-normal uppercase leading-none">
            Log in
          </legend>

          <label className="block">
            <span className="mb-2 block text-[13px] font-normal uppercase">
              Email address
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              onChange={() => setMessage("")}
              className="h-[59px] w-full border border-black px-4 text-[13px] outline-none placeholder:text-black/45 focus:ring-1 focus:ring-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] font-normal uppercase">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="current-password"
              onChange={() => setMessage("")}
              className="h-[59px] w-full border border-black px-4 text-[13px] outline-none focus:ring-1 focus:ring-black"
            />
          </label>

          <p
            aria-live="polite"
            className="min-h-5 text-[13px] text-red-700"
          >
            {message}
          </p>

          <button
            type="submit"
            className="h-14 w-full bg-black text-[13px] font-normal uppercase text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-black/60"
          >
            {isPending ? "Logging in…" : "Login"}
          </button>
        </fieldset>
      </form>

      <p className="mt-5 text-center text-[13px] font-normal uppercase">
        New to SUOS?{" "}
        <Link href="/signin" className="font-[500] underline underline-offset-2">
          Create account
        </Link>
      </p>
    </>
  )
}
