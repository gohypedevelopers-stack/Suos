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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { ProductDetail } from "@/components/product/productData"
import { SizeChartModal } from "@/components/product/SizeChartModal"

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
        "inline-flex cursor-pointer items-center justify-center border text-[13px] font-normal leading-none transition-[background-color,border-color,color,transform,font-weight] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
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

import { useCart } from "@/lib/cart-context"
import type { ProductCard } from "@/components/product/productData"

export function ProductSummary({
  product,
}: {
  product: ProductDetail
}) {
  const [selectedColor, setSelectedColor] = useState(product.colorName)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[1] ?? product.sizes[0]
  )
  const { addToCart, setIsCartOpen } = useCart()

  const productCard: ProductCard = {
    id: product.id || product.slug,
    title: product.title,
    slug: product.slug,
    image: product.gallery[0]?.src || "",
    alt: product.title,
    sizes: product.sizes,
    swatches: product.colors.map((c) => c.value),
    gallery: product.gallery.map((g) => g.src),
    price: product.price,
  }

  const handleAddToCart = () => {
    addToCart(productCard, selectedSize)
    setIsCartOpen(true)
  }

  return (
    <aside className="self-start w-full min-w-0 max-w-full [overflow-anchor:none] xl:sticky xl:top-[calc(var(--header-stack-height)+24px)]">
      <div className="space-y-5 text-black w-full min-w-0 max-w-full xl:w-[573px] xl:max-w-[573px] xl:justify-self-end">
        <div className="space-y-1">
          <p className="w-fit text-[12px] sm:text-[13px] font-normal uppercase leading-[17px] tracking-normal text-black/45">
            {product.editLabel}
          </p>
          <h1 className="font-heading text-[20px] sm:text-[24px] font-normal uppercase leading-[1.05] tracking-[-0.04em]">
            {product.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-end gap-2.5">
              {product.originalPrice ? (
                <span className="text-[15px] sm:text-[17px] font-normal leading-[20px] text-black/45 line-through">
                  {product.originalPrice}
                </span>
              ) : null}
              <span className="font-sans text-[16px] sm:text-[17px] font-[500] leading-[20px] tracking-normal">
                {product.price}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-black">
            <span className="text-[13px] sm:text-[15px] font-normal uppercase leading-none text-black/45">
              {product.sold}
            </span>
            <span className="text-[13px] sm:text-[15px] font-normal leading-none text-black/25">|</span>
            <span className="inline-flex items-center gap-1 text-[13px] sm:text-[15px] font-[500] leading-none text-black">
              <Star className="size-3.5 fill-[#d08b21] text-[#d08b21]" />
              {product.rating}
            </span>
          </div>
        </div>

        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] sm:text-[13px] font-normal uppercase text-black/45">
              Color{" "}
              <span className="font-[500] text-black">{selectedColor}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                    "flex h-[36px] w-[62px] sm:h-[40px] sm:w-[75px] cursor-pointer items-stretch justify-stretch bg-white transition-[box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45",
                    isSelected
                      ? "border-[2px] border-black p-[3px]"
                      : "border border-neutral-200 p-0"
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

        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] sm:text-[13px] font-normal uppercase text-black/45">
              Size <span className="font-[500] text-black">{selectedSize}</span>
            </p>
            <SizeChartModal images={product.sizeGuideImages} fitType={product.fitType}>
              <button
                type="button"
                className="group inline-flex flex-col items-start pb-0.5 text-[12px] sm:text-[13px] font-normal uppercase leading-none text-black/45 transition-colors duration-200 hover:text-black focus-visible:text-black cursor-pointer"
              >
                <span>View Size Chart</span>
                <span
                  aria-hidden="true"
                  className="mt-[2px] h-px w-full origin-left scale-x-0 bg-black transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </button>
            </SizeChartModal>
          </div>

          <div id="size-guide" className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 sm:gap-2">
            {product.sizes.map((size) => (
              <OptionButton
                key={size}
                active={selectedSize === size}
                onClick={() => setSelectedSize(size)}
                className="h-10 min-w-0 px-2 sm:px-3 text-[12px] sm:text-[13px]"
              >
                {size}
              </OptionButton>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-12 w-full cursor-pointer items-center justify-center border border-black bg-white text-[13px] font-[500] uppercase tracking-normal transition-[background-color,color] duration-200 ease-out hover:bg-black hover:text-white active:scale-[0.99]"
          >
            Add To Cart
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-12 w-full cursor-pointer items-center justify-center bg-black text-white text-[13px] font-[500] uppercase tracking-normal transition-opacity duration-200 ease-out hover:opacity-90 active:scale-[0.99]"
          >
            Buy Now
          </button>
        </div>

        <section className="space-y-2.5 pt-1 w-full min-w-0">
          <p className="text-[12px] sm:text-[13px] font-normal uppercase text-black/45">
            Delivery T&C
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 w-full min-w-0">
            {product.deliveryPerks.map((perk) => {
              const Icon = deliveryIcons[perk.icon]

              return (
                <div
                  key={perk.label}
                  title={`${perk.label} · ${perk.detail}`}
                  aria-label={`${perk.label}, ${perk.detail}`}
                  className="flex min-h-[72px] sm:min-h-[85px] w-full min-w-0 flex-col items-center justify-center gap-1 border border-black/15 bg-white p-2 text-center text-black"
                >
                  <Icon className="size-4 sm:size-5 shrink-0 stroke-[1.7] text-black" />
                  <div className="space-y-0.5 w-full min-w-0 overflow-hidden">
                    <p className="truncate text-[11px] sm:text-[12px] font-medium uppercase leading-tight text-black">
                      {perk.label}
                    </p>
                    <p className="truncate text-[9px] sm:text-[10px] font-normal uppercase leading-tight text-black/55">
                      {perk.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <Accordion
          id="details"
          type="single"
          defaultValue="product-details"
          collapsible
          className="border-t border-black/15"
        >
          <AccordionItem
            value="product-details"
            className="border-b border-black/15"
          >
            <AccordionTrigger className="h-[52px] items-center rounded-none py-0 text-[15px] font-[500] uppercase leading-none tracking-normal hover:no-underline">
              Product Details
            </AccordionTrigger>
            <AccordionContent className="w-full min-w-0 max-w-full pb-5 font-sans text-[12px] sm:text-[13px] font-normal uppercase leading-[1.55] text-black/68 break-words">
              {product.details && product.details.length > 0 ? (
                <div className="space-y-3 min-w-0">
                  {product.description ? <p className="break-words">{product.description}</p> : null}
                  <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 min-w-0">
                    {product.details.map((detail, idx) => (
                      <div key={idx} className="flex gap-2 min-w-0">
                        <span className="font-[500] text-black shrink-0">{detail.name}:</span>
                        <span className="break-words min-w-0">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="break-words">{product.detailsBody || product.description || "No details provided."}</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="details-and-care"
            className="border-b border-black/15"
          >
            <AccordionTrigger className="h-[52px] items-center rounded-none py-0 text-[15px] font-[500] uppercase leading-none tracking-normal hover:no-underline">
              Details &amp; Care
            </AccordionTrigger>
            <AccordionContent className="w-full min-w-0 max-w-full pb-5 font-sans text-[12px] sm:text-[13px] font-normal uppercase leading-[1.55] text-black/68 break-words">
              <ul className="space-y-2 min-w-0">
                {product.careNotes.map((note) => (
                  <li key={note} className="break-words">{note}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="shipping-and-payment"
            className="border-b border-black/15"
          >
            <AccordionTrigger className="h-[52px] items-center rounded-none py-0 text-[15px] font-[500] uppercase leading-none tracking-normal hover:no-underline">
              Shipping &amp; Payment
            </AccordionTrigger>
            <AccordionContent className="w-full min-w-0 max-w-full pb-5 font-sans text-[12px] sm:text-[13px] font-normal uppercase leading-[1.55] text-black/68 break-words">
              <ul className="space-y-2 min-w-0">
                {product.shippingNotes.map((note) => (
                  <li key={note} className="break-words">{note}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="space-y-4 pt-8">
          <h2 className="text-[24px] font-normal uppercase">
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
