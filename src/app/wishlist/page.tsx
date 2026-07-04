"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRemoveFromWishlist, useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { data: items, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-md px-6 py-16 text-center">
        <h1 className="font-display text-display-m text-ink">Your wishlist</h1>
        <p className="mt-2 font-body text-sm text-stone">
          <Link href="/account" className="text-brass underline underline-offset-4">
            Sign in
          </Link>{" "}
          to see items you&rsquo;ve saved.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <h1 className="font-display text-display-l text-ink">Your wishlist</h1>

      {isLoading ? (
        <p className="mt-10 font-body text-sm text-stone">Loading…</p>
      ) : !items || items.length === 0 ? (
        <p className="mt-10 font-body text-sm text-stone">
          Nothing saved yet.{" "}
          <Link href="/products" className="text-brass underline underline-offset-4">
            Browse products
          </Link>
          .
        </p>
      ) : (
        <div className="@container mt-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 @lg:grid-cols-3 @2xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id}>
                <ProductCard product={item.product_detail} />
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full"
                  disabled={removeFromWishlist.isPending}
                  onClick={() => removeFromWishlist.mutate(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
