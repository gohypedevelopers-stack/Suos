"use client"

import { useEffect, useRef, type PointerEvent } from "react"

type ContinuousCarouselOptions = {
  slideCount: number
  autoScrollSpeed?: number
  hoverScrollSpeed?: number
}

export function useContinuousDraggableCarousel({
  slideCount,
  autoScrollSpeed = 0.09,
  hoverScrollSpeed = 0.022,
}: ContinuousCarouselOptions) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const loopDistanceRef = useRef(0)
  const isHoveringRef = useRef(false)
  const isDraggingRef = useRef(false)
  const dragRef = useRef<{ pointerId: number; startX: number; startOffset: number } | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animationFrame = 0
    let previousTime = performance.now()
    let currentSpeed = autoScrollSpeed

    const normalizeOffset = (offset: number) => {
      const loopDistance = loopDistanceRef.current
      if (!loopDistance) return offset

      while (offset > -loopDistance) offset -= loopDistance
      while (offset <= -loopDistance * 2) offset += loopDistance
      return offset
    }

    const render = () => {
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
    }

    const measure = () => {
      const firstSlideOfMiddleCopy = track.children[slideCount] as HTMLElement | undefined
      const loopDistance = firstSlideOfMiddleCopy?.offsetLeft ?? 0
      if (!loopDistance) return

      loopDistanceRef.current = loopDistance
      offsetRef.current = normalizeOffset(offsetRef.current || -loopDistance)
      render()
    }

    const tick = (time: number) => {
      const elapsed = Math.min(time - previousTime, 64)
      previousTime = time
      const targetSpeed = isDraggingRef.current
        ? 0
        : isHoveringRef.current
          ? hoverScrollSpeed
          : autoScrollSpeed

      currentSpeed += (targetSpeed - currentSpeed) * 0.08

      if (!isDraggingRef.current && loopDistanceRef.current) {
        offsetRef.current = normalizeOffset(offsetRef.current - currentSpeed * elapsed)
        render()
      }

      animationFrame = requestAnimationFrame(tick)
    }

    measure()
    window.addEventListener("resize", measure)
    animationFrame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("resize", measure)
      cancelAnimationFrame(animationFrame)
    }
  }, [autoScrollSpeed, hoverScrollSpeed, slideCount])

  const normalizeOffset = (offset: number) => {
    const loopDistance = loopDistanceRef.current
    if (!loopDistance) return offset

    while (offset > -loopDistance) offset -= loopDistance
    while (offset <= -loopDistance * 2) offset += loopDistance
    return offset
  }

  const renderOffset = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
    }
  }

  const finishDrag = (pointerId: number) => {
    const viewport = viewportRef.current
    if (viewport?.hasPointerCapture(pointerId)) {
      viewport.releasePointerCapture(pointerId)
    }

    dragRef.current = null
    isDraggingRef.current = false
    viewport?.removeAttribute("data-dragging")
  }

  return {
    viewportRef,
    trackRef,
    onPointerEnter: () => {
      isHoveringRef.current = true
    },
    onPointerLeave: () => {
      isHoveringRef.current = false
    },
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return

      event.preventDefault()
      const viewport = viewportRef.current
      if (!viewport) return

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startOffset: offsetRef.current,
      }
      isDraggingRef.current = true
      viewport.dataset.dragging = "true"
      viewport.setPointerCapture(event.pointerId)
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return

      event.preventDefault()
      offsetRef.current = normalizeOffset(drag.startOffset + event.clientX - drag.startX)
      renderOffset()
    },
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
      if (dragRef.current?.pointerId === event.pointerId) {
        finishDrag(event.pointerId)
      }
    },
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => {
      if (dragRef.current?.pointerId === event.pointerId) {
        finishDrag(event.pointerId)
      }
    },
  }
}
