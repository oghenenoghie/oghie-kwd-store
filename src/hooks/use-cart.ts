"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCartItem, checkout, getActiveCart, removeCartItem, updateCartItem } from "@/lib/api/cart";
import { useAuth } from "./use-auth";

const CART_KEY = ["cart", "active"];

export function useActiveCart() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: CART_KEY,
    queryFn: getActiveCart,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

// addCartItem/updateCartItem/removeCartItem return the affected CartItem
// (or nothing), not the whole Cart, and the server attaches items to the
// caller's active cart itself - so these just refetch the cart afterward
// instead of trying to splice a CartItem into the Cart cache.

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      addCartItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => removeCartItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useCheckout() {
  const { data: cart } = useActiveCart();

  return useMutation({
    mutationFn: () => {
      if (!cart?.id) throw new Error("No active cart to check out");
      return checkout(cart.id);
    },
  });
}
