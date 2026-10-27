import type { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"

import { resolvePage } from "@/lib/page-content"
import { isStaffRole } from "@/lib/roles"
import { getCurrentUser } from "@/lib/server/dal/auth"
import { getSiteContent } from "@/lib/server/dal/site-content"

import { AuthFormPanel } from "@/components/auth/AuthFormPanel"
import { LoginPanel } from "@/components/auth/LoginPanel"

export const metadata: Metadata = {
  title: "Login | SUOS",
}

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) {
    if (isStaffRole(user.role)) {
      redirect("/dashboard")
    }
    redirect("/account")
  }

  const page = resolvePage("loginPage", (await getSiteContent()).loginPage)
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
        <LoginPanel />
      </AuthFormPanel>
    </main>
  )
}
