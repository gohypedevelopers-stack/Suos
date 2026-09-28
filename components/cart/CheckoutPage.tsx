"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  ChevronDown,
  Check,
  LoaderCircle,
  Tag,
  ShoppingBag,
  HelpCircle,
  CreditCard,
  QrCode,
  Building2,
  Truck,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"

import { useCart } from "@/lib/cart-context"

/* ─────────────────────────────────────────────
   Helpers & Options
───────────────────────────────────────────── */
function parseAmount(price: string | null | undefined): number {
  if (!price) return 0
  const raw = price.replace(/[^\d.]/g, "")
  return parseFloat(raw) || 0
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`
}

type ShippingOption = {
  id: string
  label: string
  description: string
  price: number
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Enter zip code above for delivery estimate",
    price: 0,
  },
  {
    id: "second-day",
    label: "Second Day",
    description: "Usually delivered in 2 business days",
    price: 149,
  },
  {
    id: "next-day",
    label: "Next Day",
    description: "Usually delivered in 1 business day",
    price: 299,
  },
]

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Chandigarh",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
]

/* ─────────────────────────────────────────────
   Floating Label Field (SUOS Monochrome Style)
───────────────────────────────────────────── */
function FloatingField({
  id,
  label,
  type = "text",
  required,
  value,
  onChange,
  className = "",
  rightBadge,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  className?: string
  rightBadge?: React.ReactNode
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        required={required}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer h-[54px] w-full border border-black/25 bg-white px-3.5 pt-4 text-[13px] font-normal tracking-[0.02em] text-black placeholder-transparent outline-none transition focus:border-black"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-black/45 transition-all peer-focus:top-3 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.06em] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.06em]"
      >
        {label}
      </label>
      {rightBadge && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightBadge}
        </div>
      )}
    </div>
  )
}

function FloatingSelect({
  id,
  label,
  required,
  value,
  onChange,
  options,
  className = "",
}: {
  id: string
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  options: string[]
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer h-[54px] w-full appearance-none border border-black/25 bg-white px-3.5 pt-4 text-[13px] font-normal text-black outline-none transition focus:border-black"
      >
        <option value="" disabled hidden />
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-3.5 text-[13px] text-black/45 transition-all ${
          value
            ? "top-3 text-[10px] uppercase tracking-[0.06em] text-black/60"
            : "top-1/2 -translate-y-1/2"
        }`}
      >
        {label}
      </label>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-black/40" />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Shipping Method Card Selector
───────────────────────────────────────────── */
function ShippingMethodCards({
  selected,
  onChange,
}: {
  selected: string
  onChange: (id: string) => void
}) {
  return (
    <div className="divide-y divide-black/15 border border-black/25">
      {SHIPPING_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id
        return (
          <label
            key={opt.id}
            className={`flex cursor-pointer items-center justify-between px-4 py-4 transition-colors ${
              isSelected ? "bg-black/[0.03]" : "hover:bg-black/[0.01]"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected ? "border-black" : "border-black/35"
                }`}
              >
                {isSelected && (
                  <span className="size-2 rounded-full bg-black" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-black">
                  {opt.label}
                </p>
                <p className="mt-0.5 text-[12px] tracking-[0.02em] text-black/55">
                  {opt.description}
                </p>
              </div>
            </div>

            <span className="text-[13px] font-medium tracking-[0.04em] text-black">
              {opt.price === 0 ? "FREE" : formatPrice(opt.price)}
            </span>
          </label>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Payment Method Selector & Form
───────────────────────────────────────────── */
function PaymentSection({
  selectedMethod,
  setSelectedMethod,
  total,
}: {
  selectedMethod: string
  setSelectedMethod: (m: string) => void
  total: number
}) {
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [billingSame, setBillingSame] = useState(true)

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-3">
        <h2 className="text-[20px] font-normal uppercase tracking-[0.06em] text-black sm:text-[22px]">
          Payment
        </h2>
        <p className="text-[12px] uppercase tracking-[0.04em] text-black/50">
          All transactions are encrypted and secure.
        </p>
      </div>

      {/* Payment Method Cards */}
      <div className="divide-y divide-black/15 border border-black/25">
        {/* UPI */}
        <label
          className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
            selectedMethod === "upi" ? "bg-black/[0.03]" : "hover:bg-black/[0.01]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                selectedMethod === "upi" ? "border-black" : "border-black/35"
              }`}
            >
              {selectedMethod === "upi" && (
                <span className="size-2 rounded-full bg-black" />
              )}
            </div>
            <div>
              <span className="text-[13px] font-medium uppercase tracking-[0.04em] text-black">
                UPI / QR Code (Google Pay, PhonePe, Paytm)
              </span>
              <p className="text-[11px] text-black/50">Instant verification · No convenience fee</p>
            </div>
          </div>
          <QrCode className="size-5 text-black/60" />
        </label>

        {selectedMethod === "upi" && (
          <div className="bg-neutral-50 p-4 space-y-3 border-t border-black/10">
            <p className="text-[12px] uppercase tracking-[0.04em] text-black/70">
              Enter your UPI ID or scan QR upon placing order:
            </p>
            <input
              type="text"
              placeholder="username@okhdfcbank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="h-11 w-full border border-black/25 bg-white px-3.5 text-[13px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
            />
          </div>
        )}

        {/* Credit / Debit Card */}
        <label
          className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
            selectedMethod === "card" ? "bg-black/[0.03]" : "hover:bg-black/[0.01]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                selectedMethod === "card" ? "border-black" : "border-black/35"
              }`}
            >
              {selectedMethod === "card" && (
                <span className="size-2 rounded-full bg-black" />
              )}
            </div>
            <div>
              <span className="text-[13px] font-medium uppercase tracking-[0.04em] text-black">
                Credit or Debit Card
              </span>
              <p className="text-[11px] text-black/50">Visa, Mastercard, RuPay, Amex</p>
            </div>
          </div>
          <CreditCard className="size-5 text-black/60" />
        </label>

        {selectedMethod === "card" && (
          <div className="bg-neutral-50 p-4 space-y-3 border-t border-black/10">
            <input
              type="text"
              placeholder="Card Number"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="h-11 w-full border border-black/25 bg-white px-3.5 text-[13px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM / YY"
                maxLength={5}
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="h-11 border border-black/25 bg-white px-3.5 text-[13px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
              />
              <input
                type="password"
                placeholder="CVV"
                maxLength={4}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="h-11 border border-black/25 bg-white px-3.5 text-[13px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Name on Card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="h-11 w-full border border-black/25 bg-white px-3.5 text-[13px] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
            />
          </div>
        )}

        {/* Net Banking */}
        <label
          className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
            selectedMethod === "netbanking" ? "bg-black/[0.03]" : "hover:bg-black/[0.01]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                selectedMethod === "netbanking" ? "border-black" : "border-black/35"
              }`}
            >
              {selectedMethod === "netbanking" && (
                <span className="size-2 rounded-full bg-black" />
              )}
            </div>
            <div>
              <span className="text-[13px] font-medium uppercase tracking-[0.04em] text-black">
                Net Banking
              </span>
              <p className="text-[11px] text-black/50">All Indian major banks supported</p>
            </div>
          </div>
          <Building2 className="size-5 text-black/60" />
        </label>

        {/* Cash on Delivery */}
        <label
          className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
            selectedMethod === "cod" ? "bg-black/[0.03]" : "hover:bg-black/[0.01]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                selectedMethod === "cod" ? "border-black" : "border-black/35"
              }`}
            >
              {selectedMethod === "cod" && (
                <span className="size-2 rounded-full bg-black" />
              )}
            </div>
            <div>
              <span className="text-[13px] font-medium uppercase tracking-[0.04em] text-black">
                Cash on Delivery (Pay on Delivery)
              </span>
              <p className="text-[11px] text-black/50">Pay cash or UPI upon delivery at doorstep</p>
            </div>
          </div>
          <Truck className="size-5 text-black/60" />
        </label>
      </div>

      {/* Billing Address Option */}
      <div className="space-y-3 pt-2">
        <h3 className="text-[14px] font-medium uppercase tracking-[0.06em] text-black">
          Billing Address
        </h3>
        <div className="divide-y divide-black/15 border border-black/25">
          <label className="flex cursor-pointer items-center gap-3 p-3.5">
            <input
              type="radio"
              name="billing"
              checked={billingSame}
              onChange={() => setBillingSame(true)}
              className="size-4 accent-black"
            />
            <span className="text-[13px] text-black">Same as shipping address</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 p-3.5">
            <input
              type="radio"
              name="billing"
              checked={!billingSame}
              onChange={() => setBillingSame(false)}
              className="size-4 accent-black"
            />
            <span className="text-[13px] text-black">Use a different billing address</span>
          </label>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Right Column: Sticky SUOS Order Summary
───────────────────────────────────────────── */
function CheckoutRightSummary({
  subtotal,
  shippingCost,
}: {
  subtotal: number
  shippingCost: number
}) {
  const { cart } = useCart()
  const [bagOpen, setBagOpen] = useState(true)
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const discount = subtotal >= 2999 ? Math.round(subtotal * 0.1) : 0
  const total = subtotal - discount + shippingCost
  const installment = Math.round(total / 4)

  const totalItemCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <aside className="border border-black/15 bg-white p-6 sm:p-7 lg:sticky lg:top-8">
      {/* Collapsible Shopping Bag Preview */}
      <div>
        <button
          type="button"
          onClick={() => setBagOpen((b) => !b)}
          className="flex w-full items-center justify-between text-[15px] font-medium uppercase tracking-[0.06em] text-black transition-opacity hover:opacity-75"
        >
          <span>
            Shopping Bag ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})
          </span>
          <ChevronDown
            className={`size-4 text-black/60 transition-transform duration-200 ${
              bagOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {bagOpen && cart.length > 0 && (
          <div className="mt-5 space-y-4 border-t border-black/15 pt-5">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-center gap-4"
              >
                <div className="relative size-16 shrink-0 overflow-hidden bg-neutral-100">
                  <Image
                    src={item.image}
                    alt={item.alt || item.title || ""}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute right-0 top-0 flex size-4 items-center justify-center bg-black text-[9px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-[12px] font-medium uppercase tracking-[0.04em] text-black">
                    {item.title}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.04em] text-black/55">
                    Size: {item.size}
                  </p>
                </div>
                <p className="text-[13px] font-medium text-black">
                  {formatPrice(parseAmount(item.price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="mt-6 space-y-3 border-t border-black/15 pt-5 text-[13px] tracking-[0.02em]">
        <div className="flex items-center justify-between text-black/80">
          <span className="uppercase tracking-[0.04em]">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-black font-medium">
            <span className="uppercase tracking-[0.04em]">Extra 10% off ₹2,999+</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-black/80">
          <span className="uppercase tracking-[0.04em]">Tax</span>
          <span>₹0.00</span>
        </div>

        <div className="flex items-center justify-between text-black/80">
          <span className="uppercase tracking-[0.04em]">Standard Shipping</span>
          <span className="font-medium text-black uppercase tracking-[0.04em]">
            {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
          </span>
        </div>
      </div>

      {/* Promo Code Accordion */}
      <div className="mt-5 border-t border-black/15 pt-4">
        <button
          type="button"
          onClick={() => setPromoOpen((p) => !p)}
          className="flex w-full items-center justify-between text-[13px] uppercase tracking-[0.04em] text-black/60 transition-colors hover:text-black"
        >
          <span className="flex items-center gap-2">
            <Tag className="size-3.5" />
            Have a promo code?
          </span>
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${
              promoOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {promoOpen && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="SUOS10"
              className="flex-1 border border-black/25 px-3 py-2 text-[12px] uppercase tracking-[0.04em] placeholder:normal-case placeholder:text-black/35 focus:border-black focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setPromoApplied(true)}
              className="border border-black bg-black px-4 text-[12px] uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-85"
            >
              Apply
            </button>
          </div>
        )}
        {promoApplied && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.04em] text-black font-medium">
            ✓ Code applied
          </p>
        )}
      </div>

      {/* Total */}
      <div className="mt-5 border-t border-black pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-normal uppercase tracking-[0.08em] text-black">
            Total
          </span>
          <span className="text-[22px] font-semibold tracking-[-0.02em] text-black">
            {formatPrice(total)}
          </span>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed tracking-[0.02em] text-black/65">
          4 payments of <strong className="text-black">{formatPrice(installment)}</strong> with UPI or Netbanking ⓘ
        </p>
      </div>

      {/* Authenticity & Perks */}
      <div className="mt-8 space-y-2 border-t border-black/15 pt-5 text-center text-[11px] uppercase tracking-[0.06em] text-black/55">
        <div className="flex items-center justify-center gap-1.5 text-black/80 font-medium">
          <Lock className="size-3.5" />
          <span>Encrypted 256-bit Secure Checkout</span>
        </div>
        <p>100% Authentic SUOS Atelier Guarantee</p>
        <p>Complimentary 30-Day Returns</p>
      </div>
    </aside>
  )
}

/* ─────────────────────────────────────────────
   Main Checkout & Payment Page
───────────────────────────────────────────── */
export function CheckoutPage() {
  const { cart, totalItems, clearCart } = useCart()

  // Form State
  const [email, setEmail] = useState("")
  const [newsletter, setNewsletter] = useState(true)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [apartment, setApartment] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("Delhi")
  const [pincode, setPincode] = useState("")
  const [phone, setPhone] = useState("")
  const [giftNote, setGiftNote] = useState(false)
  const [giftMessage, setGiftMessage] = useState("")
  const [shippingMethodId, setShippingMethodId] = useState("standard")

  // Step management
  const [step, setStep] = useState<"details" | "payment">("details")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  const selectedShipping =
    SHIPPING_OPTIONS.find((o) => o.id === shippingMethodId) ?? SHIPPING_OPTIONS[0]

  const subtotal = cart.reduce(
    (sum, item) => sum + parseAmount(item.price) * item.quantity,
    0
  )
  const discount = subtotal >= 2999 ? Math.round(subtotal * 0.1) : 0
  const finalTotal = subtotal - discount + selectedShipping.price

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1600))
    const generatedId = `SUOS-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderId(generatedId)
    setIsSubmitting(false)
    setOrderComplete(true)
    clearCart()
  }

  // Order Confirmed Screen
  if (orderComplete) {
    return (
      <main className="min-h-screen bg-white text-black">
        {/* Minimal Checkout Header */}
        <header className="border-b border-black/15 px-6 py-6 sm:px-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/" className="font-heading text-[24px] uppercase tracking-[0.1em] text-black">
              SUOS
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-black text-white">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="mt-6 text-[26px] font-normal uppercase tracking-[0.06em] text-black sm:text-[32px]">
            Thank You For Your Order
          </h1>
          <p className="mt-2 text-[14px] uppercase tracking-[0.06em] text-black/60">
            Order Reference: <strong className="text-black">{orderId}</strong>
          </p>
          <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-black/60">
            A confirmation receipt and tracking updates have been dispatched to{" "}
            <strong className="text-black">{email || "your email"}</strong>.
          </p>

          <div className="mt-10 border border-black/15 bg-neutral-50 p-6 text-left">
            <h3 className="text-[13px] font-medium uppercase tracking-[0.06em] text-black">
              Delivery Destination
            </h3>
            <p className="mt-2 text-[13px] text-black/80">
              {firstName} {lastName}
            </p>
            <p className="text-[12px] text-black/60">{address}</p>
            {apartment && <p className="text-[12px] text-black/60">{apartment}</p>}
            <p className="text-[12px] text-black/60">
              {city}, {state} - {pincode}
            </p>
            <p className="mt-3 text-[12px] uppercase tracking-[0.04em] text-black font-medium">
              Estimated Delivery: {selectedShipping.label} (3–5 business days)
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/collections"
              className="inline-flex h-12 w-full items-center justify-center bg-black px-8 text-[13px] uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 w-full items-center justify-center border border-black px-8 text-[13px] uppercase tracking-[0.12em] text-black transition-colors hover:bg-black hover:text-white sm:w-auto"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* ─── SUOS MINIMAL CHECKOUT HEADER ─── */}
      <header className="border-b border-black/15 px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-[22px] font-normal uppercase tracking-[0.12em] text-black transition-opacity hover:opacity-70 sm:text-[26px]"
          >
            SUOS
          </Link>

          {/* Help & Bag Icon with Item Count */}
          <div className="flex items-center gap-5 text-[12px] tracking-[0.04em] text-black/60">
            <div className="hidden items-center gap-2 sm:flex">
              <span>Need help?</span>
              <a href="mailto:care@suos.in" className="text-black underline underline-offset-2 hover:opacity-75">
                Email us
              </a>
              <span>|</span>
              <a href="tel:+919876543210" className="text-black hover:opacity-75">
                +91 98765 43210
              </a>
            </div>

            {/* Shopping Bag Icon with Count Badge */}
            <Link
              href="/cart"
              className="relative flex items-center p-1 text-black transition-opacity hover:opacity-70"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN TWO-COLUMN CHECKOUT BODY ─── */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start xl:gap-16">

          {/* ─── LEFT COLUMN: Steps Form ─── */}
          <div className="space-y-10">

            {/* Express Checkout Section */}
            {step === "details" && (
              <div>
                <p className="text-center text-[12px] uppercase tracking-[0.08em] text-black/60">
                  Express Checkout
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("payment")}
                    className="flex h-12 items-center justify-center border border-black bg-white text-[12px] font-medium uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-white"
                  >
                    UPI / GPay
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("payment")}
                    className="flex h-12 items-center justify-center border border-black bg-white text-[12px] font-medium uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-white"
                  >
                    Cards / Netbanking
                  </button>
                </div>

                <div className="relative my-7 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/15" />
                  </div>
                  <span className="relative bg-white px-4 text-[11px] uppercase tracking-[0.08em] text-black/50">
                    or
                  </span>
                </div>
              </div>
            )}

            {/* Back button if in payment step */}
            {step === "payment" && (
              <button
                type="button"
                onClick={() => setStep("details")}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.08em] text-black/60 transition-colors hover:text-black"
              >
                <ArrowLeft className="size-3.5" /> Back to Shipping Details
              </button>
            )}

            {step === "details" ? (
              <form onSubmit={handleContinueToPayment} className="space-y-10">
                {/* 1. Email Address */}
                <section className="space-y-4">
                  <h2 className="text-[20px] font-normal uppercase tracking-[0.06em] text-black sm:text-[22px]">
                    Email Address
                  </h2>
                  <FloatingField
                    id="email"
                    label="Email *"
                    type="email"
                    required
                    value={email}
                    onChange={setEmail}
                  />
                  <label className="flex cursor-pointer items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="mt-0.5 size-4 accent-black"
                    />
                    <span className="text-[12px] leading-relaxed text-black/60">
                      I would like to receive updates on the latest products and promotions
                      via email or other channels. See{" "}
                      <Link href="/privacy" className="underline hover:text-black">
                        Privacy Policy
                      </Link>
                      , which includes our Notice of Financial Incentive and the{" "}
                      <Link href="/terms" className="underline hover:text-black">
                        Terms and Conditions
                      </Link>
                      , for more information.
                    </span>
                  </label>
                </section>

                {/* 2. Shipping To */}
                <section className="space-y-4">
                  <div>
                    <h2 className="text-[20px] font-normal uppercase tracking-[0.06em] text-black sm:text-[22px]">
                      Shipping To
                    </h2>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.04em] text-black/50">
                      Sorry we cannot ship to P.O. Boxes.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3.5">
                      <FloatingField
                        id="first-name"
                        label="First Name *"
                        required
                        value={firstName}
                        onChange={setFirstName}
                      />
                      <FloatingField
                        id="last-name"
                        label="Last Name *"
                        required
                        value={lastName}
                        onChange={setLastName}
                      />
                    </div>

                    <FloatingField
                      id="address"
                      label="Address *"
                      required
                      value={address}
                      onChange={setAddress}
                    />

                    <FloatingField
                      id="apartment"
                      label="Apartment, Suite, Etc (optional)"
                      value={apartment}
                      onChange={setApartment}
                    />

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <FloatingField
                        id="city"
                        label="City *"
                        required
                        value={city}
                        onChange={setCity}
                        rightBadge={
                          <span className="flex items-center gap-1 text-[11px] text-black/40">
                            APO / FPO <HelpCircle className="size-3" />
                          </span>
                        }
                      />
                      <FloatingSelect
                        id="state"
                        label="State *"
                        required
                        value={state}
                        onChange={setState}
                        options={INDIAN_STATES}
                      />
                      <FloatingField
                        id="zipcode"
                        label="Zip Code *"
                        required
                        value={pincode}
                        onChange={setPincode}
                      />
                    </div>

                    <FloatingField
                      id="phone"
                      label="Phone Number (to ensure delivery) *"
                      type="tel"
                      required
                      value={phone}
                      onChange={setPhone}
                    />

                    {/* Free Gift Note Checkbox */}
                    <div className="pt-2">
                      <label className="flex cursor-pointer items-center gap-3 text-[13px] uppercase tracking-[0.04em] text-black/75 transition-colors hover:text-black">
                        <input
                          type="checkbox"
                          checked={giftNote}
                          onChange={(e) => setGiftNote(e.target.checked)}
                          className="size-4 accent-black"
                        />
                        Add a free gift note
                      </label>
                      {giftNote && (
                        <textarea
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          maxLength={300}
                          rows={3}
                          placeholder="Enter your personal message for the recipient..."
                          className="mt-3 w-full border border-black/25 bg-white p-3 text-[13px] leading-relaxed placeholder:text-black/35 focus:border-black focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                </section>

                {/* 3. Shipping Method */}
                <section className="space-y-4">
                  <div>
                    <h2 className="text-[20px] font-normal uppercase tracking-[0.06em] text-black sm:text-[22px]">
                      Shipping Method
                    </h2>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.04em] text-black/50">
                      Shipping options may update once an address is entered.
                    </p>
                  </div>

                  <ShippingMethodCards
                    selected={shippingMethodId}
                    onChange={setShippingMethodId}
                  />

                  <p className="text-[11px] leading-relaxed tracking-[0.02em] text-black/55">
                    Orders placed by 12:00 pm IST Monday-Friday usually process the same day.
                    Shipping price may update once the address is entered.
                  </p>
                </section>

                {/* Continue to Payment CTA */}
                <div>
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center bg-black text-[13px] font-medium uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 active:scale-[0.99]"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Payment View */
              <div className="space-y-8">
                <PaymentSection
                  selectedMethod={selectedPaymentMethod}
                  setSelectedMethod={setSelectedPaymentMethod}
                  total={finalTotal}
                />

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="flex h-12 w-full items-center justify-center gap-2 bg-black text-[13px] font-medium uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Securing Order…
                    </>
                  ) : (
                    `Place Order & Pay ${formatPrice(finalTotal)}`
                  )}
                </button>
              </div>
            )}

            {/* Footer Trust and Legal */}
            <div className="border-t border-black/15 pt-8 space-y-3 text-[12px] uppercase tracking-[0.04em] text-black/55">
              <p>
                30 day returns ·{" "}
                <Link href="/returns-policy" className="underline hover:text-black">
                  Return Policy
                </Link>
              </p>
              <p>
                Need help? Call us at{" "}
                <a href="tel:+919876543210" className="underline hover:text-black">
                  +91 98765 43210
                </a>{" "}
                or{" "}
                <Link href="/contact" className="underline hover:text-black">
                  Contact Us
                </Link>
              </p>
              <p className="text-[11px] normal-case text-black/50">
                By submitting my information I agree to the{" "}
                <Link href="/terms" className="underline hover:text-black">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-black">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Order Summary ─── */}
          <CheckoutRightSummary
            subtotal={subtotal}
            shippingCost={selectedShipping.price}
          />
        </div>
      </div>
    </main>
  )
}
