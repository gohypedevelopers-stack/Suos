import type { Metadata } from "next"

import { PolicyRenderer } from "@/components/legal/PolicyRenderer"
import { getSiteContent } from "@/lib/server/dal/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const { privacyPolicy } = await getSiteContent()
  return {
    title: privacyPolicy.metaTitle || "Privacy Policy | SUOS",
    description: privacyPolicy.metaDescription,
  }
}

export default async function PrivacyPage() {
  const { privacyPolicy } = await getSiteContent()

  return (
    <main className="flex-1 bg-white text-black">
      <PolicyRenderer policy={privacyPolicy} />
    </main>
  )
}
