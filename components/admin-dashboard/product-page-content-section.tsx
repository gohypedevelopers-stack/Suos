"use client"

import Image from "next/image"
import { ImageOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  PRODUCT_HIGHLIGHT_COUNT,
  type ProductHighlight,
  type ProductPageContent,
} from "@/lib/product-page-content"

type MediaOption = { objectKey: string; url: string | null; name: string }

const fieldClass =
  "border-black/20 bg-white shadow-none focus-visible:border-black/45 focus-visible:ring-black/10"

/** Picks one of the product's uploaded Media images (or none). */
function MediaPicker({
  label,
  media,
  value,
  onChange,
}: {
  label: string
  media: MediaOption[]
  value: string
  onChange: (objectKey: string) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      <button
        type="button"
        role="radio"
        aria-checked={!value}
        onClick={() => onChange("")}
        className={`flex size-14 cursor-pointer items-center justify-center rounded-md border text-black/40 ${!value ? "border-black ring-1 ring-black" : "border-black/15 hover:border-black/40"}`}
        title="No image"
      >
        <ImageOff className="size-4" />
      </button>
      {media.map((image) => {
        const selected = image.objectKey === value
        return (
          <button
            key={image.objectKey}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={image.name}
            onClick={() => onChange(image.objectKey)}
            className={`relative size-14 cursor-pointer overflow-hidden rounded-md border bg-black/[0.03] ${selected ? "border-black ring-1 ring-black" : "border-black/15 hover:border-black/40"}`}
          >
            {image.url ? <Image src={image.url} alt="" fill sizes="56px" className="object-cover" /> : null}
          </button>
        )
      })}
    </div>
  )
}

export function ProductPageContentSection({
  value,
  media,
  onChange,
}: {
  value: ProductPageContent
  media: MediaOption[]
  onChange: (next: ProductPageContent) => void
}) {
  const set = <K extends keyof ProductPageContent>(key: K, next: ProductPageContent[K]) =>
    onChange({ ...value, [key]: next })

  const highlights: ProductHighlight[] = Array.from(
    { length: PRODUCT_HIGHLIGHT_COUNT },
    (_, index) => value.highlights[index] ?? { imageKey: "", title: "", text: "" },
  )
  const setHighlight = (index: number, patch: Partial<ProductHighlight>) =>
    set(
      "highlights",
      highlights.map((highlight, i) => (i === index ? { ...highlight, ...patch } : highlight)),
    )

  // A picked image that was later removed from Media no longer counts.
  const mediaKeys = new Set(media.map((image) => image.objectKey))
  const keyOrEmpty = (key: string) => (mediaKeys.has(key) ? key : "")

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="px-4 py-4">
        <h2 className="text-sm font-semibold text-black/75">Product page content</h2>
        <p className="mt-1 text-xs leading-5 text-black/50">
          Extra copy and images for the product page. Text is shown as typed (normal case). Images are picked from this product&apos;s Media above.
        </p>
      </div>

      <div className="grid gap-4 border-t border-black/10 px-4 py-4">
        <label className="grid gap-1.5 text-sm text-black/75">
          Subtitle
          <Input
            value={value.subtitle}
            onChange={(event) => set("subtitle", event.target.value)}
            placeholder="A classic bootcut silhouette with a softly faded finish…"
            className={fieldClass}
          />
          <span className="text-xs text-black/45">One line under the product title.</span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm text-black/75">
            Model info
            <Input
              value={value.modelInfo}
              onChange={(event) => set("modelInfo", event.target.value)}
              placeholder={`Model is 5'9" wearing a size 32`}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5 text-sm text-black/75">
            Fit note
            <Input
              value={value.fitNote}
              onChange={(event) => set("fitNote", event.target.value)}
              placeholder="We recommend sizing down for a closer fit."
              className={fieldClass}
            />
            <span className="text-xs text-black/45">Shown under the sizes as “Fit Note: …”.</span>
          </label>
        </div>
      </div>

      <div className="grid gap-4 border-t border-black/10 px-4 py-4">
        <div>
          <h3 className="text-sm font-medium text-black/75">“It’s in the Details” section</h3>
          <p className="mt-1 text-xs text-black/45">
            Up to 3 close-ups with numbered captions (01, 02, 03). Slots without an image are skipped; the section is hidden if none have one.
          </p>
        </div>
        <label className="grid gap-1.5 text-sm text-black/75">
          Intro text
          <Textarea
            value={value.highlightsIntro}
            onChange={(event) => set("highlightsIntro", event.target.value)}
            placeholder="Every detail considered, from the cut to the finish."
            className={`min-h-9 resize-y py-2 ${fieldClass}`}
          />
        </label>

        {highlights.map((highlight, index) => (
          <div key={index} className="grid gap-2 rounded-lg border border-black/10 p-3">
            <p className="text-xs font-semibold text-black/60">Detail {String(index + 1).padStart(2, "0")}</p>
            <MediaPicker
              label={`Image for detail ${index + 1}`}
              media={media}
              value={keyOrEmpty(highlight.imageKey)}
              onChange={(imageKey) => setHighlight(index, { imageKey })}
            />
            <div className="grid gap-2 sm:grid-cols-[minmax(140px,0.6fr)_minmax(0,1.4fr)]">
              <Input
                aria-label={`Title for detail ${index + 1}`}
                value={highlight.title}
                onChange={(event) => setHighlight(index, { title: event.target.value })}
                placeholder="The Bootcut"
                className={fieldClass}
              />
              <Textarea
                aria-label={`Text for detail ${index + 1}`}
                value={highlight.text}
                onChange={(event) => setHighlight(index, { text: event.target.value })}
                placeholder="Fitted through the thigh, opening gently from the knee."
                className={`min-h-9 resize-y py-2 ${fieldClass}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 border-t border-black/10 px-4 py-4">
        <h3 className="text-sm font-medium text-black/75">Lifestyle image</h3>
        <p className="text-xs text-black/45">Full-width image below “You May Also Like”. Hidden when none is picked.</p>
        <MediaPicker
          label="Lifestyle image"
          media={media}
          value={keyOrEmpty(value.lifestyleImageKey)}
          onChange={(lifestyleImageKey) => set("lifestyleImageKey", lifestyleImageKey)}
        />
      </div>
    </section>
  )
}
