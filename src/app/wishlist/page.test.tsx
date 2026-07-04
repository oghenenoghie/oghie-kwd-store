import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WishlistPage from "./page";
import type { Product } from "@/lib/api/types";

const useAuthMock = vi.fn();
const useWishlistMock = vi.fn();
const removeMutateMock = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/hooks/use-wishlist", () => ({
  useWishlist: () => useWishlistMock(),
  useRemoveFromWishlist: () => ({ mutate: removeMutateMock, isPending: false }),
}));

vi.mock("@/components/product/product-card", () => ({
  ProductCard: ({ product }: { product: Product }) => <div>{product.name}</div>,
}));

describe("WishlistPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("prompts sign-in when not authenticated", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false });
    useWishlistMock.mockReturnValue({ data: undefined, isLoading: false });

    render(<WishlistPage />);

    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/account");
  });

  it("shows an empty state when the wishlist has no items", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true });
    useWishlistMock.mockReturnValue({ data: [], isLoading: false });

    render(<WishlistPage />);

    expect(screen.getByText(/nothing saved yet/i)).toBeInTheDocument();
  });

  it("renders each item and removes it by its wishlist-item id, not the product id", async () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true });
    useWishlistMock.mockReturnValue({
      data: [{ id: 99, product: 5, product_detail: { id: 5, name: "Silk Scarf" }, created_at: "2026-01-01" }],
      isLoading: false,
    });
    const user = userEvent.setup();

    render(<WishlistPage />);
    expect(screen.getByText("Silk Scarf")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove/i }));
    expect(removeMutateMock).toHaveBeenCalledWith(99);
  });
});
