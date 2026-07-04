import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductDetail } from "./product-detail";
import type { Product } from "@/lib/api/types";

const mutateMock = vi.fn();
const openDrawerMock = vi.fn();
const addToWishlistMock = vi.fn();
const removeFromWishlistMock = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

vi.mock("@/hooks/use-cart", () => ({
  useAddToCart: () => ({ mutate: mutateMock, isPending: false, isError: false }),
}));

vi.mock("@/hooks/use-cart-drawer", () => ({
  useCartDrawer: () => ({ open: openDrawerMock }),
}));

vi.mock("@/hooks/use-wishlist", () => ({
  useWishlist: () => ({ data: [] }),
  useAddToWishlist: () => ({ mutate: addToWishlistMock, isPending: false }),
  useRemoveFromWishlist: () => ({ mutate: removeFromWishlistMock, isPending: false }),
}));

const product: Product = {
  id: 5,
  slug: "wool-coat",
  name: "Wool Coat",
  description: "A warm wool coat.",
  price: "120.00",
  category: 1,
  category_detail: { id: 1, name: "Outerwear", slug: "outerwear", is_active: true },
  currency: 1,
  currency_detail: {
    id: 1,
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    exchange_rate_to_base: 1,
    is_base: true,
    is_active: true,
  },
  stock_quantity: 3,
  is_active: true,
  average_rating: null,
  review_count: 0,
  images: [],
};

describe("ProductDetail", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Regression guard: "Add to cart" and "Buy it now" both need to actually
  // call useAddToCart's mutate() with the product/quantity and open the
  // cart drawer - this was silently broken by the nested cart-items 404.
  it("adds the product to the cart and opens the drawer", async () => {
    const user = userEvent.setup();
    render(<ProductDetail product={product} />);

    await user.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(mutateMock).toHaveBeenCalledWith(
      { productId: 5, quantity: 1 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("toggles the wishlist heart when clicked", async () => {
    const user = userEvent.setup();
    render(<ProductDetail product={product} />);

    await user.click(screen.getByRole("button", { name: "Add to wishlist" }));

    expect(addToWishlistMock).toHaveBeenCalledWith(5);
  });
});
