"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"

export type CustomerOrder = {
  id: string
  number: number
  reference: string
  status: "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED"
  total: number
  discount: number
  shipping: number
  discountCode: string | null
  paymentMethod: string | null
  shippingMethod: string | null
  shippingAddress: {
    name?: string
    address1?: string
    address2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    phone?: string
  } | null
  createdAt: string
  items: Array<{
    id: string
    title: string
    sku: string
    quantity: number
    unitPrice: string | number
    total: string | number
  }>
}

type AccountDashboardProps = {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
    phone: string | null
  }
  orders: CustomerOrder[]
}

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`
}

function formatStatus(status: CustomerOrder["status"]) {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed"
    case "FULFILLED":
      return "Dispatched"
    case "CANCELLED":
      return "Cancelled"
    case "PENDING":
    default:
      return "In Progress"
  }
}

export function AccountDashboard({ user, orders }: AccountDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"orders" | "details">("orders")
  const [isSigningOut, setIsSigningOut] = useState(false)

  const isStaff = user.role === "ADMIN" || user.role === "SUB_ADMIN"
  const latestAddress = orders[0]?.shippingAddress

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      toast.success("Signed out successfully.")
      router.replace("/")
      router.refresh()
    } catch {
      toast.error("Could not sign out. Please try again.")
      setIsSigningOut(false)
    }
  }

  return (
    <main className="min-h-[calc(100svh-var(--header-stack-height))] bg-white text-black">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
        {/* ─── Header ─── */}
        <section className="border-b border-black pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[12px] font-normal uppercase tracking-[0.06em] text-black/60">
                Account
              </p>
              <h1 className="mt-2 font-heading text-[22px] font-normal uppercase leading-[1.15] tracking-[0.02em] text-black sm:text-[28px]">
                {user.name || "Customer Account"}
              </h1>
              <p className="mt-2 text-[14px] font-normal leading-[1.4] text-black/60">
                {user.email}
                {isStaff ? " · Store Administrator" : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isStaff ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center border border-black bg-black px-5 text-[13px] font-normal uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-80"
                >
                  Admin Dashboard
                </Link>
              ) : null}

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex h-11 items-center justify-center border border-black bg-white px-5 text-[13px] font-normal uppercase tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
              >
                {isSigningOut ? "Signing Out…" : "Sign Out"}
              </button>
            </div>
          </div>

          {/* ─── Section Tabs ─── */}
          <nav className="mt-10 flex gap-8 border-t border-black/15 pt-5 text-[13px] uppercase tracking-[0.04em]">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`pb-2 text-left transition-colors border-b-2 ${
                activeTab === "orders"
                  ? "border-black font-normal text-black"
                  : "border-transparent text-black/45 hover:text-black"
              }`}
            >
              Orders ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`pb-2 text-left transition-colors border-b-2 ${
                activeTab === "details"
                  ? "border-black font-normal text-black"
                  : "border-transparent text-black/45 hover:text-black"
              }`}
            >
              Account Details
            </button>
          </nav>
        </section>

        {/* ─── Orders Tab ─── */}
        {activeTab === "orders" ? (
          <section className="mt-10">
            {orders.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-heading text-[20px] font-normal uppercase leading-[1.15] tracking-[0.02em] text-black sm:text-[24px]">
                  No Orders Yet
                </p>
                <p className="mx-auto mt-3 max-w-sm text-[14px] leading-[1.4] text-black/60">
                  When you complete a purchase, your order details and live tracking will appear here.
                </p>
                <Link
                  href="/shop"
                  className="mt-8 inline-flex h-12 items-center justify-center border border-black bg-black px-8 text-[14px] font-normal uppercase leading-none tracking-[0.04em] text-white transition-opacity hover:opacity-80"
                >
                  Discover the Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-[13px] font-normal uppercase tracking-[0.04em] text-black">
                    Recent Orders
                  </h2>
                  <Link
                    href="/track-order"
                    className="text-[12px] font-normal uppercase tracking-[0.04em] text-black/60 underline underline-offset-4 transition-colors hover:text-black"
                  >
                    Track by Order Number
                  </Link>
                </div>

                <div className="space-y-6">
                  {orders.map((order) => {
                    const isFulfilled = order.status === "FULFILLED"
                    const isCancelled = order.status === "CANCELLED"

                    return (
                      <article
                        key={order.id}
                        className="border border-black bg-white p-6 sm:p-8"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col gap-4 border-b border-black/15 pb-5 sm:flex-row sm:items-baseline sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-[16px] font-normal uppercase tracking-[0.04em] text-black">
                                {order.reference}
                              </span>
                              <span
                                className={`border px-2.5 py-0.5 text-[11px] font-normal uppercase tracking-[0.04em] ${
                                  isCancelled
                                    ? "border-black/30 bg-neutral-100 text-black/50"
                                    : isFulfilled
                                      ? "border-black bg-black text-white"
                                      : "border-black text-black"
                                }`}
                              >
                                {formatStatus(order.status)}
                              </span>
                            </div>
                            <p className="text-[13px] font-normal text-black/60">
                              Placed on{" "}
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <span className="text-[16px] font-normal text-black">
                              Total: {formatPrice(order.total)}
                            </span>
                            <p className="text-[12px] font-normal uppercase tracking-[0.04em] text-black/55">
                              {order.paymentMethod === "FREE_PROMO"
                                ? "Promotional Offer"
                                : order.paymentMethod?.toUpperCase() || "Prepaid"}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-black/10 py-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between py-4 text-[13px]"
                            >
                              <div className="space-y-1">
                                <p className="font-normal uppercase tracking-[0.02em] text-black sm:text-[14px]">
                                  {item.title}
                                </p>
                                <p className="text-[12px] text-black/60">
                                  SKU: {item.sku} · Quantity: {item.quantity}
                                </p>
                              </div>
                              <span className="text-[14px] font-normal text-black">
                                {formatPrice(Number(item.total))}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Tracking Link */}
                        <div className="flex flex-col gap-4 border-t border-black/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1 text-[13px] text-black/70">
                            {order.shippingAddress ? (
                              <p>
                                Shipping to:{" "}
                                <span className="text-black">
                                  {order.shippingAddress.name} · {order.shippingAddress.city},{" "}
                                  {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                </span>
                              </p>
                            ) : null}
                            {order.discountCode ? (
                              <p className="text-[12px] uppercase tracking-[0.02em] text-black/60">
                                Coupon applied:{" "}
                                <span className="text-black">{order.discountCode}</span>
                              </p>
                            ) : null}
                          </div>

                          <div>
                            <Link
                              href={`/track-order?order=${order.number}&email=${encodeURIComponent(
                                user.email
                              )}`}
                              className="inline-flex h-10 items-center justify-center border border-black bg-white px-5 text-[12px] font-normal uppercase tracking-[0.04em] text-black transition-colors hover:bg-black hover:text-white sm:text-[13px]"
                            >
                              Track Order
                            </Link>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        ) : null}

        {/* ─── Details Tab ─── */}
        {activeTab === "details" ? (
          <section className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Account Info */}
            <div className="border border-black bg-white p-6 sm:p-8">
              <h2 className="border-b border-black/15 pb-4 text-[13px] font-normal uppercase tracking-[0.04em] text-black">
                Personal Information
              </h2>

              <dl className="mt-6 space-y-5 text-[13px]">
                <div>
                  <dt className="text-[11px] font-normal uppercase tracking-[0.06em] text-black/60">
                    Full Name
                  </dt>
                  <dd className="mt-1 text-[14px] font-normal text-black">
                    {user.name || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-normal uppercase tracking-[0.06em] text-black/60">
                    Email Address
                  </dt>
                  <dd className="mt-1 text-[14px] font-normal text-black">
                    {user.email}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-normal uppercase tracking-[0.06em] text-black/60">
                    Phone Number
                  </dt>
                  <dd className="mt-1 text-[14px] font-normal text-black">
                    {user.phone || latestAddress?.phone || "Not specified"}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-normal uppercase tracking-[0.06em] text-black/60">
                    Sign-in Method
                  </dt>
                  <dd className="mt-1 text-[14px] font-normal text-black">
                    {user.image?.includes("google") ? "Google Account (Verified)" : "Email & Password"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Default Address */}
            <div className="border border-black bg-white p-6 sm:p-8">
              <h2 className="border-b border-black/15 pb-4 text-[13px] font-normal uppercase tracking-[0.04em] text-black">
                Delivery Details
              </h2>

              {latestAddress ? (
                <div className="mt-6 space-y-2 text-[14px] font-normal leading-[1.5] text-black">
                  <p className="font-normal uppercase tracking-[0.02em]">
                    {latestAddress.name}
                  </p>
                  <p className="text-black/80">{latestAddress.address1}</p>
                  {latestAddress.address2 ? (
                    <p className="text-black/80">{latestAddress.address2}</p>
                  ) : null}
                  <p className="text-black/80">
                    {latestAddress.city}, {latestAddress.state} - {latestAddress.postalCode}
                  </p>
                  <p className="text-black/80">{latestAddress.country || "India"}</p>
                  {latestAddress.phone ? (
                    <p className="pt-2 text-[13px] text-black/60">
                      Contact: {latestAddress.phone}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mt-6 text-[13px] text-black/60">
                  <p>No delivery address on record yet.</p>
                  <p className="mt-1 text-[12px] text-black/50">
                    Your shipping address will be automatically saved from your checkout details.
                  </p>
                </div>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
