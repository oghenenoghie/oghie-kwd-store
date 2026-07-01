"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/api/types";
import { useAddToCart } from "@/hooks/use-cart";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const { open: openCartDrawer } = useCartDrawer();

  const handleAddToCart = () => {
    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      { onSuccess: () => openCartDrawer() },
    );
  };

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative aspect-[3/4] bg-charcoal/10"
        >
          {!product.in_stock && (
            <span className="absolute left-3 top-3 z-10 bg-oxblood px-2 py-1 font-body text-[10px] uppercase tracking-widest text-bone">
              Sold out
            </span>
          )}
        </motion.div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link href={`/products/${product.slug}`}>
            <p className="font-body text-sm text-ink">{product.name}</p>
          </Link>
          <p className="mt-1 font-body text-caption text-stone">
            {product.currency} {product.price}
          </p>
        </div>
        <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            disabled={!product.in_stock || addToCart.isPending}
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
