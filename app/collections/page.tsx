import type { Metadata } from "next"

import { CollectionBenefitsBar } from "@/components/collection/CollectionBenefitsBar"
import { CollectionsHub } from "@/components/collection/CollectionsHub"

export const metadata: Metadata = {
  title: "Collections | SUOS",
  description: "Browse all SUOS curated men's clothing collections.",
}

export const dynamic = "force-dynamic"

export default async function Page() {
  return (
    <main className="flex-1 bg-white">
      <CollectionsHub />
      <CollectionBenefitsBar />
    </main>
  )
}
