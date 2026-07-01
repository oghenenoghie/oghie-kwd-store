/**
 * Field-level shapes for the DRF API aren't confirmed (see
 * ecommerce-storefront-design skill notes) — these are best-effort types
 * based on the route map. Revisit against the browsable API / admin once
 * endpoints are exercised for real.
 */

export interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  price: string | number;
  /** Present when the product is on sale; unconfirmed field name. */
  compare_at_price?: string | number;
  is_new?: boolean;
  currency: string;
  category: string;
  in_stock: boolean;
  rating?: number;
  images: string[];
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  currency?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  min_rating?: number;
  ordering?: string;
}

export interface CartLineItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: string | number;
}

export interface Cart {
  id: number;
  items: CartLineItem[];
  subtotal: string | number;
  currency: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}
