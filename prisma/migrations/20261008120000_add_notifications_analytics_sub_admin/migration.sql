-- AlterEnum Role
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUB_ADMIN' BEFORE 'ADMIN';

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'WHATSAPP');
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');
CREATE TYPE "AnalyticsEventType" AS ENUM ('PAGE_VIEW', 'PRODUCT_VIEW', 'ADD_TO_CART', 'BEGIN_CHECKOUT', 'PURCHASE', 'SEARCH', 'CUSTOM');
CREATE TYPE "ContactMessageStatus" AS ENUM ('NEW', 'READ', 'RESOLVED');

-- AlterTable users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "whatsappMarketingSubscribed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- AlterTable orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingMethod" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discountCode" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customerNote" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'ADMIN';
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "analyticsSessionId" TEXT;
CREATE INDEX IF NOT EXISTS "orders_email_idx" ON "orders"("email");

-- CreateTable notifications
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "template" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "providerId" TEXT,
    "payload" JSONB,
    "orderId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "notifications_orderId_idx" ON "notifications"("orderId");
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX "notifications_status_createdAt_idx" ON "notifications"("status", "createdAt");
CREATE INDEX "notifications_channel_createdAt_idx" ON "notifications"("channel", "createdAt");
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable analytics_sessions
CREATE TABLE "analytics_sessions" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "userId" TEXT,
    "landingPath" TEXT NOT NULL,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "userAgent" TEXT,
    "device" TEXT NOT NULL DEFAULT 'desktop',
    "country" TEXT,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "orderId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_sessions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "analytics_sessions_startedAt_idx" ON "analytics_sessions"("startedAt");
CREATE INDEX "analytics_sessions_visitorId_idx" ON "analytics_sessions"("visitorId");
CREATE INDEX "analytics_sessions_userId_idx" ON "analytics_sessions"("userId");
CREATE INDEX "analytics_sessions_device_startedAt_idx" ON "analytics_sessions"("device", "startedAt");

-- CreateTable analytics_events
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "analytics_events_sessionId_createdAt_idx" ON "analytics_events"("sessionId", "createdAt");
CREATE INDEX "analytics_events_type_createdAt_idx" ON "analytics_events"("type", "createdAt");
CREATE INDEX "analytics_events_path_createdAt_idx" ON "analytics_events"("path", "createdAt");
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "analytics_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable search_logs
CREATE TABLE "search_logs" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "normalized" TEXT NOT NULL,
    "resultCount" INTEGER NOT NULL,
    "suggestion" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "search_logs_normalized_createdAt_idx" ON "search_logs"("normalized", "createdAt");
CREATE INDEX "search_logs_createdAt_idx" ON "search_logs"("createdAt");

-- CreateTable contact_messages
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactMessageStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "contact_messages_status_createdAt_idx" ON "contact_messages"("status", "createdAt");
