"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/api/types";
import { ProductCard } from "./product-card";

export function ProductCarousel({
  overline,
  title,
  viewAllHref,
  products,
}: {
  overline?: string;
  title: string;
  viewAllHref: string;
  products: Product[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollBy = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 300;
    el.scrollBy({ left: direction === "left" ? -cardWidth * 2 : cardWidth * 2, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          {overline && (
            <p className="font-body text-caption uppercase tracking-widest text-stone">{overline}</p>
          )}
          <h2 className="mt-1 font-display text-display-m text-ink">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="hidden font-body text-caption uppercase tracking-widest text-ink underline underline-offset-4 hover:text-brass md:inline"
        >
          View all
        </Link>
      </div>

      <div className="group/carousel relative">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[70%] flex-none snap-start sm:w-[38%] lg:w-[23%]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy("left")}
          className="absolute left-0 top-1/3 hidden -translate-x-1/2 items-center justify-center bg-bone p-2 opacity-0 shadow-md transition-opacity group-hover/carousel:opacity-100 md:flex"
        >
          <ChevronLeft size={16} className="text-ink" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy("right")}
          className="absolute right-0 top-1/3 hidden translate-x-1/2 items-center justify-center bg-bone p-2 opacity-0 shadow-md transition-opacity group-hover/carousel:opacity-100 md:flex"
        >
          <ChevronRight size={16} className="text-ink" />
        </button>
      </div>

      <Link
        href={viewAllHref}
        className="mt-6 block text-center font-body text-caption uppercase tracking-widest text-ink underline underline-offset-4 md:hidden"
      >
        View all
      </Link>
    </section>
  );
}
