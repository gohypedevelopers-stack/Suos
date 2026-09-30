"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ChevronDown, ShoppingBag, Tag, ArrowRight, Trash2 } from "lucide-react"
import { useState } from "react"

import { useCart, type CartItem } from "@/lib/cart-context"
import { trendingProducts } from "@/components/product/productData"

/* ─────────────────────────────────────────────
   Price & number formatting
───────────────────────────────────────────── */
function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === "") return "—"
  if (typeof price === "number") {
    return `₹${price.toLocaleString("en-IN")}`
  }
  const raw = price.replace(/[^\d.]/g, "")
  const num = parseFloat(raw)
  if (isNaN(num)) return price
  return `₹${num.toLocaleString("en-IN")}`
}

function parseAmount(price: string | null | undefined): number {
  if (!price) return 0
  const raw = price.replace(/[^\d.]/g, "")
  return parseFloat(raw) || 0
}

const COLOR_NAME_MAP: Record<string, string> = {
  "#191970": "Midnight Blue",
  "#000000": "Black",
  "#171717": "Washed Black",
  "#1a1a1a": "Jet Black",
  "#ffffff": "White",
  "#f5f5f5": "Off White",
  "#2c3e50": "Dark Slate",
  "#808080": "Grey",
  "#4a5568": "Slate Grey",
  "#718096": "Cool Grey",
  "#1e3a8a": "Deep Navy",
  "#3b82f6": "Classic Blue",
  "#0f766e": "Deep Teal",
  "#374151": "Charcoal",
  "#6b7280": "Stone",
  "#d1d5db": "Light Grey",
  "#b45309": "Amber",
  "#78350f": "Dark Tan",
  "#a16207": "Olive",
}

function resolveColorInfo(rawColor?: string | null): { label: string; hex?: string } {
  if (!rawColor) return { label: "Natural / Signature" }
  if (rawColor.startsWith("#")) {
    const hex = rawColor.toLowerCase()
    return {
      label: COLOR_NAME_MAP[hex] || "Signature Color",
      hex: rawColor,
    }
  }
  return { label: rawColor }
}

/* ─────────────────────────────────────────────
   Cart item row (SUOS Brand Style)
───────────────────────────────────────────── */
function CartItemRow({ item }: { item: CartItem }) {
  const { removeFromCart, updateQuantity } = useCart()
  const itemPrice = parseAmount(item.price)
  const comparePrice = item.compareAtPrice ? parseAmount(item.compareAtPrice) : null

  const rawColor =
    (item as any).color ||
    (item.swatches && item.swatches.length > 0 ? item.swatches[0] : null)
  const colorInfo = resolveColorInfo(rawColor)

  return (
    <article className="border-b border-black/15 py-5 sm:py-6">
      <div className="flex gap-4 sm:gap-6">
        {/* Product image */}
        <div className="relative aspect-[3/4] w-[84px] sm:w-[105px] shrink-0 overflow-hidden bg-neutral-100">
          <Link
            href={item.slug ? `/products/${item.slug}` : "#"}
            className="block h-full w-full"
            tabIndex={-1}
            aria-hidden="true"
          >
            <Image
              src={item.image}
              alt={item.alt || item.title || "Product"}
              fill
              sizes="105px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </Link>
          {item.badge && (
            <span className="absolute bottom-1.5 left-1.5 rounded-[2px] bg-slate-100/95 px-1.5 py-0.5 text-[9px] font-normal tracking-tight text-blue-900 shadow-xs">
              {item.badge}
            </span>
          )}
        </div>

        {/* Details & Top-right stepper */}
        <div className="flex min-w-0 flex-1 flex-col justify-start">
          {/* Top row: Title and Stepper */}
          <div className="flex items-start justify-between gap-3">
            <Link
              href={item.slug ? `/products/${item.slug}` : "#"}
              className="min-w-0 text-[13px] sm:text-[14px] font-normal leading-snug text-black transition-opacity hover:opacity-60"
            >
              {item.title || "SIGNATURE ITEM"}
            </Link>

            {/* Stepper like before */}
            <div className="flex shrink-0 items-center border border-black/25 bg-white">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                aria-label="Decrease quantity"
                className="flex size-7 items-center justify-center text-black transition-colors hover:bg-black/5 cursor-pointer"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-7 text-center text-[12px] font-normal text-black">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                aria-label="Increase quantity"
                className="flex size-7 items-center justify-center text-black transition-colors hover:bg-black/5 cursor-pointer"
              >
                <Plus className="size-3" />
              </button>
            </div>
          </div>

          {/* Price row */}
          <div className="mt-1 flex items-baseline gap-2 text-[13px] sm:text-[14px]">
            {comparePrice && comparePrice > itemPrice && (
              <span className="text-neutral-400 line-through text-[12px]">
                {formatPrice(comparePrice)}
              </span>
            )}
            <span className="font-normal text-black">
              {formatPrice(itemPrice > 0 ? itemPrice : item.price)}
            </span>
          </div>

          {/* Attributes (Color & Size) */}
          <div className="mt-1.5 space-y-0.5 text-[12px] font-normal text-neutral-600">
            <p className="flex items-center gap-1.5">
              <span>Color:</span>
              {colorInfo.hex && (
                <span
                  className="size-2.5 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: colorInfo.hex }}
                  aria-hidden="true"
                />
              )}
              <span className="text-black">{colorInfo.label}</span>
            </p>

            {item.size && (
              <p>
                Size: <span className="text-black">{item.size}</span>
              </p>
            )}
          </div>

          {/* Delivery perk / badge */}
          <div className="mt-1">
            <span className="text-[11px] font-normal text-neutral-500">
              {item.badge ? `${item.badge} · Pre-paid eligible` : "Complimentary Express Delivery Eligible"}
            </span>
          </div>
        </div>
      </div>

      {/* Stock info and Actions row (underneath) */}
      <div className="mt-3.5 sm:mt-4 space-y-2">
        <p className="text-[12px] font-normal text-neutral-700">
          <span className="text-emerald-700 font-normal">In Stock:</span> Ships in 1–2 business days
        </p>

        <div className="flex items-center gap-5 text-[12px] font-normal text-neutral-500">
          <Link
            href={item.slug ? `/products/${item.slug}` : "#"}
            className="hover:text-black transition-colors"
          >
            Edit
          </Link>
          <button
            type="button"
            className="hover:text-black transition-colors cursor-pointer"
          >
            Save for Later
          </button>
          <button
            type="button"
            onClick={() => removeFromCart(item.id, item.size)}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─────────────────────────────────────────────
   Promo code row
───────────────────────────────────────────── */
function PromoCodeAccordion() {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const [applied, setApplied] = useState(false)

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().toUpperCase() === "SUOS10" || code.trim().length > 3) {
      setApplied(true)
    }
  }

  return (
    <div className="border-t border-black/15 pt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-[13px] uppercase tracking-[0.06em] text-black transition-colors hover:opacity-70"
      >
        <span className="flex items-center gap-2">
          <Tag className="size-3.5 text-black/60" />
          Have a promo code?
        </span>
        <ChevronDown
          className={`size-4 text-black/60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <form onSubmit={handleApply} className="mt-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setApplied(false)
              }}
              placeholder="e.g. SUOS10"
              className="flex-1 border border-black/25 bg-white px-3 py-2 text-[12px] uppercase tracking-[0.06em] placeholder:normal-case placeholder:tracking-normal placeholder:text-black/35 focus:border-black focus:outline-none"
            />
            <button
              type="submit"
              className="border border-black bg-black px-4 text-[12px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-black/80"
            >
              Apply
            </button>
          </div>
          {applied && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.04em] text-black font-medium">
              ✓ Promo code applied: 10% off
            </p>
          )}
        </form>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Rewards Banner (SUOS Monochrome Luxury Card)
───────────────────────────────────────────── */
function SuosRewardsCard({ subtotal }: { subtotal: number }) {
  const points = Math.max(100, Math.round(subtotal * 0.1))

  return (
    <div className="border border-black bg-black p-5 text-center sm:text-left text-white">
      <h3 className="text-[14px] font-normal uppercase tracking-[0.1em] text-white">
        SUOS <span className="font-light text-white/70">Rewards</span>
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-white/75">
        You could earn <strong className="font-semibold text-white">{points} points</strong> on this order.
      </p>
      <Link
        href="/contact"
        className="mt-2.5 inline-block text-[11px] font-medium uppercase tracking-[0.08em] text-white underline underline-offset-4 transition-opacity hover:opacity-75"
      >
        Sign in or Join SUOS Rewards now
      </Link>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Order Summary (SUOS Minimalist Right Column)
───────────────────────────────────────────── */
function ShoppingBagSummary({
  subtotal,
  itemCount,
}: {
  subtotal: number
  itemCount: number
}) {
  const discount = subtotal >= 2999 ? Math.round(subtotal * 0.1) : 0
  const finalTotal = subtotal - discount
  const installment = Math.round(finalTotal / 4)

  return (
    <div className="space-y-4 lg:sticky lg:top-8">
      {/* Rewards Header Card */}
      <SuosRewardsCard subtotal={subtotal} />

      {/* Main Order Summary Box */}
      <aside className="border border-black/15 bg-white p-6 text-black sm:p-7">
        <h2 className="text-[15px] font-normal uppercase tracking-[0.08em] text-black">
          Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h2>

        {/* Pricing rows */}
        <div className="mt-6 space-y-3 text-[13px] tracking-[0.02em]">
          <div className="flex items-center justify-between text-black/80">
            <span className="uppercase tracking-[0.04em]">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-black font-medium">
              <span className="uppercase tracking-[0.04em]">Special 10% Privilege</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-black/80">
            <span className="uppercase tracking-[0.04em]">Tax</span>
            <span className="text-[12px] uppercase text-black/55">Calculated in checkout</span>
          </div>

          <div className="flex items-center justify-between text-black/80">
            <span className="uppercase tracking-[0.04em]">Standard Shipping</span>
            <span className="font-medium text-black uppercase tracking-[0.04em]">FREE</span>
          </div>
        </div>

        {/* Promo Code Accordion */}
        <div className="mt-5">
          <PromoCodeAccordion />
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-black/15" />

        {/* Estimated Total */}
        <div className="flex items-baseline justify-between">
          <span className="text-[14px] font-normal uppercase tracking-[0.08em] text-black">
            Estimated Total
          </span>
          <span className="text-[20px] font-semibold tracking-[-0.02em] text-black">
            {formatPrice(finalTotal)}
          </span>
        </div>

        {/* Installment note */}
        <p className="mt-2 text-[11px] leading-relaxed tracking-[0.02em] text-black/65">
          4 interest-free payments of <strong className="text-black">{formatPrice(installment)}</strong> with UPI or Netbanking ⓘ
        </p>

        {/* Primary CTA */}
        <div className="mt-6">
          <Link
            href="/checkout"
            className="flex h-12 w-full items-center justify-center bg-black text-[13px] font-medium uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 active:scale-[0.99]"
          >
            Start Checkout
          </Link>
        </div>

        {/* Express Checkout Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/15" />
          </div>
          <span className="relative bg-white px-3 text-[11px] uppercase tracking-[0.08em] text-black/50">
            or checkout with
          </span>
        </div>

        {/* Express Payment Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <Link
            href="/checkout"
            className="flex h-10 items-center justify-center border border-black bg-white px-1 sm:px-2 text-center text-[10.5px] min-[360px]:text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.02em] sm:tracking-[0.06em] text-black transition-colors hover:bg-black hover:text-white"
          >
            UPI / GPay
          </Link>
          <Link
            href="/checkout"
            className="flex h-10 items-center justify-center border border-black bg-white px-1 sm:px-2 text-center text-[10.5px] min-[360px]:text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.02em] sm:tracking-[0.06em] text-black transition-colors hover:bg-black hover:text-white"
          >
            Cards / Netbanking
          </Link>
        </div>

        {/* Trust & Policy Details */}
        <div className="mt-8 space-y-2 border-t border-black/15 pt-6 text-center text-[11px] uppercase tracking-[0.06em] text-black/55">
          <p className="font-medium text-black/80">SUOS members enjoy complimentary returns</p>
          <p>100% Authentic SUOS Atelier Guarantee</p>
          <p className="pt-1">
            Need Help?{" "}
            <a href="mailto:info@suos.in" className="underline hover:text-black">
              info@suos.in
            </a>
          </p>
          <div className="flex justify-center gap-3 pt-1 text-[10px]">
            <Link href="/returns-policy" className="underline hover:text-black">
              Shipping Info
            </Link>
            <span>·</span>
            <Link href="/returns-policy" className="underline hover:text-black">
              Returns Policy
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Empty Bag State
───────────────────────────────────────────── */
function EmptyBagState() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <ShoppingBag className="mb-6 size-12 text-black/20" strokeWidth={1} />
      <h2 className="text-[20px] font-normal uppercase tracking-[0.08em] text-black sm:text-[24px]">
        Your Bag is Empty
      </h2>
      <p className="mt-2 max-w-sm text-[13px] uppercase tracking-[0.04em] text-black/50">
        Discover new arrivals and signature pieces crafted for timeless elegance.
      </p>
      <Link
        href="/collections"
        className="mt-8 inline-flex h-12 items-center bg-black px-8 text-[13px] uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
      >
        Shop New Collections
      </Link>
    </div>
  )
}

/* ─────────────────────────────────────────────
   "Before You Go" Recommendations Grid
───────────────────────────────────────────── */
function BeforeYouGoSection() {
  const recommendations = trendingProducts.slice(0, 4)

  return (
    <section className="mt-20 border-t border-black/15 pt-12">
      <div className="flex items-start sm:items-baseline justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[18px] sm:text-[22px] font-normal uppercase tracking-[0.06em] text-black">
            Before You Go
          </h2>
          <p className="mt-1 text-[11px] sm:text-[12px] uppercase tracking-[0.06em] text-black/45">
            Curated pieces to complete your wardrobe
          </p>
        </div>
        <Link
          href="/collections"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] sm:text-[12px] uppercase tracking-[0.08em] text-black transition-opacity hover:opacity-60 pt-0.5 sm:pt-0"
        >
          <span>View All</span>
          <ArrowRight className="size-3.5 shrink-0" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {recommendations.map((prod, idx) => (
          <Link
            key={prod.id || idx}
            href={prod.slug ? `/products/${prod.slug}` : "/collections"}
            className="group flex flex-col"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
              <Image
                src={prod.image}
                alt={prod.alt || prod.title || "SUOS Product"}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {prod.badge && (
                <span className="absolute left-2.5 top-2.5 bg-black px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-white">
                  {prod.badge}
                </span>
              )}
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="truncate text-[12px] font-normal uppercase tracking-[0.06em] text-black group-hover:opacity-70 sm:text-[13px]">
                {prod.title || "SIGNATURE ATELIER PIECE"}
              </h3>
              <p className="text-[12px] font-medium tracking-[0.02em] text-black sm:text-[13px]">
                {prod.price && prod.price !== "N/A" ? formatPrice(prod.price) : "₹4,990"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Main Shopping Bag Page
───────────────────────────────────────────── */
export function ShoppingBagPage() {
  const { cart, totalItems } = useCart()

  const subtotal = cart.reduce(
    (sum, item) => sum + parseAmount(item.price) * item.quantity,
    0
  )
  const discount = subtotal >= 2999 ? Math.round(subtotal * 0.1) : 0
  const finalTotal = subtotal - discount

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {cart.length === 0 ? (
          <EmptyBagState />
        ) : (
          <div>
            {/* Top Page Title & Total */}
            <div className="border-b border-black/15 pb-5">
              <div className="flex items-baseline justify-between gap-3">
                <h1 className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 text-[18px] sm:text-[22px] font-normal uppercase tracking-[0.06em] text-black">
                  <span>Shopping Bag</span>
                  <span className="text-[13px] sm:text-[15px] font-light text-black/50 tracking-[0.04em]">
                    ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                </h1>
                <span className="shrink-0 text-[18px] sm:text-[22px] font-normal tracking-[0.02em] text-black">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              {/* Alert notice */}
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] sm:text-[12px] font-normal uppercase tracking-[0.05em] text-black/65">
                <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="8" r="8" fill="black" />
                  <path d="M8 3.75a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 8 3.75zm0 8a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" fill="white" />
                </svg>
                <span>Items in bag are not reserved and may sell out. Order now.</span>
              </div>
            </div>

            {/* Main 2-Column Content */}
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start xl:gap-14">
              {/* Left Column: Items List */}
              <section>
                <div className="divide-y divide-transparent">
                  {cart.map((item) => (
                    <CartItemRow key={`${item.id}-${item.size}`} item={item} />
                  ))}
                </div>

                {/* Gift Option Box */}
                <div className="mt-8 border border-black/15 bg-neutral-50 px-5 py-4 text-center text-[12px] uppercase tracking-[0.06em] text-black/75">
                  Gift options available in checkout
                </div>
              </section>

              {/* Right Column: Sticky Summary & Checkout */}
              <ShoppingBagSummary subtotal={subtotal} itemCount={totalItems} />
            </div>

            {/* "Before You Go" Recommendations */}
            <BeforeYouGoSection />
          </div>
        )}
      </div>
    </main>
  )
}
