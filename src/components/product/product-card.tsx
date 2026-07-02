"use client";

import Link from "next/link";
import type { Product } from "@/lib/api/types";
import { useAddToCart } from "@/hooks/use-cart";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatPrice(currency: string, value: string | number) {
  return `${currency} ${Number(value).toFixed(2)}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const { open: openCartDrawer } = useCartDrawer();

  const [flatImage, modelImage] = (product.images ?? []).map((image) => image.image_url);
  const currencyCode = product.currency_detail.code;
  const inStock = product.is_active && product.stock_quantity > 0;
  const price = Number(product.price);
  const comparePrice = product.compare_at_price !== undefined ? Number(product.compare_at_price) : undefined;
  const onSale = comparePrice !== undefined && comparePrice > price;
  const savings = onSale ? comparePrice! - price : 0;

  // One badge max: sold-out beats sale beats new.
  const badge = !inStock
    ? { label: "Sold out", tone: "bg-charcoal" }
    : onSale
      ? { label: `Save ${formatPrice(currencyCode, savings)}`, tone: "bg-oxblood" }
      : product.is_new
        ? { label: "New", tone: "bg-brass" }
        : null;

  const handleAddToCart = () => {
    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      { onSuccess: () => openCartDrawer() },
    );
  };

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        <div className="relative aspect-[3/4] bg-charcoal/10">
          {flatImage && (
            // eslint-disable-next-line @next/next/no-img-element -- media host isn't confirmed yet, see skill notes
            <img
              src={flatImage}
              alt={product.name}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                modelImage && "group-hover:opacity-0",
              )}
            />
          )}
          {modelImage && (
            // eslint-disable-next-line @next/next/no-img-element -- media host isn't confirmed yet, see skill notes
            <img
              src={modelImage}
              alt={`${product.name} styled`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          {badge && (
            <span
              className={cn(
                "absolute left-3 top-3 z-10 px-2 py-1 font-body text-[10px] uppercase tracking-widest text-bone",
                badge.tone,
              )}
            >
              {badge.label}
            </span>
          )}
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link href={`/products/${product.slug}`}>
            <p className="font-body text-sm text-ink">{product.name}</p>
          </Link>
          <p className="mt-1 font-body text-caption">
            {onSale ? (
              <>
                <span className="mr-2 text-stone line-through">
                  {formatPrice(currencyCode, comparePrice!)}
                </span>
                <span className="text-oxblood">{formatPrice(currencyCode, price)}</span>
              </>
            ) : (
              <span className="text-stone">{formatPrice(currencyCode, price)}</span>
            )}
          </p>
        </div>
        <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            disabled={!inStock || addToCart.isPending}
            onClick={handleAddToCart}
          >
            {addToCart.isPending ? "Adding…" : "Add"}
          </Button>
        </div>
      </div>
      {!isAuthenticated && (
        <p className="mt-1 font-body text-[10px] text-stone">Sign in to add to bag</p>
      )}
    </div>
  );
}
