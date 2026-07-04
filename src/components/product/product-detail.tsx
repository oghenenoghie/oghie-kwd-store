"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/api/types";
import { useAddToCart } from "@/hooks/use-cart";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { useAuth } from "@/hooks/use-auth";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/hooks/use-wishlist";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionSection } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

function formatPrice(currency: string, value: string | number) {
  return `${currency} ${Number(value).toFixed(2)}`;
}

export function ProductDetail({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const { open: openCartDrawer } = useCartDrawer();
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currencyCode = product.currency_detail.code;
  const inStock = product.is_active && product.stock_quantity > 0;
  const price = Number(product.price);
  const comparePrice =
    product.compare_at_price !== undefined ? Number(product.compare_at_price) : undefined;
  const onSale = comparePrice !== undefined && comparePrice > price;
  const images = product.images.length > 0 ? product.images : null;

  const wishlistItem = wishlist?.find((item) => item.product === product.id);
  const isWishlisted = Boolean(wishlistItem);

  const badge = !inStock
    ? { label: "Sold out", tone: "bg-charcoal" }
    : onSale
      ? { label: "Sale", tone: "bg-oxblood" }
      : product.is_new
        ? { label: "New", tone: "bg-brass" }
        : null;

  const goToImage = (index: number) => {
    setActiveImage(index);
    imageRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddToCart = () => {
    addToCart.mutate(
      { productId: product.id, quantity },
      { onSuccess: () => openCartDrawer() },
    );
  };

  const handleToggleWishlist = () => {
    if (wishlistItem) removeFromWishlist.mutate(wishlistItem.id);
    else addToWishlist.mutate(product.id);
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[auto_1fr_420px]">
      {images && images.length > 1 && (
        <div className="hidden lg:flex lg:flex-col lg:gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-label={`Show image ${index + 1}`}
              onClick={() => goToImage(index)}
              className={cn(
                "h-20 w-16 flex-shrink-0 overflow-hidden border",
                index === activeImage ? "border-ink" : "border-ink/10",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- media host isn't confirmed yet, see skill notes */}
              <img src={image.image_url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {images ? (
          images.map((image, index) => (
            <div
              key={image.id}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className="relative aspect-[3/4] bg-charcoal/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- media host isn't confirmed yet, see skill notes */}
              <img
                src={image.image_url}
                alt={image.alt_text || product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="relative aspect-[3/4] bg-charcoal/10" />
        )}

        {images && images.length > 1 && (
          <div className="flex gap-2 lg:hidden">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => goToImage(index)}
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

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-start justify-between">
          {badge ? (
            <span
              className={cn(
                "px-2 py-1 font-body text-[10px] uppercase tracking-widest text-bone",
                badge.tone,
              )}
            >
              {badge.label}
            </span>
          ) : (
            <span />
          )}
          {isAuthenticated && (
            <button
              type="button"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              disabled={addToWishlist.isPending || removeFromWishlist.isPending}
              onClick={handleToggleWishlist}
              className="text-ink transition-colors hover:text-oxblood disabled:opacity-50"
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        <p className="mt-3 font-body text-caption uppercase tracking-widest text-stone">
          {product.category_detail.name}
        </p>
        <h1 className="mt-1 font-display text-display-l text-ink">{product.name}</h1>
        <p className="mt-3 font-body text-body-l">
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

        {product.average_rating !== null && (
          <p className="mt-2 font-body text-caption text-stone">
            {product.average_rating.toFixed(1)} ★ ({product.review_count} review
            {product.review_count === 1 ? "" : "s"})
          </p>
        )}

        <div className="mt-6 flex items-center gap-4">
          <QuantityStepper quantity={quantity} onChange={setQuantity} disabled={!inStock} />
          <span className="font-body text-caption text-stone">
            {inStock ? "In stock" : "Sold out"}
          </span>
        </div>

        {/* Both buttons add to cart and open the drawer - there's no separate
            instant-checkout route yet, so "Buy it now" can't skip the cart. */}
        <div className="mt-4 flex flex-col gap-3">
          <Button
            variant="secondary"
            size="lg"
            disabled={!inStock || addToCart.isPending}
            onClick={handleAddToCart}
          >
            {addToCart.isPending ? "Adding…" : inStock ? "Buy it now" : "Sold out"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            disabled={!inStock || addToCart.isPending}
            onClick={handleAddToCart}
          >
            Add to cart
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

        <Accordion type="single" collapsible defaultValue={product.description ? "description" : undefined} className="mt-8">
          {product.description && (
            <AccordionSection value="description" title="Description">
              <p>{product.description}</p>
            </AccordionSection>
          )}
          <AccordionSection value="shipping" title="Shipping & Returns">
            <p>
              See our{" "}
              <Link href="/help/shipping" className="underline underline-offset-4 hover:text-ink">
                shipping
              </Link>{" "}
              and{" "}
              <Link href="/help/returns" className="underline underline-offset-4 hover:text-ink">
                returns
              </Link>{" "}
              policies for full details.
            </p>
          </AccordionSection>
        </Accordion>

        <p className="mt-6 font-body text-caption text-stone">
          Need help?{" "}
          <Link href="/help/contact" className="underline underline-offset-4 hover:text-ink">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
