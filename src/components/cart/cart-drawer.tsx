"use client";

import { Drawer } from "vaul";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartDrawer } from "@/hooks/use-cart-drawer";
import { useActiveCart, useCheckout, useRemoveCartItem, useUpdateCartItem } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { QuantityStepper } from "./quantity-stepper";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export function CartDrawer() {
  const { isOpen, setOpen } = useCartDrawer();
  const { isAuthenticated } = useAuth();
  const { data: cart, isLoading } = useActiveCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const checkout = useCheckout();

  const subtotal = Number(cart?.subtotal ?? 0);
  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <Drawer.Root direction="right" open={isOpen} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Drawer.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bone outline-none">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
            <Drawer.Title className="font-display text-display-m text-ink">Your Bag</Drawer.Title>
            <Drawer.Close aria-label="Close cart" className="text-ink hover:text-brass">
              <X size={20} />
            </Drawer.Close>
          </div>

          {!isAuthenticated && (
            <p className="px-6 py-8 font-body text-sm text-stone">
              Sign in to view your bag.
            </p>
          )}

          {isAuthenticated && isLoading && (
            <p className="px-6 py-8 font-body text-sm text-stone">Loading your bag…</p>
          )}

          {isAuthenticated && !isLoading && (!cart || cart.items.length === 0) && (
            <p className="px-6 py-8 font-body text-sm text-stone">Your bag is empty.</p>
          )}

          {isAuthenticated && cart && cart.items.length > 0 && (
            <>
              <div className="border-b border-ink/10 px-6 py-4">
                {remaining > 0 ? (
                  <p className="font-body text-caption text-stone">
                    Add {remaining.toFixed(2)} more for free shipping
                  </p>
                ) : (
                  <p className="font-body text-caption text-brass">You&rsquo;ve unlocked free shipping</p>
                )}
                <div className="mt-2 h-1 w-full bg-ink/10">
                  <div
                    className="h-1 bg-brass transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>

              <ul className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 flex-shrink-0 bg-charcoal/10" />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-body text-sm text-ink">{item.product_name}</p>
                        <p className="mt-1 font-body text-caption text-stone">{item.unit_price}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <QuantityStepper
                          quantity={item.quantity}
                          disabled={updateItem.isPending}
                          onChange={(next) => updateItem.mutate({ itemId: item.id, quantity: next })}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem.mutate(item.id)}
                          className="font-body text-caption text-stone hover:text-oxblood"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-ink/10 px-6 py-6">
                <div className="flex items-center justify-between font-body text-sm text-ink">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant="primary"
                  disabled={checkout.isPending}
                  onClick={() => checkout.mutate()}
                >
                  {checkout.isPending ? "Processing…" : "Checkout"}
                </Button>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="mt-3 block text-center font-body text-caption text-stone hover:text-ink"
                >
                  View cart
                </Link>
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
