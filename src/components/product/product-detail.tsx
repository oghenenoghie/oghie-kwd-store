"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/api/types";
import { useAddToCart } from "@/hooks/use-cart";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { useAuth } from "@/hooks/use-auth";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatPrice(currency: string, value: string | number) {
  return `${currency} ${Number(value).toFixed(2)}`;
}

export function ProductDetail({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const { open: openCartDrawer } = useCartDrawer();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const currencyCode = product.currency_detail.code;
  const inStock = product.is_active && product.stock_quantity > 0;
  const price = Number(product.price);
  const comparePrice =
    product.compare_at_price !== undefined ? Number(product.compare_at_price) : undefined;
  const onSale = comparePrice !== undefined && comparePrice > price;
  const images = product.images.length > 0 ? product.images : null;

  const handleAddToCart = () => {
    addToCart.mutate(
      { productId: product.id, quantity },
      { onSuccess: () => openCartDrawer() },
    );
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-2">
      <div>
        <div className="relative aspect-[3/4] bg-charcoal/10">
          {images && (
            // eslint-disable-next-line @next/next/no-img-element -- media host isn't confirmed yet, see skill notes
            <img
              src={images[activeImage].image_url}
              alt={images[activeImage].alt_text || product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
        {images && images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "h-16 w-14 flex-shrink-0 overflow-hidden border",
                  index === activeImage ? "border-ink" : "border-ink/10",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- media host isn't confirmed yet, see skill notes */}
                <img src={image.image_url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="font-body text-caption uppercase tracking-widest text-stone">
          {product.category_detail.name}
        </p>
        <h1 className="mt-1 font-display text-display-l text-ink">{product.name}</h1>
        <p className="mt-3 font-body text-body-base">
          {onSale ? (
            <>
              <span className="mr-2 text-stone line-through">
                {formatPrice(currencyCode, comparePrice!)}
              </span>
              <span className="text-oxblood">{formatPrice(currencyCode, price)}</span>
            </>
          ) : (
            <span className="text-ink">{formatPrice(currencyCode, price)}</span>
          )}
        </p>

        {!inStock && <p className="mt-2 font-body text-caption text-oxblood">Sold out</p>}

        {product.description && (
          <p className="mt-6 font-body text-sm leading-relaxed text-stone">{product.description}</p>
        )}

        <div className="mt-8 flex items-center gap-4">
          <QuantityStepper quantity={quantity} onChange={setQuantity} disabled={!inStock} />
          <Button
            size="lg"
            className="flex-1"
            disabled={!inStock || addToCart.isPending}
            onClick={handleAddToCart}
          >
            {addToCart.isPending ? "Adding…" : inStock ? "Add to bag" : "Sold out"}
          </Button>
        </div>

        {!isAuthenticated && (
          <p className="mt-3 font-body text-caption text-stone">
            <Link href="/account" className="underline underline-offset-4 hover:text-ink">
              Sign in
            </Link>{" "}
            to add items to your bag.
          </p>
        )}

        {addToCart.isError && (
          <p className="mt-3 font-body text-caption text-oxblood">
            Couldn&rsquo;t add this to your bag. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
