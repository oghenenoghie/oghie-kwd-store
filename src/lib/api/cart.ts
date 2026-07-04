import { apiFetch } from "./client";
import type { Cart, CartLineItem } from "./types";

export function getActiveCart() {
  return apiFetch<Cart>("/api/orders/cart/active/", { auth: true });
}

/**
 * Confirmed against orders/urls.py (oghie-store): CartItemViewSet is
 * registered as a top-level `cart/items` resource, not nested under
 * `cart/{cartId}/items/` - that nested path 404s, which is why "Add to
 * cart" never actually added anything. perform_create() attaches the item
 * to the caller's active cart server-side (get_or_create), so no cart id
 * is needed on the request, and the response is the created CartItem, not
 * the whole Cart.
 */
export function addCartItem(productId: number, quantity: number) {
  return apiFetch<CartLineItem>("/api/orders/cart/items/", {
    method: "POST",
    auth: true,
    body: { product: productId, quantity },
  });
}

export function updateCartItem(itemId: number, quantity: number) {
  return apiFetch<CartLineItem>(`/api/orders/cart/items/${itemId}/`, {
    method: "PATCH",
    auth: true,
    body: { quantity },
  });
}

export function removeCartItem(itemId: number) {
  return apiFetch<void>(`/api/orders/cart/items/${itemId}/`, {
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
