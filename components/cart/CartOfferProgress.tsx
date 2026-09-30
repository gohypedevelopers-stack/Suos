"use client"

import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

const offerMilestones = [
  { amount: 4500, label: "SHOP ₹4500", positionPercent: 27.5 },
  { amount: 12000, label: "SHOP ₹12000", positionPercent: 64.5 },
  { amount: 15000, label: "SHOP ₹15000", positionPercent: 90.5 },
] as const

export function CartOfferProgress() {
  const { cart } = useCart()

  const subtotal = cart.reduce((acc, item) => {
    const raw = (item.price || "0").replace(/[^\d.]/g, "")
    const num = parseFloat(raw) || 0
    return acc + num * (item.quantity || 1)
  }, 0)

  // Calculate dynamic progress line width & message
  let fillPercent = 0
  let headlineText = ""

  if (subtotal <= 0) {
    fillPercent = 0
    headlineText = "SHOP FOR ₹4,500 TO GET 10% OFF"
  } else if (subtotal < 4500) {
    fillPercent = (subtotal / 4500) * 27.5
    const remaining = 4500 - subtotal
    headlineText = `SHOP FOR ₹${remaining.toLocaleString("en-IN")} TO GET 10% OFF`
  } else if (subtotal < 12000) {
    fillPercent = 27.5 + ((subtotal - 4500) / (12000 - 4500)) * (64.5 - 27.5)
    const remaining = 12000 - subtotal
    headlineText = `SHOP FOR ₹${remaining.toLocaleString("en-IN")} TO GET 15% OFF`
  } else if (subtotal < 15000) {
    fillPercent = 64.5 + ((subtotal - 12000) / (15000 - 12000)) * (90.5 - 64.5)
    const remaining = 15000 - subtotal
    headlineText = `SHOP FOR ₹${remaining.toLocaleString("en-IN")} FOR VIP PRIVILEGE`
  } else {
    fillPercent = 90.5
    headlineText = "YOU'VE UNLOCKED ALL PRIVILEGES!"
  }

  return (
    <section className="mx-auto w-full max-w-[360px] text-center">
      <h2 className="whitespace-nowrap text-[14px] sm:text-[15px] font-normal uppercase leading-none tracking-[-0.02em] text-white">
        {headlineText}
      </h2>

      <div className="relative mt-6 h-[4rem]">
        <div className="absolute left-0 top-[0.875rem] h-px w-[90.5%] bg-white/30" />
        <div
          className="absolute left-0 top-[0.875rem] h-px bg-white transition-all duration-300 ease-out"
          style={{ width: `${Math.min(90.5, fillPercent)}%` }}
        />

        {offerMilestones.map((item) => {
          const isReached = subtotal >= item.amount
          return (
            <div
              key={item.label}
              className="absolute top-[0.875rem] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${item.positionPercent}%` }}
            >
              <span
                className={cn(
                  "block size-4 rounded-full border-[1.5px] border-white transition-colors duration-300",
                  isReached ? "bg-white" : "bg-black"
                )}
              />
              <span
                className={cn(
                  "absolute left-1/2 top-[1.45rem] -translate-x-1/2 whitespace-nowrap text-[10px] font-normal uppercase tracking-[0.03em] transition-colors sm:text-[11px]",
                  isReached ? "text-white" : "text-white/60"
                )}
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
