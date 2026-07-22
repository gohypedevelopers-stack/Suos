import Image from "next/image"

import { LoginPanel } from "@/components/auth/LoginPanel"

export const metadata = {
  title: "Sign in | SUOS",
}

export default function SignInPage() {
  return (
    <main className="grid min-h-[calc(100dvh-var(--header-stack-height))] bg-white lg:grid-cols-2">
      <section className="relative hidden min-h-full overflow-hidden bg-[#b5aa9c] lg:block">
        <Image
          src="/images/hero-left.png"
          alt="Model wearing a denim jacket from the SUOS collection"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.14))]" />
      </section>

      <section className="flex min-h-full justify-center bg-white lg:justify-start lg:pl-[clamp(3.5rem,12vw,15rem)]">
        <LoginPanel />
      </section>
    </main>
  )
}
