"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
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
import { toast } from "sonner"

import {
  placeOrderAction,
  createRazorpayOrderAction,
  confirmRazorpayOrderAction,
  validatePromoCodeAction,
} from "@/app/actions/checkout"
import { automaticDiscountFor } from "@/lib/checkout-rules"
import { loadRazorpayCheckoutScript } from "@/lib/razorpay-client"
import { getSessionId, track } from "@/lib/analytics-client"
import { usePageContent } from "@/lib/site-content-context"

export type AppliedPromo = {
  code: string
  title: string
  amount: number
  freeShipping: boolean
  discountType: string
  valueType: string
  value: number
  description: string
}

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
    label: "Free Delivery",
    description: "Complimentary shipping for all orders",
    price: 0,
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
        className="peer h-[54px] w-full border border-black/25 bg-white px-3.5 pt-4 text-[14px] font-normal tracking-[0.01em] text-black placeholder-transparent outline-none transition focus:border-black"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-black/45 transition-all peer-focus:top-3 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.04em] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.04em]"
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
        className="peer h-[54px] w-full appearance-none border border-black/25 bg-white px-3.5 pt-4 text-[14px] font-normal tracking-[0.01em] text-black outline-none transition focus:border-black"
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
        className={`pointer-events-none absolute left-3.5 text-[14px] text-black/45 transition-all ${
          value
            ? "top-3 text-[11px] uppercase tracking-[0.04em] text-black/60"
            : "top-1/2 -translate-y-1/2"
        }`}
      >
        {label}
      </label>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-black/40" />
    </div>
  )
}


function PaymentSection({
  billingSame,
  setBillingSame,
  isFreeOrder = false,
}: {
  billingSame: boolean
  setBillingSame: (v: boolean) => void
  isFreeOrder?: boolean
}) {
  const page = usePageContent("checkoutPage")

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-3">
        <h2 className="text-[20px] font-normal uppercase tracking-[0.04em] text-black sm:text-[22px]">
          {page.text("payment", "heading")}
        </h2>
        <p className="text-[12px] uppercase tracking-[0.04em] text-black/50">
          All transactions are secure and encrypted.
        </p>
      </div>

      {isFreeOrder ? (
        <div className="border border-black/25 bg-black/[0.02] p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-black" />
            <div>
              <span className="text-[13px] font-normal uppercase tracking-[0.04em] text-black">
                100% Free Order
              </span>
              <p className="text-[11px] text-black/60">
                Your applied coupon covers the full order balance. No payment gateway required.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Unified Razorpay Secure Payment Card */
        <div className="border border-black/25 bg-white">
          <div className="flex items-center justify-between p-4 bg-black/[0.02]">
            <div className="flex items-center gap-3.5">
              <div className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-black">
                <span className="size-2 rounded-full bg-black" />
              </div>
              <div>
                <span className="text-[13px] font-normal uppercase tracking-[0.04em] text-black">
                  Razorpay Secure
                </span>
                <p className="text-[11px] text-black/50">
                  UPI (Google Pay, PhonePe, Paytm), Cards, Net Banking &amp; Wallets
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="size-4 text-black/60" />
              <CreditCard className="size-4 text-black/60" />
              <Building2 className="size-4 text-black/60" />
            </div>
          </div>

          <div className="border-t border-black/10 bg-neutral-50 p-4 text-[12px] leading-relaxed text-black/70">
            <p>
              After clicking <strong>Pay with Razorpay</strong>, the secure Razorpay checkout window will open with all payment options (Google Pay, PhonePe, Paytm, QR Code, Debit/Credit Cards, and Net Banking).
            </p>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-between border border-black/15 bg-black/[0.02] px-4 py-3 text-[12px] text-black/75">
        <div className="flex items-center gap-2">
          <Lock className="size-3.5 text-black/70" />
          <span className="font-normal uppercase tracking-[0.04em]">100% Encrypted &amp; Secure Checkout</span>
        </div>
        <span className="text-[11px] uppercase tracking-[0.04em] text-black/50">Razorpay Live</span>
      </div>

      {/* Billing Address Option */}
      <div className="space-y-3 pt-2">
        <h3 className="text-[14px] font-normal uppercase tracking-[0.04em] text-black">
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
type CheckoutRightSummaryProps = {
  subtotal: number
  shippingCost: number
  automaticDiscount: number
  promoDiscount: number
  appliedPromo: AppliedPromo | null
  onApplyPromo: (code: string) => Promise<boolean>
  onRemovePromo: () => void
  isApplyingPromo: boolean
}

function CheckoutRightSummary({
  subtotal,
  shippingCost,
  automaticDiscount,
  promoDiscount,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  isApplyingPromo,
}: CheckoutRightSummaryProps) {
  const page = usePageContent("checkoutPage")
  const { cart } = useCart()
  const [bagOpen, setBagOpen] = useState(true)
  const [promoOpen, setPromoOpen] = useState(Boolean(appliedPromo))
  const [inputCode, setInputCode] = useState("")

  const totalDiscount = appliedPromo ? promoDiscount : automaticDiscount
  const total = Math.max(0, subtotal - totalDiscount + shippingCost)
  const installment = Math.round(total / 4)

  const totalItemCount = cart.reduce((s, i) => s + i.quantity, 0)

  const handleApplyClick = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim() || isApplyingPromo) return
    const success = await onApplyPromo(inputCode.trim())
    if (success) {
      setInputCode("")
    }
  }

  return (
    <aside className="border border-black/15 bg-white p-6 sm:p-7 lg:sticky lg:top-8">
      {/* Collapsible Shopping Bag Preview */}
      <div>
        <button
          type="button"
          onClick={() => setBagOpen((b) => !b)}
          className="flex w-full items-center justify-between text-[15px] font-normal uppercase tracking-[0.04em] text-black transition-opacity hover:opacity-75"
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
                  <span className="absolute right-0 top-0 flex size-4 items-center justify-center bg-black text-[11px] font-normal text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-[12px] font-normal uppercase tracking-[0.04em] text-black">
                    {item.title}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.04em] text-black/55">
                    Size: {item.size}
                  </p>
                </div>
                <p className="text-[13px] font-normal text-black">
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

        {!appliedPromo && automaticDiscount > 0 && (
          <div className="flex items-center justify-between text-black font-normal">
            <span className="uppercase tracking-[0.04em]">Extra 10% off ₹2,999+</span>
            <span>-{formatPrice(automaticDiscount)}</span>
          </div>
        )}

        {appliedPromo && promoDiscount > 0 && (
          <div className="flex items-center justify-between text-black font-normal">
            <span className="flex items-center gap-1.5 uppercase tracking-[0.04em]">
              <Tag className="size-3" />
              Coupon ({appliedPromo.code})
            </span>
            <span className="text-black">-{formatPrice(promoDiscount)}</span>
          </div>
        )}

        {appliedPromo && appliedPromo.freeShipping && (
          <div className="flex items-center justify-between text-black font-normal">
            <span className="flex items-center gap-1.5 uppercase tracking-[0.04em]">
              <Tag className="size-3" />
              Coupon ({appliedPromo.code})
            </span>
            <span className="text-black uppercase">Free Shipping</span>
          </div>
        )}

        <div className="flex items-center justify-between text-black/80">
          <span className="uppercase tracking-[0.04em]">GST (Taxes)</span>
          <span className="text-black/60 font-mono text-[12px]">
            Included ({formatPrice(Math.max(0, Math.round(((subtotal - totalDiscount) * 12) / 112)))})
          </span>
        </div>

        <div className="flex items-center justify-between text-black/80">
          <span className="uppercase tracking-[0.04em]">Shipping</span>
          <span className="font-normal text-black uppercase tracking-[0.04em]">
            {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
          </span>
        </div>
      </div>

      {/* Promo Code Accordion */}
      {page.show("promo") ? (
        <div className="mt-5 border-t border-black/15 pt-4">
          <button
            type="button"
            onClick={() => setPromoOpen((p) => !p)}
            className="flex w-full items-center justify-between text-[13px] uppercase tracking-[0.04em] text-black/60 transition-colors hover:text-black"
          >
            <span className="flex items-center gap-2">
              <Tag className="size-3.5" />
              {page.text("promo", "label")}
            </span>
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${
                promoOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {promoOpen && (
            <div className="mt-3">
              {appliedPromo ? (
                <div className="flex items-center justify-between border border-black/25 bg-neutral-50 px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-black" />
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-black">
                        {appliedPromo.code}
                      </p>
                      <p className="text-[11px] text-black/60">
                        {appliedPromo.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onRemovePromo}
                    className="text-[11px] uppercase tracking-[0.04em] text-black/60 underline hover:text-black"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyClick} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    disabled={isApplyingPromo}
                    className="flex-1 border border-black/25 px-3 py-2 text-[12px] uppercase tracking-[0.04em] placeholder:normal-case placeholder:text-black/35 focus:border-black focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingPromo || !inputCode.trim()}
                    className="flex items-center justify-center min-w-[72px] border border-black bg-black px-4 text-[12px] uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-85 disabled:opacity-50"
                  >
                    {isApplyingPromo ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Total */}
      <div className="mt-5 border-t border-black pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-normal uppercase tracking-[0.04em] text-black">
            Total
          </span>
          <span className="text-[22px] font-normal tracking-[0.02em] text-black">
            {formatPrice(total)}
          </span>
        </div>

        {page.show("installments") ? (
          <p className="mt-2 text-[11px] leading-[1.5] tracking-[0.02em] text-black/65">
            4 payments of <strong className="text-black">{formatPrice(installment)}</strong> with UPI or Netbanking ⓘ
          </p>
        ) : null}
      </div>

      {/* Authenticity & Perks */}
      {page.show("trust") && page.lines("trust", "lines").length > 0 ? (
        <div className="mt-8 space-y-2 border-t border-black/15 pt-5 text-center text-[11px] uppercase tracking-[0.04em] text-black/55">
          {page.lines("trust", "lines").map((line, index) =>
            index === 0 ? (
              <div key={line} className="flex items-center justify-center gap-1.5 text-black/80 font-normal">
                <Lock className="size-3.5" />
                <span>{line}</span>
              </div>
            ) : (
              <p key={line}>{line}</p>
            ),
          )}
        </div>
      ) : null}
    </aside>
  )
}

/* ─────────────────────────────────────────────
   Main Checkout & Payment Page
───────────────────────────────────────────── */
export function CheckoutPage() {
  const page = usePageContent("checkoutPage")
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [billingSame, setBillingSame] = useState(true)
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  useEffect(() => {
    if (cart.length > 0) {
      track("BEGIN_CHECKOUT", {
        payload: { items: cart.reduce((sum, item) => sum + item.quantity, 0) },
      })
    }
    // Only once per checkout visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedShipping =
    SHIPPING_OPTIONS.find((o) => o.id === shippingMethodId) ?? SHIPPING_OPTIONS[0]

  const subtotal = cart.reduce(
    (sum, item) => sum + parseAmount(item.price) * item.quantity,
    0
  )
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const automaticDiscount = automaticDiscountFor(subtotal)
  const promoDiscount = appliedPromo
    ? appliedPromo.valueType === "PERCENTAGE"
      ? Math.round((subtotal * appliedPromo.value) / 100)
      : Math.min(subtotal, Math.round(appliedPromo.value))
    : 0
  const totalDiscount = appliedPromo ? promoDiscount : automaticDiscount
  const shippingCost = appliedPromo?.freeShipping ? 0 : selectedShipping.price
  const finalTotal = Math.max(0, subtotal - totalDiscount + shippingCost)

  const handleApplyPromo = async (code: string): Promise<boolean> => {
    setIsApplyingPromo(true)
    try {
      const res = await validatePromoCodeAction(code, subtotal, totalQuantity)
      if (!res.success) {
        toast.error(res.message)
        setIsApplyingPromo(false)
        return false
      }
      setAppliedPromo(res)
      toast.success(`Coupon "${res.code}" applied!`)
      setIsApplyingPromo(false)
      return true
    } catch (err: any) {
      toast.error(err?.message || "Failed to apply coupon.")
      setIsApplyingPromo(false)
      return false
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    toast.info("Coupon removed.")
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Preload Razorpay Checkout script when entering payment step
  useEffect(() => {
    if (step === "payment") {
      loadRazorpayCheckoutScript().catch(() => {})
    }
  }, [step])

  const handlePlaceOrder = async () => {
    if (isSubmitting) return

    if (!email || !firstName || !address || !city || !state || !pincode || !phone) {
      toast.error("Please fill in all required shipping details.")
      setStep("details")
      return
    }

    setIsSubmitting(true)

    const basePayload = {
      email,
      firstName,
      lastName,
      phone,
      address1: address,
      address2: apartment,
      city,
      state,
      postalCode: pincode,
      country: "India",
      shippingMethod: shippingMethodId,
      paymentMethod: finalTotal === 0 ? "FREE_PROMO" : "razorpay",
      promoCode: appliedPromo?.code ? appliedPromo.code : undefined,
      giftMessage: giftNote && giftMessage ? giftMessage : undefined,
      newsletter,
      analyticsSessionId: getSessionId(),
      items: cart.map((item) => ({
        productId: item.id,
        size: item.size,
        quantity: item.quantity,
      })),
    }

    // Free Order via 100% discount promo coupon
    if (finalTotal === 0) {
      try {
        const orderRes = await placeOrderAction({
          ...basePayload,
          paymentMethod: "FREE_PROMO",
        })
        if (!orderRes.success) {
          setIsSubmitting(false)
          toast.error(orderRes.message)
          return
        }

        setOrderId(orderRes.reference)
        setIsSubmitting(false)
        setOrderComplete(true)
        clearCart()
        toast.success("Order confirmed successfully!")
        return
      } catch (err: any) {
        console.error("Free order confirmation failed:", err)
        setIsSubmitting(false)
        toast.error(err?.message || "Could not confirm order. Please try again.")
        return
      }
    }

    // Online Payment via Razorpay Live Gateway
    try {
      const scriptReady = await loadRazorpayCheckoutScript()
      if (!scriptReady || !window.Razorpay) {
        setIsSubmitting(false)
        toast.error("Could not load payment gateway. Please check your internet connection and try again.")
        return
      }

      const createRes = await createRazorpayOrderAction(basePayload)
      if (!createRes.success) {
        setIsSubmitting(false)
        toast.error(createRes.message)
        return
      }

      const rzp = new window.Razorpay({
        key: createRes.keyId,
        amount: createRes.amount,
        currency: createRes.currency,
        name: "SUOS",
        description: `Order Checkout (${cart.reduce((s, i) => s + i.quantity, 0)} items)`,
        image: "/logo.svg",
        order_id: createRes.razorpayOrderId,
        prefill: {
          name: `${firstName} ${lastName}`.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        notes: {
          city,
          state,
          pincode,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setIsSubmitting(false)
            toast.info("Payment window closed. You can complete your order anytime.")
          },
        },
        handler: async (response) => {
          try {
            const confirmRes = await confirmRazorpayOrderAction({
              ...basePayload,
              paymentMethod: "razorpay",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            if (!confirmRes.success) {
              setIsSubmitting(false)
              toast.error(confirmRes.message)
              return
            }

            setOrderId(confirmRes.reference)
            setIsSubmitting(false)
            setOrderComplete(true)
            clearCart()
            toast.success("Payment verified! Order confirmed.")
          } catch (err) {
            console.error("Payment confirmation failed:", err)
            setIsSubmitting(false)
            toast.error(
              `Payment was received (Ref: ${response.razorpay_payment_id}), but confirmation encountered an issue. SUOS support is investigating.`
            )
          }
        },
      })

      rzp.on("payment.failed", (errorData: any) => {
        setIsSubmitting(false)
        const reason =
          errorData?.error?.description || "Payment was declined. Please try another card or UPI."
        toast.error(reason)
      })

      rzp.open()
    } catch (err) {
      console.error("Razorpay initiation error:", err)
      setIsSubmitting(false)
      toast.error("Unable to initiate payment with Razorpay. Please try again.")
    }
  }

  // Order Confirmed Screen
  if (orderComplete) {
    return (
      <main className="min-h-screen bg-white text-black">
        {/* Minimal Checkout Header */}
        <header className="border-b border-black/15 px-6 py-4 sm:px-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link
              href="/"
              aria-label="SUOS home"
              className="transition-opacity hover:opacity-70"
            >
              <Image
                src="/logo.svg"
                alt="SUOS"
                width={160}
                height={74}
                priority
                className="block h-auto w-[5.8rem] sm:w-[6.8rem]"
              />
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-black text-white">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="mt-6 text-[24px] font-normal uppercase leading-[1.15] tracking-[0.02em] text-black sm:text-[28px]">
            {page.text("thankYou", "heading")}
          </h1>
          <p className="mt-2 text-[14px] uppercase tracking-[0.04em] text-black/60">
            Order Reference: <strong className="text-black">{orderId}</strong>
          </p>
          <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.5] text-black/60">
            {page.text("thankYou", "text")}{" "}
            <strong className="text-black">{email || "your email"}</strong>.
          </p>

          <div className="mt-10 border border-black/15 bg-neutral-50 p-6 text-left">
            <h3 className="text-[13px] font-normal uppercase tracking-[0.04em] text-black">
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
            <p className="mt-3 text-[12px] uppercase tracking-[0.04em] text-black font-normal">
              Estimated Delivery: {selectedShipping.label} (3–5 business days)
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/collections"
              className="inline-flex h-12 w-full items-center justify-center bg-black px-8 text-[14px] uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 w-full items-center justify-center border border-black px-8 text-[14px] uppercase tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white sm:w-auto"
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
            aria-label="SUOS home"
            className="transition-opacity hover:opacity-70"
          >
            <Image
              src="/logo.svg"
              alt="SUOS"
              width={160}
              height={74}
              priority
              className="block h-auto w-[5.8rem] sm:w-[6.8rem]"
            />
          </Link>

          {/* Help & Bag Icon with Item Count */}
          <div className="flex items-center gap-5 text-[12px] tracking-[0.04em] text-black/60">
            {page.show("help") ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span>{page.text("help", "text")}</span>
                <a href={`mailto:${page.text("help", "email")}`} className="text-black underline underline-offset-2 hover:opacity-75">
                  {page.text("help", "link")}
                </a>
              </div>
            ) : null}

            {/* Shopping Bag Icon with Count Badge */}
            <Link
              href="/cart"
              className="relative flex items-center p-1 text-black transition-opacity hover:opacity-70"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-black text-[11px] font-normal text-white">
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


            {/* Back button if in payment step */}
            {step === "payment" && (
              <button
                type="button"
                onClick={() => setStep("details")}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.04em] text-black/60 transition-colors hover:text-black"
              >
                <ArrowLeft className="size-3.5" /> Back to Shipping Details
              </button>
            )}

            {step === "details" ? (
              <form onSubmit={handleContinueToPayment} className="space-y-10">
                {/* 1. Email Address */}
                <section className="space-y-4">
                  <h2 className="text-[20px] font-normal uppercase tracking-[0.04em] text-black sm:text-[22px]">
                    {page.text("contact", "heading")}
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
                    <span className="text-[12px] leading-[1.5] text-black/60">
                      {page.text("contact", "newsletter")}
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
                    <h2 className="text-[20px] font-normal uppercase tracking-[0.04em] text-black sm:text-[22px]">
                      {page.text("shipping", "heading")}
                    </h2>
                    {page.text("shipping", "note") ? (
                      <p className="mt-1 text-[12px] uppercase tracking-[0.04em] text-black/50">
                        {page.text("shipping", "note")}
                      </p>
                    ) : null}
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
                    {page.show("gift") ? (
                    <div className="pt-2">
                      <label className="flex cursor-pointer items-center gap-3 text-[13px] uppercase tracking-[0.04em] text-black/75 transition-colors hover:text-black">
                        <input
                          type="checkbox"
                          checked={giftNote}
                          onChange={(e) => setGiftNote(e.target.checked)}
                          className="size-4 accent-black"
                        />
                        {page.text("gift", "label")}
                      </label>
                      {giftNote && (
                        <textarea
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          maxLength={300}
                          rows={3}
                          placeholder="Enter your personal message for the recipient..."
                          className="mt-3 w-full border border-black/25 bg-white p-3 text-[13px] leading-[1.5] placeholder:text-black/35 focus:border-black focus:outline-none"
                        />
                      )}
                    </div>
                    ) : null}
                  </div>
                </section>

                {/* Continue to Payment CTA */}
                <div>
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center bg-black text-[14px] font-normal uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-90 active:scale-[0.99]"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Payment View */
              <div className="space-y-8">
                <PaymentSection
                  billingSame={billingSame}
                  setBillingSame={setBillingSame}
                  isFreeOrder={finalTotal === 0}
                />

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="flex h-12 w-full items-center justify-center gap-2 bg-black text-[14px] font-normal uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Securing Order…
                    </>
                  ) : finalTotal === 0 ? (
                    "Complete Order (Free)"
                  ) : (
                    `Pay ${formatPrice(finalTotal)} with Razorpay`
                  )}
                </button>
              </div>
            )}

            {/* Footer Trust and Legal */}
            {page.show("footerLinks") ? (
            <div className="border-t border-black/15 pt-8 space-y-3 text-[12px] uppercase tracking-[0.04em] text-black/55">
              <p>
                {page.text("footerLinks", "returns")} ·{" "}
                <Link href="/returns-policy" className="underline hover:text-black">
                  Return Policy
                </Link>
              </p>
              <p>
                Need help?{" "}
                <a href="mailto:info@suos.in" className="underline hover:text-black">
                  Email us
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
            ) : null}
          </div>

          {/* ─── RIGHT COLUMN: Order Summary ─── */}
          <CheckoutRightSummary
            subtotal={subtotal}
            shippingCost={shippingCost}
            automaticDiscount={automaticDiscount}
            promoDiscount={promoDiscount}
            appliedPromo={appliedPromo}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            isApplyingPromo={isApplyingPromo}
          />
        </div>
      </div>
    </main>
  )
}
