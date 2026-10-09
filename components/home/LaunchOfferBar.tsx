import Link from "next/link"

import { LaunchOfferCountdown } from "@/components/home/LaunchOfferCountdown"
import { getServerTimestamp } from "@/lib/server-time"
import { getSiteContent } from "@/lib/server/dal/site-content"

export async function LaunchOfferBar() {
  const { launchOffer } = await getSiteContent()
  if (!launchOffer.enabled) return null

  const initialNow = getServerTimestamp()
  const launchDeadline = Date.parse(launchOffer.endsAt)

  return (
    <section className="h-auto py-3 sm:py-0 sm:h-[96px] overflow-hidden bg-black text-white">
      <div className="mx-auto flex h-full w-full max-w-[1268px] items-center justify-center px-3 sm:px-6">
        <div className="flex w-full min-w-0 items-center justify-between sm:justify-center gap-2 sm:gap-6 md:gap-10">
          <p className="hidden sm:block shrink-0 text-[0.625rem] md:text-[13px] font-normal uppercase tracking-[0.06em] md:tracking-[0.12em]">
            {launchOffer.label}
          </p>

          <LaunchOfferCountdown
            targetTimestamp={Number.isNaN(launchDeadline) ? initialNow : launchDeadline}
            initialNow={initialNow}
          />

          <Link
            href={launchOffer.ctaHref || "/collections"}
            className="inline-flex h-7 shrink-0 items-center justify-center border border-white/70 px-2.5 text-[11px] font-normal uppercase tracking-[0.08em] transition-colors hover:bg-white/10 sm:h-9 sm:min-w-[7rem] sm:px-4 sm:text-[13px] md:h-10 md:min-w-[8.5rem] md:px-6"
          >
            {launchOffer.ctaText}
          </Link>
        </div>
      </div>
    </section>
  )
}
