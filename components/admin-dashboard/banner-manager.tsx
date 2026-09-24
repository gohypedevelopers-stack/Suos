"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Cloud,
  ExternalLink,
  GripVertical,
  ImageIcon,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Smartphone,
  Sparkles,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { BannerMediaLibraryDialog } from "@/components/admin-dashboard/banner-media-library-dialog"
import {
  addCarouselSlideAction,
  addHeroSlideAction,
  deleteBannersAction,
  reorderBannersAction,
  updateBannerActiveAction,
} from "@/app/actions/banners"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AdminBannerListItem } from "@/lib/server/dal/banners"

type UploadInstruction = {
  uploadUrl?: string
  objectKey?: string
  error?: string
}

async function readUploadInstruction(response: Response): Promise<UploadInstruction> {
  const body = await response.text()
  if (!body) return { error: "The upload service returned an empty response." }
  try {
    return JSON.parse(body) as UploadInstruction
  } catch {
    return {
      error: `The upload service returned an unexpected response (${response.status}).`,
    }
  }
}

export function BannerManager({
  initialBanners,
}: {
  initialBanners: AdminBannerListItem[]
}) {
  const router = useRouter()
  const [banners, setBanners] = useState<AdminBannerListItem[]>(initialBanners)
  const [heroExpanded, setHeroExpanded] = useState<boolean>(true)
  const [carouselExpanded, setCarouselExpanded] = useState<boolean>(true)
  const [editorialExpanded, setEditorialExpanded] = useState<boolean>(true)
  const [query, setQuery] = useState("")
  const [bannersToDelete, setBannersToDelete] = useState<string[] | null>(null)
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false)
  const [draggedSlideIdx, setDraggedSlideIdx] = useState<number | null>(null)
  const [dragOverSlideIdx, setDragOverSlideIdx] = useState<number | null>(null)
  const [draggedCarouselIdx, setDraggedCarouselIdx] = useState<number | null>(null)
  const [dragOverCarouselIdx, setDragOverCarouselIdx] = useState<number | null>(null)
  const [isUploadingSlide, setIsUploadingSlide] = useState(false)
  const [isUploadingCarouselSlide, setIsUploadingCarouselSlide] = useState(false)
  const [isPending, startTransition] = useTransition()

  const heroUploadRef = useRef<HTMLInputElement>(null)
  const carouselUploadRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setBanners(initialBanners)
  }, [initialBanners])

  const heroBanners = banners
    .filter((b) => b.placement === "HERO")
    .sort((a, b) => a.position - b.position)
  const middleBanner = banners.find((b) => b.placement === "MIDDLE")
  const denimCarouselBanners = banners
    .filter((b) => b.placement === "DENIM_CAROUSEL")
    .sort((a, b) => a.position - b.position)
  const editorialBanners = banners
    .filter((b) => b.placement === "EDITORIAL")
    .sort((a, b) => a.position - b.position)
  const bottomBanner = banners.find((b) => b.placement === "BOTTOM")

  const normalizedQuery = query.trim().toLowerCase()

  const handleToggleActive = (id: string, currentActive: boolean) => {
    startTransition(async () => {
      const res = await updateBannerActiveAction(id, !currentActive)
      if (!res.success) {
        toast.error(res.message)
        return
      }
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isActive: !currentActive } : b)),
      )
      toast.success(currentActive ? "Section deactivated." : "Section activated.")
      router.refresh()
    })
  }

  // Slide drag and drop reordering inside Hero
  const handleSlideDragStart = (index: number, e: React.DragEvent) => {
    setDraggedSlideIdx(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", `${index}`)
  }

  const handleSlideDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverSlideIdx !== index) {
      setDragOverSlideIdx(index)
    }
  }

  const handleSlideDrop = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault()
    if (draggedSlideIdx === null || draggedSlideIdx === targetIndex) {
      setDraggedSlideIdx(null)
      setDragOverSlideIdx(null)
      return
    }

    const reordered = [...heroBanners]
    const [moved] = reordered.splice(draggedSlideIdx, 1)
    reordered.splice(targetIndex, 0, moved)

    const updatedWithPositions = reordered.map((item, idx) => ({
      ...item,
      position: idx,
    }))

    // Optimistically update
    setBanners((prev) => {
      const others = prev.filter((b) => b.placement !== "HERO")
      return [...updatedWithPositions, ...others]
    })

    setDraggedSlideIdx(null)
    setDragOverSlideIdx(null)

    // Save to database
    startTransition(async () => {
      const payload = updatedWithPositions.map((item) => ({
        id: item.id,
        position: item.position,
      }))
      const res = await reorderBannersAction({ items: payload })
      if (!res.success) {
        toast.error(res.message || "Failed to update slide order.")
        return
      }
      toast.success("Hero slide sequence updated.")
      router.refresh()
    })
  }

  const handleMoveSlideStep = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= heroBanners.length) return

    const reordered = [...heroBanners]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)

    const updatedWithPositions = reordered.map((item, idx) => ({
      ...item,
      position: idx,
    }))

    setBanners((prev) => {
      const others = prev.filter((b) => b.placement !== "HERO")
      return [...updatedWithPositions, ...others]
    })

    startTransition(async () => {
      const payload = updatedWithPositions.map((item) => ({
        id: item.id,
        position: item.position,
      }))
      const res = await reorderBannersAction({ items: payload })
      if (!res.success) {
        toast.error(res.message || "Failed to update slide order.")
        return
      }
      toast.success("Slide moved.")
      router.refresh()
    })
  }

  // Upload slide files directly into Hero
  const handleUploadHeroSlides = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    if (files.length === 0) return

    setIsUploadingSlide(true)
    let addedCount = 0

    for (const file of files) {
      const allowed = new Set(["image/avif", "image/jpeg", "image/png", "image/webp"])
      if (!allowed.has(file.type)) {
        toast.error(`"${file.name}" is not a supported image (JPG, PNG, WebP, AVIF).`)
        continue
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large (max 10MB).`)
        continue
      }

      try {
        const presignRes = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            size: file.size,
            sizeBytes: file.size,
            scope: "banner",
          }),
        })

        const instruction = await readUploadInstruction(presignRes)
        if (!instruction.uploadUrl || !instruction.objectKey) {
          toast.error(instruction.error || "Could not prepare upload.")
          continue
        }

        const uploadRes = await fetch(instruction.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        })

        if (!uploadRes.ok) {
          toast.error(`Failed to upload ${file.name} to Cloudflare.`)
          continue
        }

        const addRes = await addHeroSlideAction({
          desktopImageKey: instruction.objectKey,
          title: null,
          subtitle: null,
          ctaText: null,
          ctaLink: "/collections",
        })

        if (addRes.status === "success") {
          addedCount++
        }
      } catch {
        toast.error(`Error processing ${file.name}.`)
      }
    }

    setIsUploadingSlide(false)
    if (addedCount > 0) {
      toast.success(`Successfully added ${addedCount} slide(s) to Hero Carousel!`)
      router.refresh()
    }
  }

  // Slide drag and drop reordering inside Denim Carousel
  const handleCarouselSlideDragStart = (index: number, e: React.DragEvent) => {
    setDraggedCarouselIdx(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", `${index}`)
  }

  const handleCarouselSlideDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverCarouselIdx !== index) {
      setDragOverCarouselIdx(index)
    }
  }

  const handleCarouselSlideDrop = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault()
    if (draggedCarouselIdx === null || draggedCarouselIdx === targetIndex) {
      setDraggedCarouselIdx(null)
      setDragOverCarouselIdx(null)
      return
    }

    const reordered = [...denimCarouselBanners]
    const [moved] = reordered.splice(draggedCarouselIdx, 1)
    reordered.splice(targetIndex, 0, moved)

    const updatedWithPositions = reordered.map((item, idx) => ({
      ...item,
      position: idx,
    }))

    setBanners((prev) => {
      const others = prev.filter((b) => b.placement !== "DENIM_CAROUSEL")
      return [...updatedWithPositions, ...others]
    })

    setDraggedCarouselIdx(null)
    setDragOverCarouselIdx(null)

    startTransition(async () => {
      const payload = updatedWithPositions.map((item) => ({
        id: item.id,
        position: item.position,
      }))
      const res = await reorderBannersAction({ items: payload })
      if (!res.success) {
        toast.error(res.message || "Failed to update carousel slide order.")
        return
      }
      toast.success("Carousel slide moved.")
      router.refresh()
    })
  }

  // Upload slide files directly into Denim Carousel
  const handleUploadCarouselSlides = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    if (files.length === 0) return

    setIsUploadingCarouselSlide(true)
    let addedCount = 0

    for (const file of files) {
      const allowed = new Set(["image/avif", "image/jpeg", "image/png", "image/webp"])
      if (!allowed.has(file.type)) {
        toast.error(`"${file.name}" is not a supported image (JPG, PNG, WebP, AVIF).`)
        continue
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large (max 10MB).`)
        continue
      }

      try {
        const presignRes = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            size: file.size,
            sizeBytes: file.size,
            scope: "banner",
          }),
        })

        const instruction = await readUploadInstruction(presignRes)
        if (!instruction.uploadUrl || !instruction.objectKey) {
          toast.error(instruction.error || "Could not prepare upload.")
          continue
        }

        const uploadRes = await fetch(instruction.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        })

        if (!uploadRes.ok) {
          toast.error(`Failed to upload ${file.name}.`)
          continue
        }

        const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
        const formattedTitle = rawName.charAt(0).toUpperCase() + rawName.slice(1)

        const addRes = await addCarouselSlideAction({
          desktopImageKey: instruction.objectKey,
          title: formattedTitle,
          subtitle: "Denim Cut",
          ctaText: null,
          ctaLink: "/collections",
        })

        if (addRes.status === "success") {
          addedCount++
        }
      } catch {
        toast.error(`Error processing ${file.name}.`)
      }
    }

    setIsUploadingCarouselSlide(false)
    if (addedCount > 0) {
      toast.success(`Successfully added ${addedCount} slide(s) to Denim Carousel!`)
      router.refresh()
    }
  }

  const confirmDelete = () => {
    if (!bannersToDelete?.length) return
    const ids = bannersToDelete
    setBannersToDelete(null)
    startTransition(async () => {
      const res = await deleteBannersAction(ids)
      if (!res.success) {
        toast.error(res.message)
        return
      }
      setBanners((prev) => prev.filter((b) => !ids.includes(b.id)))
      toast.success(res.count === 1 ? "Slide deleted." : `${res.count} slides deleted.`)
      router.refresh()
    })
  }

  const matchesSearch = (text?: string | null) => {
    if (!normalizedQuery) return true
    return text?.toLowerCase().includes(normalizedQuery)
  }

  const heroVisibleSlides = heroBanners.filter(
    (s) =>
      !normalizedQuery ||
      matchesSearch(s.title) ||
      matchesSearch(s.subtitle) ||
      matchesSearch(s.ctaText) ||
      matchesSearch(s.ctaLink),
  )

  return (
    <main className="min-h-full flex-1 bg-[#f7f7f8] p-4 text-black sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-900">
              <ImageIcon className="size-5 text-neutral-800" /> Homepage Banners
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              Manage the 3 homepage sections. All slides are neatly organized inside the Hero Carousel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMediaLibraryOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-medium text-neutral-800 transition hover:bg-neutral-50 shadow-sm cursor-pointer"
            >
              <Cloud className="size-3.5 text-blue-600" /> Cloudflare R2 Library
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-medium text-black transition hover:bg-neutral-50 shadow-sm"
            >
              <ExternalLink className="size-3.5 text-neutral-600" /> View Storefront
            </Link>
          </div>
        </div>

        {/* 3 Section Overview Metrics */}
        <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-xs">
          <div className="grid grid-cols-1 divide-y divide-black/10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  #1 Hero Carousel
                </span>
                <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                  {heroBanners.length} {heroBanners.length === 1 ? "Slide" : "Slides"}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-neutral-900">Top Header Slideshow</p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {heroBanners.length > 1
                  ? "Auto-playing slideshow in hero header"
                  : "Single slide hero header"}
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  #2 Middle Motion
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    middleBanner?.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {middleBanner?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-neutral-900">Editorial Section</p>
              <p className="mt-0.5 text-xs text-neutral-500">Full-width editorial visual banner</p>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  #3 Bottom Product
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    bottomBanner?.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {bottomBanner?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-neutral-900">Showcase Section</p>
              <p className="mt-0.5 text-xs text-neutral-500">Brand craftsmanship & collections</p>
            </div>
          </div>
        </section>

        {/* Section List (The 3 Sections) */}
        <section className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          {/* Header search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-3.5 bg-neutral-50/50">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Homepage Sections (3)</h2>
              <p className="text-[11px] text-neutral-500">
                The 3 banner sections of the SUOS homepage. Expand Hero to manage its slides.
              </p>
            </div>

            <label className="flex h-9 w-72 items-center gap-2 rounded-lg border border-black/15 bg-white px-3 text-sm text-neutral-600 transition focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
              <Search className="size-4 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search slides or sections..."
                className="w-full bg-transparent text-xs text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </label>
          </div>

          <div className="divide-y divide-black/10">
            {/* ================================================================ */}
            {/* SECTION 1: HERO (TOP CAROUSEL)                                   */}
            {/* ================================================================ */}
            <div className="bg-white">
              {/* Main Section Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 hover:bg-neutral-50/40 transition">
                {/* Left: Position & Section Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-black text-white font-mono text-xs font-semibold shadow-xs">
                    1
                  </div>

                  {/* Thumbnail Stack Preview */}
                  <div className="relative aspect-[16/9] w-24 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-neutral-900 shadow-xs">
                    {heroBanners[0]?.desktopImageUrl ? (
                      <Image
                        src={heroBanners[0].desktopImageUrl}
                        alt="Hero Carousel"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-white/50">
                        No Slides
                      </div>
                    )}
                    {heroBanners.length > 1 && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
                        +{heroBanners.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-neutral-900">Hero (Top Carousel)</h3>
                      <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                        {heroBanners.length} {heroBanners.length === 1 ? "Slide" : "Slides"}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-black/[0.06] px-2 py-0.5 text-[10px] font-medium text-black/75">
                        Top of Homepage
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Auto-playing slideshow in the header. All individual slides are managed inside.
                    </p>
                  </div>
                </div>

                {/* Right: Section Actions & Slide Expand Toggle */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => heroUploadRef.current?.click()}
                    disabled={isUploadingSlide}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingSlide ? (
                      <>
                        <LoaderCircle className="size-3.5 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="size-3.5" /> Add Slide
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setHeroExpanded(!heroExpanded)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3.5 text-xs font-medium text-white transition hover:bg-black/85 shadow-sm cursor-pointer"
                  >
                    <span>{heroExpanded ? "Hide Slides" : `View Slides (${heroBanners.length})`}</span>
                    {heroExpanded ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Hidden file input for uploading slides into hero */}
              <input
                type="file"
                ref={heroUploadRef}
                multiple
                accept="image/png,image/jpeg,image/webp,image/avif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleUploadHeroSlides(e.target.files)
                  }
                }}
              />

              {/* ================================================================ */}
              {/* INSIDE HERO: NESTED SLIDE MANAGER                                */}
              {/* ================================================================ */}
              {heroExpanded && (
                <div className="border-t border-black/10 bg-neutral-50/70 p-4 sm:p-5">
                  <div className="rounded-xl border border-black/10 bg-white p-4 shadow-xs">
                    {/* Nested Slide Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-3.5 text-neutral-700" />
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                            Slides Inside Hero Carousel ({heroBanners.length})
                          </h4>
                        </div>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          Drag any slide to rearrange playback sequence. Click any slide to edit its image, title, or CTA link.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploadingSlide}
                          onClick={() => heroUploadRef.current?.click()}
                          className="inline-flex h-7 items-center gap-1 rounded-md bg-black px-2.5 text-[11px] font-semibold text-white hover:bg-neutral-800 transition cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <Plus className="size-3" /> Upload Slide
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaLibraryOpen(true)}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-black/15 bg-white px-2.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50 transition cursor-pointer shadow-2xs"
                        >
                          <Cloud className="size-3 text-blue-600" /> Library
                        </button>
                      </div>
                    </div>

                    {/* Slides List Table */}
                    {heroVisibleSlides.length === 0 ? (
                      <div className="py-8 text-center text-xs text-neutral-500">
                        {normalizedQuery
                          ? "No slides match your search."
                          : "No slides yet. Click '+ Upload Slide' above to add slides to the carousel."}
                      </div>
                    ) : (
                      <div className="divide-y divide-black/5 mt-1">
                        {heroVisibleSlides.map((slide, idx) => {
                          const isDragged = draggedSlideIdx === idx
                          const isDragOver =
                            dragOverSlideIdx === idx && draggedSlideIdx !== idx

                          return (
                            <div
                              key={slide.id}
                              draggable={true}
                              onDragStart={(e) => handleSlideDragStart(idx, e)}
                              onDragOver={(e) => handleSlideDragOver(idx, e)}
                              onDrop={(e) => handleSlideDrop(idx, e)}
                              onDragEnd={() => {
                                setDraggedSlideIdx(null)
                                setDragOverSlideIdx(null)
                              }}
                              className={`flex flex-wrap items-center justify-between gap-3 py-3 px-2 rounded-lg transition select-none ${
                                isDragged
                                  ? "opacity-30 bg-neutral-100"
                                  : isDragOver
                                    ? "bg-blue-50/70 border-t-2 border-t-blue-600 shadow-sm"
                                    : "hover:bg-neutral-50/90"
                              }`}
                            >
                              {/* Left: Drag Handle, Number, Preview, Details */}
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Drag Grip & Arrows */}
                                <div className="flex items-center gap-1 text-neutral-400">
                                  <span
                                    title="Drag to rearrange"
                                    className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:text-black transition-colors"
                                  >
                                    <GripVertical className="size-4" />
                                  </span>
                                  <button
                                    type="button"
                                    disabled={idx === 0 || isPending}
                                    onClick={() => handleMoveSlideStep(idx, "up")}
                                    title="Move Up"
                                    className="p-1 rounded hover:bg-neutral-200 hover:text-black disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                                  >
                                    <ArrowUp className="size-3" />
                                  </button>
                                  <span className="font-mono text-neutral-800 text-xs font-semibold min-w-[14px] text-center">
                                    {idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={idx === heroBanners.length - 1 || isPending}
                                    onClick={() => handleMoveSlideStep(idx, "down")}
                                    title="Move Down"
                                    className="p-1 rounded hover:bg-neutral-200 hover:text-black disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                                  >
                                    <ArrowDown className="size-3" />
                                  </button>
                                </div>

                                {/* Thumbnail */}
                                <Link
                                  href={`/dashboard/banners/${slide.id}`}
                                  className="group relative block aspect-[16/9] w-24 shrink-0 overflow-hidden rounded-md border border-black/10 bg-neutral-900 shadow-2xs"
                                >
                                  <Image
                                    src={slide.desktopImageUrl}
                                    alt={slide.title || `Slide ${idx + 1}`}
                                    fill
                                    sizes="96px"
                                    className="object-cover transition-transform group-hover:scale-105"
                                  />
                                  {slide.mobileImageUrl && (
                                    <span
                                      title="Has mobile portrait image"
                                      className="absolute bottom-0.5 right-0.5 flex size-4 items-center justify-center rounded bg-black/80 text-white"
                                    >
                                      <Smartphone className="size-2.5" />
                                    </span>
                                  )}
                                </Link>

                                {/* Slide Info */}
                                <div className="min-w-0">
                                  <Link
                                    href={`/dashboard/banners/${slide.id}`}
                                    className="font-semibold text-xs text-neutral-900 hover:underline block truncate max-w-xs"
                                  >
                                    {slide.title || (
                                      <span className="italic text-neutral-400 font-normal">
                                        (Image-only visual)
                                      </span>
                                    )}
                                  </Link>
                                  <p className="text-[11px] text-neutral-500 truncate max-w-xs">
                                    {slide.subtitle || `Slide ${idx + 1} of Hero Slideshow`}
                                  </p>
                                </div>
                              </div>

                              {/* Center: CTA & Target Link */}
                              <div className="hidden sm:block min-w-40 text-left">
                                <p className="text-[11px] font-semibold text-neutral-800">
                                  {slide.ctaText || "Clickable Image"}
                                </p>
                                <p className="text-[10px] font-mono text-neutral-500 truncate max-w-[180px]">
                                  {slide.ctaLink ? `→ ${slide.ctaLink}` : "No link"}
                                </p>
                              </div>

                              {/* Right: Slide Status Toggle & Actions */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => handleToggleActive(slide.id, slide.isActive)}
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition cursor-pointer ${
                                    slide.isActive
                                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                      : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                                  }`}
                                >
                                  {slide.isActive ? "Active" : "Inactive"}
                                </button>

                                <Link
                                  href={`/dashboard/banners/${slide.id}`}
                                  title="Edit Slide"
                                  className="inline-flex size-7 items-center justify-center rounded border border-black/10 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-black transition"
                                >
                                  <Pencil className="size-3" />
                                </Link>

                                <button
                                  type="button"
                                  title="Delete Slide"
                                  onClick={() => setBannersToDelete([slide.id])}
                                  className="inline-flex size-7 items-center justify-center rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================ */}
            {/* SECTION 2: MIDDLE (MOTION SECTION)                               */}
            {/* ================================================================ */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 hover:bg-neutral-50/40 transition bg-white">
              {/* Left: Position & Section Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200 text-neutral-800 font-mono text-xs font-semibold shadow-xs">
                  2
                </div>

                {/* Preview Thumbnail */}
                <div className="relative aspect-[16/9] w-24 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-neutral-900 shadow-xs">
                  {middleBanner?.desktopImageUrl ? (
                    <Image
                      src={middleBanner.desktopImageUrl}
                      alt="Middle Motion Banner"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-white/50">
                      Empty
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Middle (Motion Section)
                    </h3>
                    <span className="inline-flex items-center rounded-md bg-black/[0.06] px-2 py-0.5 text-[10px] font-medium text-black/75">
                      Middle of Homepage
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Full-width editorial motion banner displayed between collections.
                  </p>
                  {middleBanner?.ctaLink && (
                    <p className="mt-0.5 font-mono text-[10px] text-neutral-400">
                      Target: {middleBanner.ctaLink}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Status Switch & Edit Button */}
              <div className="flex items-center gap-2.5">
                {middleBanner ? (
                  <>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleToggleActive(middleBanner.id, middleBanner.isActive)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                        middleBanner.isActive
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                      }`}
                    >
                      {middleBanner.isActive ? "Active (Visible)" : "Inactive (Hidden)"}
                    </button>

                    <Link
                      href={`/dashboard/banners/${middleBanner.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition shadow-2xs"
                    >
                      <Pencil className="size-3.5" /> Edit Banner
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard/banners/new?placement=MIDDLE"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3.5 text-xs font-medium text-white transition hover:bg-black/85 shadow-sm"
                  >
                    <Plus className="size-3.5" /> Add Middle Banner
                  </Link>
                )}
              </div>
            </div>

            {/* ================================================================ */}
            {/* SECTION 3: DENIM CAROUSEL (COLLECTION SLIDES)                    */}
            {/* ================================================================ */}
            <div className="bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 hover:bg-neutral-50/40 transition">
                {/* Left: Position & Section Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200 text-neutral-800 font-mono text-xs font-semibold shadow-xs">
                    3
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        Denim Carousel (Collection Slides)
                      </h3>
                      <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                        {denimCarouselBanners.length} {denimCarouselBanners.length === 1 ? "Slide" : "Slides"}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-black/[0.06] px-2 py-0.5 text-[10px] font-medium text-black/75">
                        Middle Carousel
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Draggable looping model showcase cards. Drag to reorder, click to edit cuts and destination links.
                    </p>
                  </div>
                </div>

                {/* Right: Section Actions & Slide Expand Toggle */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => carouselUploadRef.current?.click()}
                    disabled={isUploadingCarouselSlide}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingCarouselSlide ? (
                      <>
                        <LoaderCircle className="size-3.5 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="size-3.5" /> Upload Slides
                      </>
                    )}
                  </button>

                  <Link
                    href="/dashboard/banners/new?placement=DENIM_CAROUSEL"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 shadow-2xs"
                  >
                    <Plus className="size-3.5" /> Custom Slide
                  </Link>

                  <button
                    type="button"
                    onClick={() => setCarouselExpanded(!carouselExpanded)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3.5 text-xs font-medium text-white transition hover:bg-black/85 shadow-sm cursor-pointer"
                  >
                    <span>{carouselExpanded ? "Hide Slides" : `View Slides (${denimCarouselBanners.length})`}</span>
                    {carouselExpanded ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Hidden file input for uploading slides into carousel */}
              <input
                type="file"
                ref={carouselUploadRef}
                multiple
                accept="image/png,image/jpeg,image/webp,image/avif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleUploadCarouselSlides(e.target.files)
                  }
                }}
              />

              {carouselExpanded && (
                <div className="border-t border-black/10 bg-neutral-50/70 p-4 sm:p-5">
                  <div className="rounded-xl border border-black/10 bg-white p-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-3.5 text-neutral-700" />
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                            Slides Inside Denim Carousel ({denimCarouselBanners.length})
                          </h4>
                        </div>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          {denimCarouselBanners.length === 0
                            ? "Currently showing 5 default cutout model slides. Add your own custom slides below to replace them."
                            : "Drag any slide to rearrange order. Click edit to customize cut name or product link."}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUploadingCarouselSlide}
                          onClick={() => carouselUploadRef.current?.click()}
                          className="inline-flex h-7 items-center gap-1 rounded-md bg-black px-2.5 text-[11px] font-semibold text-white hover:bg-neutral-800 transition cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <Plus className="size-3" /> Quick Upload
                        </button>
                        <Link
                          href="/dashboard/banners/new?placement=DENIM_CAROUSEL"
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-black/15 bg-white px-2.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50 transition shadow-2xs"
                        >
                          <Pencil className="size-3" /> Detailed New Slide
                        </Link>
                      </div>
                    </div>

                    {denimCarouselBanners.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-xs text-neutral-500">
                          Storefront is currently using the 5 built-in default model slides (Skinny, Bootcut, Low-Rise, Straight, Relaxed).
                        </p>
                        <button
                          type="button"
                          onClick={() => carouselUploadRef.current?.click()}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800 cursor-pointer"
                        >
                          <Plus className="size-3.5" /> Upload First Slide
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 divide-y divide-black/5">
                        {denimCarouselBanners.map((slide, idx) => (
                          <div
                            key={slide.id}
                            draggable
                            onDragStart={(e) => handleCarouselSlideDragStart(idx, e)}
                            onDragOver={(e) => handleCarouselSlideDragOver(idx, e)}
                            onDrop={(e) => handleCarouselSlideDrop(idx, e)}
                            className={`flex flex-wrap items-center justify-between gap-3 py-2.5 px-2 rounded-lg transition ${
                              dragOverCarouselIdx === idx
                                ? "bg-blue-50 border-2 border-dashed border-blue-400"
                                : "hover:bg-neutral-50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="cursor-grab text-neutral-400 hover:text-black">
                                <GripVertical className="size-4" />
                              </span>
                              <span className="font-mono text-xs text-neutral-500 w-4">
                                {idx + 1}
                              </span>
                              <div className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden rounded border border-black/10 bg-neutral-100">
                                <Image
                                  src={slide.desktopImageUrl}
                                  alt={slide.title || "Slide"}
                                  fill
                                  sizes="48px"
                                  className="object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-neutral-900 truncate max-w-[200px]">
                                  {slide.title || "Untitled Slide"}
                                </p>
                                <p className="text-[10px] font-mono text-neutral-400 truncate max-w-[200px]">
                                  {slide.ctaLink ? `→ ${slide.ctaLink}` : "No link"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleToggleActive(slide.id, slide.isActive)}
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition cursor-pointer ${
                                  slide.isActive
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                                }`}
                              >
                                {slide.isActive ? "Active" : "Inactive"}
                              </button>

                              <Link
                                href={`/dashboard/banners/${slide.id}`}
                                title="Edit Slide"
                                className="inline-flex size-7 items-center justify-center rounded border border-black/10 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-black transition"
                              >
                                <Pencil className="size-3" />
                              </Link>

                              <button
                                type="button"
                                title="Delete Slide"
                                onClick={() => setBannersToDelete([slide.id])}
                                className="inline-flex size-7 items-center justify-center rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================ */}
            {/* SECTION 4: DENIM EDITORIAL GRID (3 IMAGES)                       */}
            {/* ================================================================ */}
            <div className="bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 hover:bg-neutral-50/40 transition">
                {/* Left: Position & Section Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200 text-neutral-800 font-mono text-xs font-semibold shadow-xs">
                    4
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        Denim Editorial Grid (3 Images)
                      </h3>
                      <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                        {editorialBanners.length}/3 Custom Slots
                      </span>
                      <span className="inline-flex items-center rounded-md bg-black/[0.06] px-2 py-0.5 text-[10px] font-medium text-black/75">
                        Editorial Section
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      2 side-by-side square panels followed by a wide banner underneath. Change images, labels, and target links.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditorialExpanded(!editorialExpanded)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3.5 text-xs font-medium text-white transition hover:bg-black/85 shadow-sm cursor-pointer"
                  >
                    <span>{editorialExpanded ? "Hide Slots" : "Manage 3 Slots"}</span>
                    {editorialExpanded ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {editorialExpanded && (
                <div className="border-t border-black/10 bg-neutral-50/70 p-4 sm:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        slotNum: 0,
                        title: "Slot 1: Top-Left Square",
                        ratio: "Aspect 1:1",
                        defaultImg: "/images/products/product6.png",
                        defaultDesc: "Model sitting in a denim set on a chair",
                        banner: editorialBanners.find((b) => b.position === 0),
                      },
                      {
                        slotNum: 1,
                        title: "Slot 2: Top-Right Square",
                        ratio: "Aspect 1:1",
                        defaultImg: "/images/products/product7.png",
                        defaultDesc: "Model sitting in denim beside greenery",
                        banner: editorialBanners.find((b) => b.position === 1),
                      },
                      {
                        slotNum: 2,
                        title: "Slot 3: Bottom Wide Banner",
                        ratio: "Aspect 20:9",
                        defaultImg: "/images/products/product8.png",
                        defaultDesc: "Model reclining in denim look across screens",
                        banner: editorialBanners.find((b) => b.position === 2),
                      },
                    ].map((slot) => {
                      const activeBanner = slot.banner
                      const imgSrc = activeBanner?.desktopImageUrl || slot.defaultImg

                      return (
                        <div
                          key={slot.slotNum}
                          className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-4 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between pb-2 border-b border-black/5">
                              <div>
                                <h4 className="text-xs font-semibold text-neutral-900">{slot.title}</h4>
                                <span className="text-[10px] font-mono text-neutral-400">{slot.ratio}</span>
                              </div>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                                  activeBanner
                                    ? activeBanner.isActive
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-neutral-100 text-neutral-600"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {activeBanner ? (activeBanner.isActive ? "Custom" : "Hidden") : "Default"}
                              </span>
                            </div>

                            <div className="mt-3 relative w-full aspect-video rounded-lg overflow-hidden border border-black/10 bg-neutral-100">
                              <Image
                                src={imgSrc}
                                alt={activeBanner?.title || slot.defaultDesc}
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            </div>

                            <div className="mt-2.5">
                              <p className="text-xs font-medium text-neutral-800 truncate">
                                {activeBanner?.title || slot.defaultDesc}
                              </p>
                              <p className="mt-0.5 font-mono text-[10px] text-neutral-400 truncate">
                                Link: {activeBanner?.ctaLink || "/collections"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                            {activeBanner ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => handleToggleActive(activeBanner.id, activeBanner.isActive)}
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition cursor-pointer ${
                                    activeBanner.isActive
                                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                      : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                                  }`}
                                >
                                  {activeBanner.isActive ? "Active" : "Hidden"}
                                </button>

                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={`/dashboard/banners/${activeBanner.id}`}
                                    className="inline-flex h-7 items-center gap-1 rounded border border-black/15 bg-white px-2.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50 transition shadow-2xs"
                                  >
                                    <Pencil className="size-3" /> Edit
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => setBannersToDelete([activeBanner.id])}
                                    title="Reset to default"
                                    className="inline-flex size-7 items-center justify-center rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                                  >
                                    <Trash2 className="size-3" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <Link
                                href={`/dashboard/banners/new?placement=EDITORIAL&position=${slot.slotNum}`}
                                className="w-full inline-flex h-7 items-center justify-center gap-1 rounded bg-black px-3 text-[11px] font-medium text-white hover:bg-neutral-800 transition shadow-xs"
                              >
                                <Plus className="size-3" /> Upload Custom Slot {slot.slotNum + 1}
                              </Link>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================ */}
            {/* SECTION 5: BOTTOM (PRODUCT SECTION)                              */}
            {/* ================================================================ */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 hover:bg-neutral-50/40 transition bg-white">
              {/* Left: Position & Section Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200 text-neutral-800 font-mono text-xs font-semibold shadow-xs">
                  5
                </div>

                {/* Preview Thumbnail */}
                <div className="relative aspect-[16/9] w-24 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-neutral-900 shadow-xs">
                  {bottomBanner?.desktopImageUrl ? (
                    <Image
                      src={bottomBanner.desktopImageUrl}
                      alt="Bottom Product Banner"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-white/50">
                      Empty
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Bottom (Product Section)
                    </h3>
                    <span className="inline-flex items-center rounded-md bg-black/[0.06] px-2 py-0.5 text-[10px] font-medium text-black/75">
                      Bottom of Homepage
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Product craftsmanship and collection spotlight banner.
                  </p>
                  {bottomBanner?.ctaLink && (
                    <p className="mt-0.5 font-mono text-[10px] text-neutral-400">
                      Target: {bottomBanner.ctaLink}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Status Switch & Edit Button */}
              <div className="flex items-center gap-2.5">
                {bottomBanner ? (
                  <>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleToggleActive(bottomBanner.id, bottomBanner.isActive)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                        bottomBanner.isActive
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                      }`}
                    >
                      {bottomBanner.isActive ? "Active (Visible)" : "Inactive (Hidden)"}
                    </button>

                    <Link
                      href={`/dashboard/banners/${bottomBanner.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition shadow-2xs"
                    >
                      <Pencil className="size-3.5" /> Edit Banner
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard/banners/new?placement=BOTTOM"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3.5 text-xs font-medium text-white transition hover:bg-black/85 shadow-sm"
                  >
                    <Plus className="size-3.5" /> Add Bottom Banner
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Media Library Dialog */}
      <BannerMediaLibraryDialog
        open={mediaLibraryOpen}
        onOpenChange={setMediaLibraryOpen}
        onSelectImage={async (img) => {
          setMediaLibraryOpen(false)
          startTransition(async () => {
            const addRes = await addHeroSlideAction({
              desktopImageKey: img.objectKey,
              title: null,
              subtitle: null,
              ctaText: null,
              ctaLink: "/collections",
            })
            if (addRes.status === "success") {
              toast.success("Slide added to Hero Carousel from library!")
              router.refresh()
            } else {
              toast.error(addRes.message || "Failed to add slide.")
            }
          })
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!bannersToDelete}
        onOpenChange={(open) => !open && setBannersToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete slide?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this slide from the Hero Carousel? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Slide
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
