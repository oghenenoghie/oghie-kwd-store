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

/**
 * Confirmed against CartItemSerializer (orders/serializers.py in
 * oghie-store): `product` is the bare foreign-key id, not a nested Product -
 * product_name/unit_price/line_total are provided alongside it instead.
 */
export interface CartLineItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
}

/**
 * Confirmed against CartSerializer: `currency` is a bare (nullable) foreign-
 * key id - get_or_create() doesn't set one, so there's no currency code
 * available from this endpoint to display.
 */
export interface Cart {
  id: number;
  currency: number | null;
  items: CartLineItem[];
  subtotal: string | number;
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

/**
 * Confirmed against CMSSectionSerializer (cms/serializers.py in
 * oghie-store): `image` is the raw ImageField value (a storage path or,
 * often for seeded content, a bare external URL), while `image_url` is the
 * serializer's resolved, always-absolute URL - always prefer image_url.
 */
export interface CmsSection {
  id: number;
  title: string;
  slug: string;
  section_type: "hero" | "banner" | "featured_products" | "content" | "footer";
  body: string;
  image_url: string | null;
  link_url: string;
  sort_order: number;
  is_active: boolean;
}
