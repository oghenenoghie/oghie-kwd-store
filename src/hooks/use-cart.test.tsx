import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAddToCart } from "./use-cart";

const addCartItemMock = vi.fn();

vi.mock("@/lib/api/cart", () => ({
  addCartItem: (...args: unknown[]) => addCartItemMock(...args),
  getActiveCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  checkout: vi.fn(),
}));

function TestConsumer() {
  const addToCart = useAddToCart();
  return <button onClick={() => addToCart.mutate({ productId: 5, quantity: 2 })}>Add</button>;
}

function renderWithProviders() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TestConsumer />
    </QueryClientProvider>,
  );
}

describe("useAddToCart", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Regression test: useAddToCart used to gate on a pre-loaded active cart
  // (`if (!cart?.id) throw ...`), so clicking "Add to cart" before that
  // query resolved failed immediately client-side, before ever reaching
  // the API - one of the ways "Add to cart" silently did nothing. The
  // server attaches items to the caller's active cart itself, so no cart
  // id should be required here.
  it("calls addCartItem directly without needing a pre-loaded cart id", async () => {
    addCartItemMock.mockResolvedValue({ id: 1, product: 5, quantity: 2 });
    const user = userEvent.setup();

    renderWithProviders();
    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(addCartItemMock).toHaveBeenCalledWith(5, 2);
    });
  });
});
