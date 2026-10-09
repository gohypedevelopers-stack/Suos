-- AlterEnum AnalyticsEventType: heatmap event types
ALTER TYPE "AnalyticsEventType" ADD VALUE IF NOT EXISTS 'CLICK' BEFORE 'CUSTOM';
ALTER TYPE "AnalyticsEventType" ADD VALUE IF NOT EXISTS 'SCROLL' BEFORE 'CUSTOM';
ALTER TYPE "AnalyticsEventType" ADD VALUE IF NOT EXISTS 'MOVE' BEFORE 'CUSTOM';

-- AlterTable analytics_sessions: traffic attribution + recording flag
ALTER TABLE "analytics_sessions" ADD COLUMN IF NOT EXISTS "channel" TEXT NOT NULL DEFAULT 'direct';
ALTER TABLE "analytics_sessions" ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "analytics_sessions" ADD COLUMN IF NOT EXISTS "medium" TEXT;
ALTER TABLE "analytics_sessions" ADD COLUMN IF NOT EXISTS "fbclid" TEXT;
ALTER TABLE "analytics_sessions" ADD COLUMN IF NOT EXISTS "gclid" TEXT;
ALTER TABLE "analytics_sessions" ADD COLUMN IF NOT EXISTS "recorded" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "analytics_sessions_channel_startedAt_idx" ON "analytics_sessions"("channel", "startedAt");

-- CreateTable session_recordings
CREATE TABLE "session_recordings" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "userId" TEXT,
    "device" TEXT NOT NULL DEFAULT 'desktop',
    "userAgent" TEXT,
    "country" TEXT,
    "firstPath" TEXT NOT NULL,
    "pagePaths" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEventAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "chunkCount" INTEGER NOT NULL DEFAULT 0,
    "byteSize" INTEGER NOT NULL DEFAULT 0,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "orderId" TEXT,

    CONSTRAINT "session_recordings_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "session_recordings_startedAt_idx" ON "session_recordings"("startedAt");
CREATE INDEX "session_recordings_device_startedAt_idx" ON "session_recordings"("device", "startedAt");
CREATE INDEX "session_recordings_converted_startedAt_idx" ON "session_recordings"("converted", "startedAt");
CREATE INDEX "session_recordings_visitorId_idx" ON "session_recordings"("visitorId");

-- CreateTable session_recording_chunks
CREATE TABLE "session_recording_chunks" (
    "id" TEXT NOT NULL,
    "recordingId" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "eventCount" INTEGER NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_recording_chunks_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "session_recording_chunks_recordingId_seq_key" ON "session_recording_chunks"("recordingId", "seq");
ALTER TABLE "session_recording_chunks" ADD CONSTRAINT "session_recording_chunks_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "session_recordings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable site_content
CREATE TABLE "site_content" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("key")
);
