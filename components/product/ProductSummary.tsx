"use client"

import Image from "next/image"
import Link from "next/link"
import {
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react"
import type { ButtonHTMLAttributes } from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import type { ProductDetail } from "@/components/product/productData"

const deliveryIcons = {
  truck: Truck,
  exchange: RefreshCcw,
  shield: ShieldCheck,
  card: CreditCard,
} as const

function OptionButton({
  active,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center border text-[0.85rem] uppercase tracking-[0.08em] transition-[background-color,border-color,color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
        active
          ? "border-black bg-black text-white"
          : "border-black/15 bg-white text-black hover:border-black hover:bg-black/4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ProductSummary({
  product,
}: {
  product: ProductDetail
}) {
  const [selectedColor, setSelectedColor] = useState(product.colorName)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[1] ?? product.sizes[0]
  )

  return (
    <aside className="self-start">
      <div className="space-y-5 text-black xl:w-[573px] xl:max-w-[573px] xl:justify-self-end">
        <div className="space-y-1">
          <p className="text-[14px] font-medium uppercase tracking-[0.22em] text-black/45">
            {product.editLabel}
          </p>
          <h1 className="font-heading text-[40px] font-semibold uppercase leading-[0.9] tracking-[-0.06em]">
            {product.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-[18px] text-black/45 line-through">
                {product.originalPrice}
              </span>
              <span className="font-heading text-[28px] font-semibold tracking-[-0.04em]">
                {product.price}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 uppercase tracking-[0.14em] text-brand-black">
            <span className="text-[16px] text-brand-grey">{product.sold}</span>
            <span className="text-black/25">|</span>
            <span className="inline-flex items-center gap-1 text-[22px] font-bold leading-none">
              <Star className="h-24px w-24px fill-[#d08b21] text-[#d08b21]" />
              {product.rating}
            </span>
          </div>
        </div>

        <section className="space-y-2">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em]">
            Description:
          </p>
          <p className="max-w-[36rem] font-serif text-[0.92rem] leading-[1.75] text-black/68">
            {product.description}{" "}
            <Link
              href="#details"
              className="font-medium text-black underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              See More...
            </Link>
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.82rem] uppercase tracking-[0.08em] text-black/72">
              Color:{" "}
              <span className="font-medium text-black">{selectedColor}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {product.colors.map((color) => {
              const isSelected = color.name === selectedColor

              return (
                <button
                  key={color.name}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Select ${color.name}`}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "h-6 w-10 border transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
                    isSelected
                      ? "border-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)] ring-1 ring-black/80 ring-offset-2 ring-offset-white"
                      : "border-black/10"
                  )}
                  style={{ backgroundColor: color.value }}
                />
              )
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.82rem] uppercase tracking-[0.08em] text-black/72">
              Size: <span className="font-medium text-black">{selectedSize}</span>
            </p>
            <Link
              href="#size-guide"
              className="text-[0.68rem] uppercase tracking-[0.16em] text-black/55 underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              View Size Chart
            </Link>
          </div>

          <div id="size-guide" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {product.sizes.map((size) => (
              <OptionButton
                key={size}
                active={selectedSize === size}
                onClick={() => setSelectedSize(size)}
                className="h-10 min-w-0 px-3"
              >
                {size}
              </OptionButton>
            ))}
          </div>
        </section>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center border border-black bg-white text-[0.95rem] font-semibold uppercase tracking-[0.14em] transition-[background-color,color] duration-200 ease-out hover:bg-black hover:text-white"
        >
          Add To Cart
        </button>

        <section className="space-y-3">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/45">
            Delivery ToC
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {product.deliveryPerks.map((perk) => {
              const Icon = deliveryIcons[perk.icon]

              return (
                <div
                  key={perk.label}
                  title={`${perk.label} · ${perk.detail}`}
                  aria-label={`${perk.label}, ${perk.detail}`}
                  className="flex aspect-[1.15/1] flex-col items-center justify-center gap-2 bg-[#e3e3e3] px-2 text-center"
                >
                  <Icon className="size-5 stroke-[1.7] text-black/42" />
                  <div className="space-y-0.5">
                    <p className="text-[0.52rem] uppercase tracking-[0.12em] text-black/45">
                      {perk.label}
                    </p>
                    <p className="text-[0.6rem] uppercase tracking-[0.12em] text-black/34">
                      {perk.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section id="details" className="border-t border-black/15 pt-4">
          <h2 className="text-[0.9rem] font-semibold uppercase tracking-[0.08em]">
            Product Details
          </h2>
          <p className="mt-3 max-w-[36rem] font-serif text-[0.9rem] leading-[1.72] text-black/68">
            {product.detailsBody} See More...
          </p>
        </section>

        <div className="space-y-2 border-t border-black/15 pt-3">
          <button
            type="button"
            className="block w-fit border-b border-black/55 pb-1 text-[0.82rem] font-semibold uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
          >
            Details &amp; Care
          </button>
          <button
            type="button"
            className="block w-fit border-b border-black/55 pb-1 text-[0.82rem] font-semibold uppercase tracking-[0.08em] transition-opacity hover:opacity-70"
          >
            Shipping &amp; Payment
          </button>
        </div>

        <section className="space-y-4 pt-8">
          <h2 className="text-[0.9rem] font-semibold uppercase tracking-[0.08em]">
            Complete The Look
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {product.completeLook.map((image, index) => (
              <figure
                key={`${image.src}-${index}`}
                className="relative aspect-[4/5] overflow-hidden bg-[#efefef]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 34vw, (max-width: 1024px) 22vw, 11vw"
                  style={
                    image.objectPosition
                      ? { objectPosition: image.objectPosition }
                      : undefined
                  }
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}
