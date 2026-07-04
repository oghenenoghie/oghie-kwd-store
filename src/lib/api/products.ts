import { apiFetch, ApiError } from "./client";
import type { Product, ProductFilters, WishlistItem } from "./types";

function serializeFilters(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** GET /api/products/ returns a plain array, not a paginated {results} envelope. */
export function getProducts(filters?: ProductFilters) {
  return apiFetch<Product[]>(`/api/products/${serializeFilters(filters)}`);
}

/**
 * Confirmed against ProductViewSet (products/views.py in oghie-store): it
 * sets lookup_field = 'slug', so the router exposes a real detail route at
 * GET /api/products/{slug}/ instead of only the list endpoint.
 */
export async function getProductBySlug(slug: string) {
  try {
    return await apiFetch<Product>(`/api/products/${slug}/`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function getCurrencies() {
  return apiFetch<string[]>("/api/products/currencies/");
}

/**
 * Confirmed against WishlistItemViewSet (products/views.py in oghie-store):
 * a ModelViewSet, so this returns WishlistItem objects (id, product,
 * product_detail, created_at) — not Product objects directly.
 */
export function getWishlist() {
  return apiFetch<WishlistItem[]>("/api/products/wishlist/", { auth: true });
}

export function addToWishlist(productId: number) {
  return apiFetch<WishlistItem>("/api/products/wishlist/", {
    method: "POST",
    auth: true,
    body: { product: productId },
  });
}

/** id here is the WishlistItem's own id, not the product id. */
export function removeFromWishlist(id: number) {
  return apiFetch<void>(`/api/products/wishlist/${id}/`, {
    method: "DELETE",
    auth: true,
  });
}
