"use client"

import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function SizeChartModal({
  images,
  children,
}: {
  images?: string[]
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  if (!images || images.length === 0) {
    return <>{children}</>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90dvh] w-[90vw] max-w-4xl flex-col overflow-hidden p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">Product Size Guide</DialogTitle>
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="flex flex-col items-center">
            {images.map((img, i) => (
              <div key={i} className="relative w-full overflow-hidden" style={{ minHeight: "500px" }}>
                <Image
                  src={img}
                  alt={`Size guide page ${i + 1}`}
                  width={1200}
                  height={1600}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 1024px) 90vw, 1200px"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-black/10 bg-white p-4 sm:px-6">
          <Button asChild className="w-full rounded-none uppercase" size="lg">
            <Link href="/size-guide" onClick={() => setOpen(false)}>
              View Full Size Guide Page
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

