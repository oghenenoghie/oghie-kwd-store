import { apiFetch } from "./client";
import type { Cart } from "./types";

export function getActiveCart() {
  return apiFetch<Cart>("/api/orders/cart/active/", { auth: true });
}

/**
 * Unconfirmed: the route map only documents GET on the active cart and POST
 * on checkout. This assumes a nested items resource — verify against the
 * DRF browsable API before relying on it.
 */
export function addCartItem(cartId: number, productId: number, quantity: number) {
  return apiFetch<Cart>(`/api/orders/cart/${cartId}/items/`, {
    method: "POST",
    auth: true,
    body: { product: productId, quantity },
  });
}

export function updateCartItem(cartId: number, itemId: number, quantity: number) {
  return apiFetch<Cart>(`/api/orders/cart/${cartId}/items/${itemId}/`, {
    method: "PATCH",
    auth: true,
    body: { quantity },
  });
}

export function removeCartItem(cartId: number, itemId: number) {
  return apiFetch<void>(`/api/orders/cart/${cartId}/items/${itemId}/`, {
    method: "DELETE",
    auth: true,
  });
}

export function checkout(cartId: number) {
  return apiFetch<{ order_id: number }>(`/api/orders/cart/${cartId}/checkout/`, {
    method: "POST",
    auth: true,
  });
}
