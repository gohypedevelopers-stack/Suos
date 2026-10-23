import Image from "next/image"

import { resolvePage } from "@/lib/page-content"
import { getSiteContent } from "@/lib/server/dal/site-content"

import { AuthFormPanel } from "@/components/auth/AuthFormPanel"
import { SignUpPanel } from "@/components/auth/SignUpPanel"

export const metadata = {
  title: "Create account | SUOS",
}

export default async function SignInPage() {
  const page = resolvePage("signupPage", (await getSiteContent()).signupPage)
  const showImage = page.show("image")

  return (
    <main
      className={`grid min-h-[calc(100svh-var(--header-stack-height))] bg-white lg:h-[calc(100svh-var(--header-stack-height))] lg:min-h-0 lg:overflow-hidden ${showImage ? "lg:grid-cols-2" : ""}`}
    >
      {showImage ? (
        <section className="relative hidden min-h-full overflow-hidden bg-[#b5aa9c] lg:block">
          <Image
            src={page.text("image", "src")}
            alt={page.text("image", "alt")}
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.14))]" />
        </section>
      ) : null}

      <AuthFormPanel>
        <SignUpPanel />
      </AuthFormPanel>
    </main>
  )
}
