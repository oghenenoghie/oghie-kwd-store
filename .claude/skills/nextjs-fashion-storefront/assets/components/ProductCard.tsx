"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type ProductCardData = {
  slug: string;
  title: string;
  flatImage: string; // product-only shot, shown by default
  modelImage?: string; // on-model shot, shown on hover if provided
  price: number;
  compareAtPrice?: number; // set when on sale
  badge?: "new" | "sale" | "sold-out";
};

function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const [hovered, setHovered] = useState(false);
  const onSale =
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;
  const savings = onSale ? product.compareAtPrice! - product.price : 0;

  const badgeLabel =
    product.badge === "sold-out"
      ? "Sold out"
      : product.badge === "sale" && onSale
        ? `Save ${formatUSD(savings)}`
        : product.badge === "new"
          ? "New"
          : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-bone">
        <Image
          src={product.flatImage}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className={`object-cover transition-opacity duration-300 ${
            hovered && product.modelImage ? "opacity-0" : "opacity-100"
          }`}
        />
        {product.modelImage && (
          <Image
            src={product.modelImage}
            alt={`${product.title} on model`}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {badgeLabel && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[11px] uppercase tracking-wide text-bone">
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-sans text-sm text-ink">{product.title}</h3>
        <p className="text-sm">
          {onSale ? (
            <>
              <span className="mr-2 text-stone line-through">
                {formatUSD(product.compareAtPrice!)}
              </span>
              <span className="text-accent">{formatUSD(product.price)}</span>
            </>
          ) : (
            <span className="text-ink">{formatUSD(product.price)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
