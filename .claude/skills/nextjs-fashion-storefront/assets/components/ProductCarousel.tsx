"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type ProductCardData } from "./ProductCard";

export function ProductCarousel({
  overline,
  title,
  viewAllHref,
  products,
}: {
  overline?: string;
  title: string;
  viewAllHref: string;
  products: ProductCardData[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 300;
    el.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          {overline && (
            <p className="mb-1 text-xs uppercase tracking-widest text-stone">
              {overline}
            </p>
          )}
          <h2 className="font-display text-2xl text-ink">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="hidden text-xs uppercase tracking-widest text-ink underline underline-offset-4 md:inline"
        >
          View all
        </Link>
      </div>

      <div className="group/carousel relative">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="w-[45%] flex-none snap-start sm:w-[30%] lg:w-[23%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Arrow controls: hidden on touch, revealed on hover for desktop */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy("left")}
          className="absolute left-0 top-1/3 hidden -translate-x-1/2 rounded-full bg-bone p-2 opacity-0 shadow-md transition-opacity group-hover/carousel:opacity-100 md:block"
        >
          <ChevronLeft className="h-4 w-4 text-ink" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy("right")}
          className="absolute right-0 top-1/3 hidden translate-x-1/2 rounded-full bg-bone p-2 opacity-0 shadow-md transition-opacity group-hover/carousel:opacity-100 md:block"
        >
          <ChevronRight className="h-4 w-4 text-ink" />
        </button>
      </div>

      <Link
        href={viewAllHref}
        className="mt-4 block text-center text-xs uppercase tracking-widest text-ink underline underline-offset-4 md:hidden"
      >
        View all
      </Link>
    </section>
  );
}
