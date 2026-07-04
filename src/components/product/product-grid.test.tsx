import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductGrid } from "./product-grid";
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

describe("ProductGrid", () => {
  it("shows an empty state when there are no products", () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });

  // Regression guard: the compact view toggle must actually change the grid's
  // column count, not just flip a no-op prop.
  it("renders more columns in compact view than comfortable view", () => {
    const products = [makeProduct(1), makeProduct(2)];

    const { container: comfortable } = render(<ProductGrid products={products} view="comfortable" />);
    const { container: compact } = render(<ProductGrid products={products} view="compact" />);

    expect(comfortable.querySelector(".grid")?.className).toContain("@lg:grid-cols-3");
    expect(compact.querySelector(".grid")?.className).toContain("@lg:grid-cols-4");
  });
});
