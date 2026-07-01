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

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { data: cart } = useActiveCart();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => {
      if (!cart?.id) throw new Error("No active cart to add items to");
      return addCartItem(cart.id, productId, quantity);
    },
    onSuccess: (nextCart) => queryClient.setQueryData(CART_KEY, nextCart),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { data: cart } = useActiveCart();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      if (!cart?.id) throw new Error("No active cart");
      return updateCartItem(cart.id, itemId, quantity);
    },
    onSuccess: (nextCart) => queryClient.setQueryData(CART_KEY, nextCart),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { data: cart } = useActiveCart();

  return useMutation({
    mutationFn: (itemId: number) => {
      if (!cart?.id) throw new Error("No active cart");
      return removeCartItem(cart.id, itemId);
    },
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
