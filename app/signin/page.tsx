import Image from "next/image"

import { AuthFormPanel } from "@/components/auth/AuthFormPanel"
import { SignUpPanel } from "@/components/auth/SignUpPanel"

export const metadata = {
  title: "Create account | SUOS",
}

export default function SignInPage() {
  return (
    <main className="grid min-h-[calc(100svh-var(--header-stack-height))] bg-white lg:h-[calc(100svh-var(--header-stack-height))] lg:min-h-0 lg:grid-cols-2 lg:overflow-hidden">
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

      <AuthFormPanel>
        <SignUpPanel />
      </AuthFormPanel>
    </main>
  )
}
