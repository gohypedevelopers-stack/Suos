"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, ImageIcon, LayoutTemplate, Loader2, Plus, RotateCcw, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

import { resetSiteContentAction, saveSiteContentAction } from "@/app/actions/site-content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { SiteContentAdminView } from "@/lib/server/dal/site-content"
import {
  DEFAULT_SITE_CONTENT,
  policyBlocksToText,
  policyTextToBlocks,
  SITE_CONTENT_LABELS,
  type PolicyContent,
  type SiteContent,
  type SiteContentKey,
} from "@/lib/site-content"

/* ───────────────────────── Shared bits ───────────────────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-black/75">{label}</Label>
      {children}
      {hint ? <p className="text-[11px] text-black/50">{hint}</p> : null}
    </div>
  )
}

function ListControls({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number
  count: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="outline" size="icon" className="size-7" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Move up">
        <ArrowUp className="size-3.5" />
      </Button>
      <Button type="button" variant="outline" size="icon" className="size-7" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label="Move down">
        <ArrowDown className="size-3.5" />
      </Button>
      <Button type="button" variant="outline" size="icon" className="size-7 text-red-600" onClick={() => onRemove(index)} aria-label="Remove">
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}

function move<T>(items: T[], from: number, to: number) {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

async function uploadImage(file: File): Promise<string> {
  const presign = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size, scope: "banner" }),
  })
  if (!presign.ok) {
    const body = (await presign.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? "Upload could not start.")
  }
  const { uploadUrl, publicUrl } = (await presign.json()) as { uploadUrl: string; publicUrl: string }
  const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file })
  if (!put.ok) throw new Error("The image could not be uploaded.")
  return publicUrl
}

function ImageField({ value, onChange, label = "Image" }: { value: string; onChange: (value: string) => void; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function pick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setUploading(true)
    try {
      onChange(await uploadImage(file))
      toast.success("Image uploaded.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field label={label} hint="Paste a path or URL, or upload a JPG, PNG, WebP or AVIF.">
      <div className="flex items-center gap-2">
        <div className="size-12 shrink-0 overflow-hidden rounded-md border border-black/10 bg-black/[0.03]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <ImageIcon className="m-3 size-6 text-black/30" />
          )}
        </div>
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="/images/products/product1.png" />
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="hidden" onChange={pick} />
        <Button type="button" variant="outline" className="h-9 shrink-0" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
          Upload
        </Button>
      </div>
    </Field>
  )
}

/* ───────────────────────── Section editors ───────────────────────── */

type SectionProps<K extends SiteContentKey> = {
  value: SiteContent[K]
  onChange: (value: SiteContent[K]) => void
}

function AnnouncementsEditor({ value, onChange }: SectionProps<"announcements">) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="Desktop · left"><Input value={value.left} onChange={(e) => onChange({ ...value, left: e.target.value })} /></Field>
      <Field label="Desktop · centre"><Input value={value.center} onChange={(e) => onChange({ ...value, center: e.target.value })} /></Field>
      <Field label="Desktop · right"><Input value={value.right} onChange={(e) => onChange({ ...value, right: e.target.value })} /></Field>
      <div className="md:col-span-3">
        <Field label="Mobile messages (rotate every few seconds)" hint="One per line.">
          <Textarea rows={4} value={value.mobile.join("\n")} onChange={(e) => onChange({ ...value, mobile: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
        </Field>
      </div>
    </div>
  )
}

function LaunchOfferEditor({ value, onChange }: SectionProps<"launchOffer">) {
  const local = value.endsAt ? new Date(value.endsAt) : null
  const localValue = local && !Number.isNaN(local.getTime())
    ? `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}T${String(local.getHours()).padStart(2, "0")}:${String(local.getMinutes()).padStart(2, "0")}`
    : ""
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex items-center gap-3 md:col-span-2">
        <Switch checked={value.enabled} onCheckedChange={(enabled) => onChange({ ...value, enabled })} id="launch-enabled" />
        <Label htmlFor="launch-enabled" className="text-sm">Show the launch offer bar on the homepage</Label>
      </div>
      <Field label="Label"><Input value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} /></Field>
      <Field label="Countdown ends at" hint="Local time on this computer.">
        <Input type="datetime-local" value={localValue} onChange={(e) => onChange({ ...value, endsAt: e.target.value ? new Date(e.target.value).toISOString() : value.endsAt })} />
      </Field>
      <Field label="Button text"><Input value={value.ctaText} onChange={(e) => onChange({ ...value, ctaText: e.target.value })} /></Field>
      <Field label="Button link"><Input value={value.ctaHref} onChange={(e) => onChange({ ...value, ctaHref: e.target.value })} /></Field>
    </div>
  )
}

function LookbookEditor({ value, onChange }: SectionProps<"lookbook">) {
  const slides = value.slides
  const set = (next: typeof slides) => onChange({ slides: next })
  return (
    <div className="space-y-3">
      {slides.map((slide, index) => (
        <div key={slide.id} className="rounded-lg border border-black/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-black/60">Slide {index + 1}</p>
            <ListControls index={index} count={slides.length} onMove={(from, to) => set(move(slides, from, to))} onRemove={(i) => set(slides.filter((_, j) => j !== i))} />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_160px]">
            <ImageField value={slide.image} onChange={(image) => set(slides.map((s, j) => (j === index ? { ...s, image } : s)))} />
            <Field label="Alt text"><Input value={slide.alt} onChange={(e) => set(slides.map((s, j) => (j === index ? { ...s, alt: e.target.value } : s)))} /></Field>
            <Field label="Focus (object-position)" hint='e.g. "center 20%"'><Input value={slide.objectPosition} onChange={(e) => set(slides.map((s, j) => (j === index ? { ...s, objectPosition: e.target.value } : s)))} /></Field>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => set([...slides, { id: `lookbook-${Date.now()}`, image: "", alt: "", objectPosition: "center" }])}>
        <Plus className="size-3.5" /> Add slide
      </Button>
    </div>
  )
}

function EditsEditor({ value, onChange }: SectionProps<"edits">) {
  const slides = value.slides
  const setSlides = (next: typeof slides) => onChange({ ...value, slides: next })
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Heading"><Input value={value.heading} onChange={(e) => onChange({ ...value, heading: e.target.value })} /></Field>
        <Field label="Tabs" hint="Comma separated. Prefix the active one with *, e.g. ALL, WOMEN, *MEN">
          <Input
            value={value.tabs.map((tab) => `${tab.active ? "*" : ""}${tab.label}`).join(", ")}
            onChange={(e) =>
              onChange({
                ...value,
                tabs: e.target.value
                  .split(",")
                  .map((part) => part.trim())
                  .filter(Boolean)
                  .map((part) => ({ label: part.replace(/^\*/, ""), active: part.startsWith("*") })),
              })
            }
          />
        </Field>
      </div>
      {slides.map((slide, index) => (
        <div key={slide.id} className="rounded-lg border border-black/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-black/60">Card {index + 1}</p>
            <ListControls index={index} count={slides.length} onMove={(from, to) => setSlides(move(slides, from, to))} onRemove={(i) => setSlides(slides.filter((_, j) => j !== i))} />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <ImageField value={slide.image} onChange={(image) => setSlides(slides.map((s, j) => (j === index ? { ...s, image } : s)))} />
            <Field label="Alt text"><Input value={slide.alt} onChange={(e) => setSlides(slides.map((s, j) => (j === index ? { ...s, alt: e.target.value } : s)))} /></Field>
            <Field label="Caption"><Input value={slide.label} onChange={(e) => setSlides(slides.map((s, j) => (j === index ? { ...s, label: e.target.value } : s)))} /></Field>
            <Field label="Link (optional)" hint="e.g. /collections/denim"><Input value={slide.href} onChange={(e) => setSlides(slides.map((s, j) => (j === index ? { ...s, href: e.target.value } : s)))} /></Field>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => setSlides([...slides, { id: `edit-${Date.now()}`, image: "", alt: "", label: "Edit Name", href: "" }])}>
        <Plus className="size-3.5" /> Add card
      </Button>
    </div>
  )
}

function ContactEditor({ value, onChange }: SectionProps<"contact">) {
  const faqs = value.faqs
  const setFaqs = (next: typeof faqs) => onChange({ ...value, faqs: next })
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Eyebrow"><Input value={value.eyebrow} onChange={(e) => onChange({ ...value, eyebrow: e.target.value })} /></Field>
        <Field label="Headline" hint="One line per row."><Input value={value.titleLines.join(" / ")} onChange={(e) => onChange({ ...value, titleLines: e.target.value.split("/").map((s) => s.trim()).filter(Boolean) })} /></Field>
        <div className="md:col-span-2">
          <Field label="Description"><Textarea rows={2} value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })} /></Field>
        </div>
        <Field label="Phone"><Input value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} /></Field>
        <Field label="Phone hours"><Input value={value.phoneHours} onChange={(e) => onChange({ ...value, phoneHours: e.target.value })} /></Field>
        <Field label="Email"><Input value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} /></Field>
        <Field label="Email response time"><Input value={value.emailResponse} onChange={(e) => onChange({ ...value, emailResponse: e.target.value })} /></Field>
        <Field label="Live chat label"><Input value={value.chatLabel} onChange={(e) => onChange({ ...value, chatLabel: e.target.value })} /></Field>
        <Field label="Live chat hours"><Input value={value.chatHours} onChange={(e) => onChange({ ...value, chatHours: e.target.value })} /></Field>
      </div>
      <div>
        <p className="text-sm font-medium">Frequently asked questions</p>
        <div className="mt-2 space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border border-black/10 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-black/60">Question {index + 1}</p>
                <ListControls index={index} count={faqs.length} onMove={(from, to) => setFaqs(move(faqs, from, to))} onRemove={(i) => setFaqs(faqs.filter((_, j) => j !== i))} />
              </div>
              <div className="mt-3 space-y-3">
                <Input value={faq.question} placeholder="Question" onChange={(e) => setFaqs(faqs.map((f, j) => (j === index ? { ...f, question: e.target.value } : f)))} />
                <Textarea rows={3} value={faq.answer} placeholder="Answer" onChange={(e) => setFaqs(faqs.map((f, j) => (j === index ? { ...f, answer: e.target.value } : f)))} />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}>
            <Plus className="size-3.5" /> Add question
          </Button>
        </div>
      </div>
    </div>
  )
}

function FooterEditor({ value, onChange }: SectionProps<"footer">) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="Customer care email"><Input value={value.careEmail} onChange={(e) => onChange({ ...value, careEmail: e.target.value })} /></Field>
      <Field label="Orders phone"><Input value={value.ordersPhone} onChange={(e) => onChange({ ...value, ordersPhone: e.target.value })} /></Field>
      <Field label="Timings"><Input value={value.timings} onChange={(e) => onChange({ ...value, timings: e.target.value })} /></Field>
    </div>
  )
}

function ReturnsPageEditor({ value, onChange }: SectionProps<"returnsPage">) {
  return (
    <div className="space-y-4">
      <Field label="Title"><Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></Field>
      <ImageField label="Side image" value={value.image} onChange={(image) => onChange({ ...value, image })} />
      <Field label="Conditions" hint="One per line.">
        <Textarea rows={6} value={value.conditions.join("\n")} onChange={(e) => onChange({ ...value, conditions: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
      </Field>
    </div>
  )
}

function SizeGuideEditor({ value, onChange }: SectionProps<"sizeGuide">) {
  const images = value.images
  const set = (next: string[]) => onChange({ ...value, images: next })
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title"><Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></Field>
        <Field label="Subtitle"><Input value={value.subtitle} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} /></Field>
      </div>
      <div className="space-y-3">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="flex items-end gap-2">
            <div className="flex-1">
              <ImageField label={`Page ${index + 1}`} value={image} onChange={(next) => set(images.map((img, j) => (j === index ? next : img)))} />
            </div>
            <ListControls index={index} count={images.length} onMove={(from, to) => set(move(images, from, to))} onRemove={(i) => set(images.filter((_, j) => j !== i))} />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => set([...images, ""])}>
          <Plus className="size-3.5" /> Add page
        </Button>
      </div>
    </div>
  )
}

function PolicyEditor({ value, onChange }: { value: PolicyContent; onChange: (value: PolicyContent) => void }) {
  const sections = value.sections
  const setSections = (next: typeof sections) => onChange({ ...value, sections: next })
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Page title"><Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></Field>
        <Field label="Browser tab title"><Input value={value.metaTitle} onChange={(e) => onChange({ ...value, metaTitle: e.target.value })} /></Field>
        <Field label="Search description"><Input value={value.metaDescription} onChange={(e) => onChange({ ...value, metaDescription: e.target.value })} /></Field>
      </div>
      <Field label="Introduction" hint="Paragraphs separated by a blank line. Links: [text](https://… or mailto:…)">
        <Textarea rows={4} value={value.intro.join("\n\n")} onChange={(e) => onChange({ ...value, intro: e.target.value.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean) })} />
      </Field>
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={`${section.id}-${index}`} className="rounded-lg border border-black/10 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-black/60">Section {index + 1}</p>
              <ListControls index={index} count={sections.length} onMove={(from, to) => setSections(move(sections, from, to))} onRemove={(i) => setSections(sections.filter((_, j) => j !== i))} />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <Field label="Heading"><Input value={section.title} onChange={(e) => setSections(sections.map((s, j) => (j === index ? { ...s, title: e.target.value } : s)))} /></Field>
              <Field label="Menu label"><Input value={section.navLabel} onChange={(e) => setSections(sections.map((s, j) => (j === index ? { ...s, navLabel: e.target.value } : s)))} /></Field>
              <Field label="Anchor id" hint="lowercase-with-dashes"><Input value={section.id} onChange={(e) => setSections(sections.map((s, j) => (j === index ? { ...s, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") } : s)))} /></Field>
            </div>
            <div className="mt-3">
              <Field label="Body" hint="Blank line between paragraphs. Start a line with “- ” for a bullet.">
                <Textarea rows={6} value={policyBlocksToText(section.blocks)} onChange={(e) => setSections(sections.map((s, j) => (j === index ? { ...s, blocks: policyTextToBlocks(e.target.value) } : s)))} />
              </Field>
            </div>
            <div className="mt-3 space-y-2">
              {section.subsections.map((sub, subIndex) => (
                <div key={subIndex} className="rounded-md border border-dashed border-black/15 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Input className="h-8 max-w-sm" value={sub.title} placeholder="Sub-heading" onChange={(e) => setSections(sections.map((s, j) => (j === index ? { ...s, subsections: s.subsections.map((x, k) => (k === subIndex ? { ...x, title: e.target.value } : x)) } : s)))} />
                    <Button type="button" variant="outline" size="icon" className="size-7 text-red-600" aria-label="Remove sub-section" onClick={() => setSections(sections.map((s, j) => (j === index ? { ...s, subsections: s.subsections.filter((_, k) => k !== subIndex) } : s)))}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <Textarea className="mt-2" rows={4} value={policyBlocksToText(sub.blocks)} onChange={(e) => setSections(sections.map((s, j) => (j === index ? { ...s, subsections: s.subsections.map((x, k) => (k === subIndex ? { ...x, blocks: policyTextToBlocks(e.target.value) } : x)) } : s)))} />
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => setSections(sections.map((s, j) => (j === index ? { ...s, subsections: [...s.subsections, { title: "", blocks: [] }] } : s)))}>
                <Plus className="size-3.5" /> Add sub-section
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setSections([...sections, { id: `section-${sections.length + 1}`, title: "", navLabel: "", blocks: [], subsections: [] }])}>
          <Plus className="size-3.5" /> Add section
        </Button>
      </div>
    </div>
  )
}

/* ───────────────────────── Manager ───────────────────────── */

const TAB_GROUPS: Array<{ key: SiteContentKey; title: string }> = [
  { key: "announcements", title: SITE_CONTENT_LABELS.announcements },
  { key: "launchOffer", title: SITE_CONTENT_LABELS.launchOffer },
  { key: "lookbook", title: SITE_CONTENT_LABELS.lookbook },
  { key: "edits", title: SITE_CONTENT_LABELS.edits },
  { key: "contact", title: SITE_CONTENT_LABELS.contact },
  { key: "footer", title: SITE_CONTENT_LABELS.footer },
  { key: "returnsPage", title: SITE_CONTENT_LABELS.returnsPage },
  { key: "sizeGuide", title: SITE_CONTENT_LABELS.sizeGuide },
  { key: "privacyPolicy", title: SITE_CONTENT_LABELS.privacyPolicy },
  { key: "termsPolicy", title: SITE_CONTENT_LABELS.termsPolicy },
  { key: "shippingPolicy", title: SITE_CONTENT_LABELS.shippingPolicy },
]

export function ContentManager({ initial }: { initial: SiteContentAdminView }) {
  const router = useRouter()
  const [content, setContent] = useState<SiteContent>(initial.content)
  const [dirty, setDirty] = useState<Set<SiteContentKey>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [active, setActive] = useState<SiteContentKey>("announcements")

  function update<K extends SiteContentKey>(key: K, value: SiteContent[K]) {
    setContent((current) => ({ ...current, [key]: value }))
    setDirty((current) => new Set(current).add(key))
  }

  function save(key: SiteContentKey) {
    startTransition(async () => {
      const result = await saveSiteContentAction({ key, value: content[key] })
      if (!result.success) {
        toast.error(result.message)
        return
      }
      toast.success(`${SITE_CONTENT_LABELS[key]} published.`)
      setDirty((current) => {
        const next = new Set(current)
        next.delete(key)
        return next
      })
      router.refresh()
    })
  }

  function reset(key: SiteContentKey) {
    startTransition(async () => {
      const result = await resetSiteContentAction({ key })
      if (!result.success) {
        toast.error(result.message)
        return
      }
      setContent((current) => ({ ...current, [key]: structuredClone(DEFAULT_SITE_CONTENT[key]) }))
      setDirty((current) => {
        const next = new Set(current)
        next.delete(key)
        return next
      })
      toast.success(`${SITE_CONTENT_LABELS[key]} restored to the original.`)
      router.refresh()
    })
  }

  function renderEditor(key: SiteContentKey) {
    switch (key) {
      case "announcements":
        return <AnnouncementsEditor value={content.announcements} onChange={(v) => update("announcements", v)} />
      case "launchOffer":
        return <LaunchOfferEditor value={content.launchOffer} onChange={(v) => update("launchOffer", v)} />
      case "lookbook":
        return <LookbookEditor value={content.lookbook} onChange={(v) => update("lookbook", v)} />
      case "edits":
        return <EditsEditor value={content.edits} onChange={(v) => update("edits", v)} />
      case "contact":
        return <ContactEditor value={content.contact} onChange={(v) => update("contact", v)} />
      case "footer":
        return <FooterEditor value={content.footer} onChange={(v) => update("footer", v)} />
      case "returnsPage":
        return <ReturnsPageEditor value={content.returnsPage} onChange={(v) => update("returnsPage", v)} />
      case "sizeGuide":
        return <SizeGuideEditor value={content.sizeGuide} onChange={(v) => update("sizeGuide", v)} />
      case "privacyPolicy":
        return <PolicyEditor value={content.privacyPolicy} onChange={(v) => update("privacyPolicy", v)} />
      case "termsPolicy":
        return <PolicyEditor value={content.termsPolicy} onChange={(v) => update("termsPolicy", v)} />
      case "shippingPolicy":
        return <PolicyEditor value={content.shippingPolicy} onChange={(v) => update("shippingPolicy", v)} />
    }
  }

  const override = initial.overrides[active]

  return (
    <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <LayoutTemplate className="size-4" />
            Website content
            {isPending ? <Loader2 className="size-4 animate-spin text-black/40" /> : null}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-black/60">
            Edit the text, images and policies shown on the storefront. Changes go live as soon as you publish a section.
          </p>
        </div>
      </div>

      <Tabs value={active} onValueChange={(value) => setActive(value as SiteContentKey)} className="mt-4">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-white p-1 shadow-sm">
          {TAB_GROUPS.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="text-xs data-[state=active]:bg-black data-[state=active]:text-white">
              {tab.title}
              {dirty.has(tab.key) ? <span className="ml-1 size-1.5 rounded-full bg-amber-500" /> : null}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_GROUPS.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-4">
            <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
                <div>
                  <h2 className="text-sm font-semibold">{tab.title}</h2>
                  <p className="text-xs text-black/55">
                    {override
                      ? `Last published ${new Date(override.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}${override.updatedBy ? ` by ${override.updatedBy}` : ""}`
                      : "Showing the original built-in content."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" className="h-8 text-xs" disabled={isPending || !override} onClick={() => reset(tab.key)}>
                    <RotateCcw className="size-3.5" />
                    Restore original
                  </Button>
                  <Button type="button" className="h-8 text-xs" disabled={isPending || !dirty.has(tab.key)} onClick={() => save(tab.key)}>
                    Publish changes
                  </Button>
                </div>
              </div>
              <div className="pt-4">{renderEditor(tab.key)}</div>
            </section>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
