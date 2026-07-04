import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ShopTheLook } from "./shop-the-look";
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

describe("ShopTheLook", () => {
  // Regression test: this section's two-column grid (md:grid-cols-[1.2fr_1fr])
  // collapsed its second column to 0 width and rendered it far outside the
  // page at md+ widths, because grid items default to min-width: auto and
  // won't shrink below their content's min-content size. min-w-0 on the
  // section and both grid items lets the tracks actually respect the
  // 1.2fr/1fr split instead of ballooning to fit content.
  it("marks the section and both grid columns as shrinkable", () => {
    const products = [makeProduct(1), makeProduct(2), makeProduct(3)];
    const { container } = render(<ShopTheLook products={products} />);

    const section = container.querySelector("section");
    expect(section?.className).toContain("w-full");
    expect(section?.className).toContain("min-w-0");

    const grid = section?.querySelector(":scope > div");
    expect(grid?.className).toContain("min-w-0");

    const [imageColumn, cardsColumn] = Array.from(grid?.children ?? []);
    expect((imageColumn as HTMLElement).className).toContain("min-w-0");
    expect((cardsColumn as HTMLElement).className).toContain("min-w-0");
  });
});
