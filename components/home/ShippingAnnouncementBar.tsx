"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { useSiteContent } from "@/lib/site-content-context"

export function ShippingAnnouncementBar() {
  const { announcements } = useSiteContent()
  const mobileMessages = announcements.mobile.length
    ? announcements.mobile
    : [announcements.center]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (mobileMessages.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % mobileMessages.length)
    }, 3200)

    return () => clearInterval(timer)
  }, [mobileMessages.length])

  const current = mobileMessages[index % mobileMessages.length]

  return (
    <section className="announcement-bar bg-black text-white">
      {/* Desktop 3-column layout */}
      <div className="hidden h-full w-full sm:grid sm:grid-cols-3 items-center px-4 text-[13px] font-normal uppercase leading-none sm:px-6 md:px-8">
        <p className="justify-self-start whitespace-nowrap">{announcements.left}</p>
        <p className="justify-self-center whitespace-nowrap text-center">{announcements.center}</p>
        <p className="justify-self-end whitespace-nowrap text-right">{announcements.right}</p>
      </div>

      {/* Mobile shuffle carousel */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-center sm:hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${index}-${current}`}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="whitespace-nowrap"
          >
            {current}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}
