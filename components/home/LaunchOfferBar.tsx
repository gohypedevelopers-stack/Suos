import Link from "next/link"

import { LaunchOfferCountdown } from "@/components/home/LaunchOfferCountdown"
import { getServerTimestamp } from "@/lib/server-time"

const launchDeadline = Date.parse("2026-07-18T00:00:00Z")

export function LaunchOfferBar() {
  const initialNow = getServerTimestamp()

  return (
    <section className="h-[96px] overflow-hidden bg-black text-white">
      <div className="mx-auto flex h-full w-full max-w-[1268px] items-center justify-center px-4 sm:px-6">
        <div className="flex w-full min-w-0 items-center justify-center gap-3 whitespace-nowrap sm:gap-6 md:gap-10">
          <p className="shrink-0 text-[0.5rem] font-medium uppercase tracking-[0.06em] sm:text-[0.625rem] md:text-[0.875rem] md:tracking-[0.12em]">
            Launch Offer Live Now
          </p>

          <LaunchOfferCountdown
            targetTimestamp={launchDeadline}
            initialNow={initialNow}
          />

          <Link
            href="/#collection"
            className="inline-flex h-7 shrink-0 items-center justify-center border border-white/70 px-2 text-[0.4375rem] font-medium uppercase tracking-[0.1em] transition-colors hover:bg-white/10 sm:h-9 sm:min-w-[7rem] sm:px-4 sm:text-[0.625rem] md:h-10 md:min-w-[8.5rem] md:px-6 md:text-[0.875rem]"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}
