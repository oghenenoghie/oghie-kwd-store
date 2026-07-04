/**
 * Field-level shapes confirmed against a live GET /api/products/ response,
 * and WishlistItem/Product against products/serializers.py in oghie-store.
 * Cart/checkout shapes are still unconfirmed — see notes on those types below.
 */

export interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

export interface ProductCurrency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchange_rate_to_base: string | number;
  is_base: boolean;
  is_active: boolean;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  price: string | number;
  /** Present when the product is on sale; unconfirmed field name. */
  compare_at_price?: string | number;
  is_new?: boolean;
  category: number;
  category_detail: ProductCategory;
  currency: number;
  currency_detail: ProductCurrency;
  stock_quantity: number;
  is_active: boolean;
  average_rating: number | null;
  review_count: number;
  images: ProductImage[];
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

export interface WishlistItem {
  id: number;
  product: number;
  product_detail: Product;
  created_at: string;
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

export interface UserProfile {
  id: number;
  role: "super_admin" | "staff" | "vendor" | "customer";
  phone: string;
  address: string;
  company_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  profile: UserProfile;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}
