"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Crop, Eye, Monitor, Smartphone } from "lucide-react"

import { BannerMediaPreview } from "@/components/admin-dashboard/banner-media-preview"
import { isVideoMedia } from "@/lib/banner-media"
import {
  computeCrop,
  getBannerFrames,
  judgeSharpness,
  recommendedSize,
  type BannerFrame,
  type CropInfo,
} from "@/lib/banner-frames"
import type { BannerPlacement, BannerTextAlignment } from "@/lib/validations/banner"
import { cn } from "@/lib/utils"

type MediaSize = { src: string; w: number; h: number }

/** Natural pixel size of an image or video (null while loading / unknown). */
function useMediaSize(src: string | null): { w: number; h: number } | null {
  const [size, setSize] = useState<MediaSize | null>(null)

  useEffect(() => {
    if (!src) return
    let cancelled = false
    const done = (w: number, h: number) => {
      if (!cancelled && w > 0 && h > 0) setSize({ src, w, h })
    }
    if (isVideoMedia(src)) {
      const video = document.createElement("video")
      video.preload = "metadata"
      video.muted = true
      video.onloadedmetadata = () => done(video.videoWidth, video.videoHeight)
      video.src = src
      return () => {
        cancelled = true
        video.removeAttribute("src")
        video.load()
      }
    }
    const img = new window.Image()
    img.onload = () => done(img.naturalWidth, img.naturalHeight)
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  // Ignore a stale size from the previous file until the new one has loaded.
  return size && size.src === src ? { w: size.w, h: size.h } : null
}

/** Text the storefront draws on top of the banner, for the placements that show it. */
function TextOverlay({
  placement,
  device,
  title,
  subtitle,
  ctaText,
  textAlignment,
}: {
  placement: BannerPlacement
  device: "desktop" | "mobile"
  title: string
  subtitle: string
  ctaText: string
  textAlignment: BannerTextAlignment
}) {
  const small = device === "mobile"

  // Collection tiles: the subtitle is the white label in the bottom-left corner.
  if (placement === "DENIM_CAROUSEL") {
    return subtitle ? (
      <span className={cn("absolute bottom-[4%] left-[6%] z-10 font-medium uppercase text-white drop-shadow", small ? "text-[8px]" : "text-[11px]")}>
        {subtitle}
      </span>
    ) : null
  }

  if (!["HERO", "FEATURE", "MIDDLE", "BOTTOM"].includes(placement) || !(title || subtitle || ctaText)) {
    return null
  }

  const isHero = placement === "HERO"
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col px-[6%]",
        isHero ? "justify-end pb-[8%]" : "justify-center",
        !isHero || textAlignment === "CENTER"
          ? "items-center text-center"
          : textAlignment === "RIGHT"
            ? "items-end text-right"
            : "items-start text-left",
      )}
    >
      {title ? (
        <p className={cn("uppercase leading-tight text-white drop-shadow", small ? "text-[8px]" : "text-[12px]")}>{title}</p>
      ) : null}
      {subtitle ? (
        <p className={cn("mt-0.5 uppercase text-white/90", small ? "text-[6px]" : "text-[8px]")}>{subtitle}</p>
      ) : null}
      {ctaText ? (
        <span
          className={cn(
            "mt-1.5 inline-flex border border-white/85 bg-black/30 uppercase text-white",
            small ? "px-1.5 py-0.5 text-[6px]" : "px-2 py-1 text-[8px]",
          )}
        >
          {ctaText}
        </span>
      ) : null}
    </div>
  )
}

/** The slot exactly as the storefront crops it (object-fit: cover, centred). */
function SiteFrame({
  src,
  frame,
  overlay,
  overlayKind,
  children,
}: {
  src: string
  frame: BannerFrame
  overlay: number
  overlayKind: "hero" | "flat" | "none"
  children?: React.ReactNode
}) {
  return (
    <div className="relative w-full overflow-hidden bg-neutral-900" style={{ aspectRatio: frame.aspect }}>
      <BannerMediaPreview src={src} alt="Preview" sizes="480px" />
      {overlayKind === "hero" ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60"
          style={{ opacity: Math.max(0.2, overlay / 100) }}
        />
      ) : overlayKind === "flat" && overlay > 0 ? (
        <div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: overlay / 100 }} />
      ) : null}
      {children}
    </div>
  )
}

/** The whole uploaded file, with the parts the site cuts off dimmed. */
function CropFrame({ src, size, crop }: { src: string; size: { w: number; h: number }; crop: CropInfo }) {
  return (
    <div className="relative w-full overflow-hidden bg-neutral-900" style={{ aspectRatio: size.w / size.h }}>
      <BannerMediaPreview src={src} alt="Full image" sizes="480px" className="object-contain" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
        style={{ width: `${crop.visibleW * 100}%`, height: `${crop.visibleH * 100}%` }}
      />
    </div>
  )
}

function FrameReport({
  device,
  frame,
  size,
  crop,
  usingDesktopImage,
}: {
  device: "desktop" | "mobile"
  frame: BannerFrame
  size: { w: number; h: number } | null
  crop: CropInfo | null
  usingDesktopImage: boolean
}) {
  const rec = recommendedSize(frame)
  const sharp = size && crop ? judgeSharpness(size.w, crop, frame) : null

  return (
    <div className="space-y-1 text-[11px] leading-4 text-neutral-500">
      <p className="flex items-center gap-1 font-semibold text-neutral-800">
        {device === "desktop" ? <Monitor className="size-3" /> : <Smartphone className="size-3" />}
        {device === "desktop" ? "Desktop" : "Phone"}
        <span className="font-normal text-neutral-500">· {frame.label}</span>
      </p>
      {usingDesktopImage ? <p>No phone image, so the desktop image is used here.</p> : null}
      {size && crop ? (
        <>
          <p>
            Your file: {size.w} × {size.h}px ·{" "}
            {crop.cut === "none"
              ? "fits exactly, nothing cut"
              : `${crop.hiddenPercent}% cut from the ${crop.cut === "sides" ? "left and right" : "top and bottom"}`}
          </p>
          <p
            className={cn(
              "flex items-center gap-1",
              sharp === "sharp" ? "text-emerald-700" : sharp === "ok" ? "text-amber-700" : "text-red-700",
            )}
          >
            {sharp === "sharp" ? <CheckCircle2 className="size-3" /> : <AlertTriangle className="size-3" />}
            {sharp === "sharp"
              ? "Sharp on all screens"
              : sharp === "ok"
                ? "OK, but slightly soft on high-resolution screens"
                : "Too small: will look blurry"}
          </p>
        </>
      ) : (
        <p>Reading file size…</p>
      )}
      <p>
        Best upload: {rec.w} × {rec.h}px
      </p>
    </div>
  )
}

export function BannerPlacementPreview({
  placement,
  position,
  desktopSrc,
  mobileSrc,
  overlayOpacity,
  title,
  subtitle,
  ctaText,
  textAlignment,
}: {
  placement: BannerPlacement
  position: number
  desktopSrc: string
  mobileSrc: string | null
  overlayOpacity: number
  title: string
  subtitle: string
  ctaText: string
  textAlignment: BannerTextAlignment
}) {
  const [mode, setMode] = useState<"site" | "crop">("site")
  const phoneSrc = mobileSrc || desktopSrc
  const frames = getBannerFrames(placement, position, { hasMobileImage: Boolean(mobileSrc) })
  const desktopSize = useMediaSize(desktopSrc)
  const phoneSize = useMediaSize(phoneSrc)
  const desktopCrop = desktopSize ? computeCrop(desktopSize.w, desktopSize.h, frames.desktop.aspect) : null
  const phoneCrop = phoneSize ? computeCrop(phoneSize.w, phoneSize.h, frames.mobile.aspect) : null

  const overlayKind =
    placement === "HERO" ? "hero" : ["FEATURE", "MIDDLE", "BOTTOM"].includes(placement) ? "flat" : "none"
  const textProps = { placement, title, subtitle, ctaText, textAlignment }

  // Tall slots would tower over the panel at full width.
  const desktopFrameWidth = frames.desktop.aspect < 1 ? "w-[60%]" : "w-full"

  return (
    <div className="space-y-4">
      <div className="flex rounded-lg border border-black/10 bg-neutral-100 p-0.5 text-[11px] font-medium">
        {(
          [
            ["site", Eye, "As on site"],
            ["crop", Crop, "Show crop"],
          ] as const
        ).map(([value, Icon, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1 rounded px-2 py-1 transition",
              mode === value ? "bg-white text-black shadow-xs" : "text-neutral-500 hover:text-black",
            )}
          >
            <Icon className="size-3" /> {label}
          </button>
        ))}
      </div>
      {mode === "crop" ? (
        <p className="-mt-2 text-[11px] text-neutral-500">
          The whole file is shown; the white box is what visitors see, and the dark area is cut off.
        </p>
      ) : null}

      {/* Desktop */}
      <div className="space-y-2">
        <div className={cn("mx-auto overflow-hidden rounded-md border border-neutral-300 bg-white shadow-sm", mode === "site" ? desktopFrameWidth : "w-full")}>
          <div className="flex items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-2 py-1">
            <span className="size-1.5 rounded-full bg-neutral-300" />
            <span className="size-1.5 rounded-full bg-neutral-300" />
            <span className="size-1.5 rounded-full bg-neutral-300" />
          </div>
          {mode === "crop" && desktopSize && desktopCrop ? (
            <CropFrame src={desktopSrc} size={desktopSize} crop={desktopCrop} />
          ) : (
            <SiteFrame src={desktopSrc} frame={frames.desktop} overlay={overlayOpacity} overlayKind={overlayKind}>
              <TextOverlay {...textProps} device="desktop" />
            </SiteFrame>
          )}
        </div>
        <FrameReport device="desktop" frame={frames.desktop} size={desktopSize} crop={desktopCrop} usingDesktopImage={false} />
      </div>

      {/* Phone */}
      <div className="flex items-start gap-3 border-t border-black/5 pt-4">
        <div className="w-[140px] shrink-0 overflow-hidden rounded-[18px] border-[5px] border-neutral-900 bg-neutral-900 shadow-sm">
          {mode === "crop" && phoneSize && phoneCrop ? (
            <CropFrame src={phoneSrc} size={phoneSize} crop={phoneCrop} />
          ) : (
            <SiteFrame src={phoneSrc} frame={frames.mobile} overlay={overlayOpacity} overlayKind={overlayKind}>
              <TextOverlay {...textProps} device="mobile" />
            </SiteFrame>
          )}
        </div>
        <FrameReport
          device="mobile"
          frame={frames.mobile}
          size={phoneSize}
          crop={phoneCrop}
          usingDesktopImage={!mobileSrc}
        />
      </div>
    </div>
  )
}
