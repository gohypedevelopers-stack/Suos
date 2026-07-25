import type { Metadata } from "next"
import Image from "next/image"

import { EmailLoginForm } from "@/components/auth/EmailLoginForm"

export const metadata: Metadata = {
  title: "Login | SUOS",
}

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100svh-var(--header-stack-height))] bg-white text-black">
      <div className="grid min-h-[calc(100svh-var(--header-stack-height))] lg:grid-cols-2">
        <section className="relative hidden min-h-full overflow-hidden bg-[#101820] lg:block">
          <div className="absolute inset-x-0 top-0 -bottom-2">
            <Image
              src="/images/products/product1.png"
              alt="SUOS editorial"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 69vh"
              className="object-cover object-top grayscale-[12%]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,24,0.42)_0%,rgba(5,25,38,0.14)_42%,rgba(200,224,232,0.12)_100%)]" />
        </section>

        <section className="flex min-h-full items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[474px]">
            <div className="mb-12 text-center lg:mb-[4.35rem]">
              <Image
                src="/logo.svg"
                alt="SUOS"
                width={474}
                height={220}
                priority
                className="mx-auto h-auto w-[min(100%,24rem)]"
              />
            </div>

            <EmailLoginForm />
          </div>
        </section>
      </div>
    </main>
  )
}
