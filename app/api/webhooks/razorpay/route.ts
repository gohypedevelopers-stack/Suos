import { NextRequest, NextResponse } from "next/server"

import { getPrisma } from "@/lib/server/db"
import { getRazorpayEnv } from "@/lib/server/env"
import { notifyOrderEvent } from "@/lib/server/notifications"
import { verifyWebhookSignature } from "@/lib/server/services/razorpay"

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-razorpay-signature")

    const env = getRazorpayEnv()
    if (env.RAZORPAY_WEBHOOK_SECRET) {
      if (!signature || !verifyWebhookSignature({ body: rawBody, signature })) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
      }
    }

    const payload = JSON.parse(rawBody)
    const event = payload?.event

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload?.payload?.payment?.entity
      const orderEntity = payload?.payload?.order?.entity

      const razorpayOrderId = orderEntity?.id || paymentEntity?.order_id
      const razorpayPaymentId = paymentEntity?.id

      if (razorpayOrderId) {
        const prisma = getPrisma()

        // Find order that matches this Razorpay Order ID in taxDetails
        const order = await prisma.order.findFirst({
          where: {
            taxDetails: {
              path: ["payment", "razorpayOrderId"],
              equals: razorpayOrderId,
            },
          },
          select: { id: true, status: true, number: true },
        })

        if (order && order.status === "PENDING") {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "CONFIRMED",
              taxDetails: {
                payment: {
                  razorpayOrderId,
                  razorpayPaymentId: razorpayPaymentId || null,
                  webhookVerifiedAt: new Date().toISOString(),
                },
              },
            },
          })

          await notifyOrderEvent(order.id, "ORDER_PLACED", { notifyAdmin: true })
        }
      }
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("[razorpay-webhook] Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
