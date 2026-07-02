import { apiFetch } from "./client";
import type { Product, ProductFilters } from "./types";

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
 * No single-product detail route is documented in the route map, so the
 * detail page is served by matching against the full list instead of
 * guessing an unconfirmed `/api/products/{slug}/` URL.
 */
export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export function getCurrencies() {
  return apiFetch<string[]>("/api/products/currencies/");
}

export function getWishlist() {
  return apiFetch<Product[]>("/api/products/wishlist/", { auth: true });
}

export function addToWishlist(productId: number) {
  return apiFetch<void>("/api/products/wishlist/", {
    method: "POST",
    auth: true,
    body: { product: productId },
  });
}
