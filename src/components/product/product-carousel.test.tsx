import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ProductCarousel } from "./product-carousel";
import type { Product } from "@/lib/api/types";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

vi.mock("@/hooks/use-cart", () => ({
  useAddToCart: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/hooks/use-cart-drawer", () => ({
  useCartDrawer: () => ({ open: vi.fn() }),
}));

const currency = {
  id: 1,
  code: "USD",
  name: "US Dollar",
  symbol: "$",
  exchange_rate_to_base: 1,
  is_base: true,
  is_active: true,
};

const category = { id: 1, name: "Women", slug: "women", is_active: true };

function makeProduct(id: number): Product {
  return {
    id,
    slug: `product-${id}`,
    name: `Product ${id}`,
    price: "100.00",
    category: 1,
    category_detail: category,
    currency: 1,
    currency_detail: currency,
    stock_quantity: 5,
    is_active: true,
    average_rating: null,
    review_count: 0,
    images: [],
  };
}

describe("ProductCarousel", () => {
  // Regression test: the section wrapping the horizontally-scrolling track
  // is a flex item (of the page's flex-col layout). Flex/grid items default
  // to min-width: auto, which stops them shrinking below their content's
  // min-content size - since the track's un-scrolled row is far wider than
  // any viewport, that pushed the whole section (and the page) wider than
  // the screen instead of scrolling internally. `w-full min-w-0` forces the
  // section back to a definite, container-constrained width.
  it("constrains the section to its container instead of the carousel's content width", () => {
    const products = [makeProduct(1), makeProduct(2), makeProduct(3)];
    const { container } = render(
      <ProductCarousel title="New arrivals" viewAllHref="/products" products={products} />,
    );

    const section = container.querySelector("section");
    expect(section?.className).toContain("w-full");
    expect(section?.className).toContain("min-w-0");
  });
});
