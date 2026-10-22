"use client"

import { useEffect, useState } from "react"

type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getCountdownParts(targetTimestamp: number, currentTimestamp: number) {
  const totalSeconds = Math.max(
    0,
    Math.floor((targetTimestamp - currentTimestamp) / 1000)
  )

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    days,
    hours,
    minutes,
    seconds,
  } satisfies CountdownParts
}

function formatValue(value: number) {
  return String(value).padStart(2, "0")
}

export function LaunchOfferCountdown({
  targetTimestamp,
  initialNow,
}: {
  targetTimestamp: number
  initialNow: number
}) {
  const [countdown, setCountdown] = useState(() =>
    getCountdownParts(targetTimestamp, initialNow)
  )

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdownParts(targetTimestamp, Date.now()))
    }

    updateCountdown()
    const intervalId = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(intervalId)
  }, [targetTimestamp])

  const countdownLabel = `${countdown.days} days ${countdown.hours} hours ${countdown.minutes} minutes ${countdown.seconds} seconds remaining`

  return (
    <div
      aria-label={countdownLabel}
      aria-live="off"
      className="flex shrink-0 items-center gap-0.5 sm:gap-2 md:gap-3"
    >
      {[
        { label: "Days", value: countdown.days },
        { label: "Hours", value: countdown.hours },
        { label: "Mins", value: countdown.minutes },
        { label: "Secs", value: countdown.seconds },
      ].map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 ? (
            <span
              aria-hidden="true"
              className="mr-1 text-[13px] leading-none text-white/70 sm:mr-2 sm:text-[14px] md:mr-3 md:text-[16px]"
            >
              :
            </span>
          ) : null}
          <div className="flex min-w-[2.25rem] flex-col items-center text-center sm:min-w-[2.75rem] md:min-w-[3.5rem]">
            <span className="text-[14px] font-normal leading-[1.15] tracking-normal tabular-nums md:text-[16px]">
              {formatValue(item.value)}
            </span>
            <span className="mt-1 text-[11px] font-normal uppercase leading-none tracking-normal text-white/70">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
