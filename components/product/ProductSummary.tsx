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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
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
        "inline-flex cursor-pointer items-center justify-center border text-[22px] font-normal leading-none transition-[background-color,border-color,color,transform,font-weight] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
        active
          ? "border-black bg-black font-[500] text-white"
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
    <aside className="self-start xl:sticky xl:top-[calc(var(--main-navbar-height)+1.5rem)]">
      <div className="space-y-5 text-black xl:w-[573px] xl:max-w-[573px] xl:justify-self-end">
        <div className="space-y-1">
      <p className="w-fit text-[13px] font-normal uppercase leading-[17px] tracking-normal text-black/45">
            {product.editLabel}
          </p>
          <h1 className="font-heading text-[24px] font-normal uppercase leading-[0.9] tracking-[-0.06em]">
            {product.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-end gap-3">
          <span className="text-[17px] font-normal leading-[20px] text-black/45 line-through">
                {product.originalPrice}
              </span>
          <span className="font-sans text-[17px] font-[500] leading-[20px] tracking-normal">
                {product.price}
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2 text-black">
        <span className="text-[17px] font-normal uppercase leading-[20px] text-black/45">
              {product.sold}
            </span>
        <span className="text-[17px] font-normal leading-[20px] text-black/25">|</span>
        <span className="inline-flex items-end gap-1 text-[17px] font-[500] leading-[20px] text-black">
              <Star className="h-24px w-24px fill-[#d08b21] text-[#d08b21]" />
              {product.rating}
            </span>
          </div>
        </div>

        <section className="space-y-2">
          <p className="text-[22px] font-medium">
            Description:
          </p>
          <p className="max-w-[36rem] text-justify font-sans text-[13px] font-normal uppercase leading-[1.75] text-black/68">
            {product.description}{" "}
            <Link
              href="#details"
              className="font-[500] text-black underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              See More...
            </Link>
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-normal uppercase text-black/45">
              Color{" "}
              <span className="font-[500] text-black">{selectedColor}</span>
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
                    "flex h-[40px] w-[75px] cursor-pointer items-stretch justify-stretch bg-white transition-[box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
                    isSelected
                      ? "border-[2px] border-black p-[4px]"
                      : "border-0 p-0"
                  )}
                >
                  <span
                    className="block h-full w-full"
                    style={{ backgroundColor: color.value }}
                  />
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-normal uppercase text-black/45">
              Size <span className="font-[500] text-black">{selectedSize}</span>
            </p>
            <Link
              href="#size-guide"
              className="group inline-flex flex-col items-start pb-0.5 text-[13px] font-normal uppercase leading-none text-black/45 transition-colors duration-200 hover:text-black focus-visible:text-black"
            >
              <span>View Size Chart</span>
              <span
                aria-hidden="true"
                className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
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
          className="flex h-12 w-full cursor-pointer items-center justify-center border border-black bg-white text-[22px] font-medium uppercase transition-[background-color,color] duration-200 ease-out hover:bg-black hover:text-white"
        >
          Add To Cart
        </button>

        <section className="space-y-3">
          <p className="text-[16px] font-medium text-black/45">
            Delivery T&C
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {product.deliveryPerks.map((perk) => {
              const Icon = deliveryIcons[perk.icon]

              return (
                <div
                  key={perk.label}
                  title={`${perk.label} · ${perk.detail}`}
                  aria-label={`${perk.label}, ${perk.detail}`}
                  className="flex aspect-[1.15/1] flex-col items-center justify-center gap-2 border border-black bg-white px-2 text-center text-black"
                >
                  <Icon className="size-5 stroke-[1.7] text-black" />
                  <div className="space-y-0.5">
                    <p className="text-[0.52rem] uppercase text-black">
                      {perk.label}
                    </p>
                    <p className="text-[0.6rem] uppercase text-black">
                      {perk.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section id="details" className="border-t border-black/15 pt-4">
          <h2 className="text-[22px] font-medium uppercase">
            Product Details
          </h2>
          <p className="mt-3 max-w-[36rem] font-sans text-[16px] font-normal leading-[1.72] text-black/68">
            {product.detailsBody} See More...
          </p>
        </section>

        <div className="space-y-4 border-t border-black/15 pt-3">
          <button
            type="button"
            className="block w-fit border-b border-black/55 pb-0.5 text-[22px] font-medium leading-none uppercase tracking-normal transition-opacity hover:opacity-70"
          >
            Details &amp; Care
          </button>
          <button
            type="button"
            className="block w-fit border-b border-black/55 pb-0.5 text-[22px] font-medium leading-none uppercase tracking-normal transition-opacity hover:opacity-70"
          >
            Shipping &amp; Payment
          </button>
        </div>

        <section className="space-y-4 pt-8">
          <h2 className="text-[22px] font-medium uppercase tracking-[0.08em]">
            Complete The Look
          </h2>

          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
            aria-label="Complete the look carousel"
          >
            <CarouselContent className="-ml-2">
              {product.completeLook.map((image, index) => (
                <CarouselItem
                  key={`${image.src}-${index}`}
                  className="basis-[250px] pl-2"
                >
                  <figure className="relative aspect-[3/4] overflow-hidden bg-[#efefef]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="250px"
                      style={
                        image.objectPosition
                          ? { objectPosition: image.objectPosition }
                          : undefined
                      }
                      className="object-cover"
                    />
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </div>
    </aside>
  )
}
