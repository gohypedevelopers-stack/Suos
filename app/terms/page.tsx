import type { Metadata } from "next"

import { PolicyRenderer } from "@/components/legal/PolicyRenderer"
import { getSiteContent } from "@/lib/server/dal/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { termsPolicy } = await getSiteContent()
  return {
    title: termsPolicy.metaTitle || "Terms & Conditions | SUOS",
    description: termsPolicy.metaDescription,
  }
}

export default async function TermsPage() {
  const { termsPolicy } = await getSiteContent()

  return (
    <main className="flex-1 bg-white text-black">
      <PolicyRenderer policy={termsPolicy} />
    </main>
  )
}
