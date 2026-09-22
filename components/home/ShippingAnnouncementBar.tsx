"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

const announcements = [
  "Free Shipping on Orders above Rs 2,900",
  "Launch Offer — 30% Off",
  "International Shipping Available",
  "Easy Exchanges & Returns",
]

export function ShippingAnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length)
    }, 3200)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="announcement-bar bg-black text-white">
      {/* Desktop 3-column layout */}
      <div className="hidden h-full w-full sm:grid sm:grid-cols-3 items-center px-4 text-[13px] font-normal uppercase leading-none sm:px-6 md:px-8">
        <p className="justify-self-start whitespace-nowrap">
          International Shipping Available
        </p>
        <p className="justify-self-center whitespace-nowrap text-center">
          Free Shipping on Orders above Rs 2,900 | Launch Offer 30% off
        </p>
        <p className="justify-self-end whitespace-nowrap text-right">
          Easy Exchange and Returns
        </p>
      </div>

      {/* Mobile shuffle carousel */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-center sm:hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="whitespace-nowrap"
          >
            {announcements[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}
