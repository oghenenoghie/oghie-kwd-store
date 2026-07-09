import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartDrawer } from "./cart-drawer";
import type { Cart } from "@/lib/api/types";

const useAuthMock = vi.fn();
const useActiveCartMock = vi.fn();
const useCheckoutMock = vi.fn();

vi.mock("@/hooks/use-cart-drawer", () => ({
  useCartDrawer: () => ({ isOpen: true, setOpen: vi.fn() }),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/hooks/use-cart", () => ({
  useActiveCart: () => useActiveCartMock(),
  useUpdateCartItem: () => ({ mutate: vi.fn(), isPending: false }),
  useRemoveCartItem: () => ({ mutate: vi.fn(), isPending: false }),
  useCheckout: () => useCheckoutMock(),
}));

const cart: Cart = {
  id: 1,
  currency: null,
  subtotal: "480.00",
  items: [
    { id: 10, product: 1, product_name: "Merino Overcoat", quantity: 1, unit_price: "480.00", line_total: "480.00" },
  ],
};

function renderDrawer() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <CartDrawer />
    </QueryClientProvider>,
  );
}

describe("CartDrawer", () => {
  it("shows a sign-in prompt instead of cart contents when unauthenticated", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false });
    useActiveCartMock.mockReturnValue({ data: undefined, isLoading: false });
    useCheckoutMock.mockReturnValue({ mutate: vi.fn(), isPending: false });

    renderDrawer();

    expect(screen.getByText("Sign in to view your bag.")).toBeInTheDocument();
  });

  it("renders line items and subtotal from the active cart, with an enabled checkout action", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true });
    useActiveCartMock.mockReturnValue({ data: cart, isLoading: false });
    useCheckoutMock.mockReturnValue({ mutate: vi.fn(), isPending: false });

    renderDrawer();

    expect(screen.getByText("Merino Overcoat")).toBeInTheDocument();
    expect(screen.getAllByText("480.00")).toHaveLength(2); // line item price + subtotal
    expect(screen.getByRole("button", { name: "Checkout" })).toBeEnabled();
  });

  it("shows an empty state when the authenticated cart has no items", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true });
    useActiveCartMock.mockReturnValue({ data: { ...cart, items: [] }, isLoading: false });
    useCheckoutMock.mockReturnValue({ mutate: vi.fn(), isPending: false });

    renderDrawer();

    expect(screen.getByText("Your bag is empty.")).toBeInTheDocument();
  });
});
