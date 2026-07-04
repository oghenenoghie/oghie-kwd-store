import { afterEach, describe, expect, it, vi } from "vitest";
import { addCartItem, removeCartItem, updateCartItem } from "./cart";

function mockFetchOnce(response: { status: number; jsonBody?: unknown }) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    json: async () => response.jsonBody,
  } as Response);
}

describe("cart item API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Regression test: CartItemViewSet (orders/urls.py in oghie-store) is
  // registered as a top-level `cart/items` resource, not nested under
  // `cart/{cartId}/items/`. Posting to the nested path 404s, which is why
  // "Add to cart" silently failed - this pins the real, flat route.
  it("addCartItem posts {product, quantity} to the flat cart-items route", async () => {
    mockFetchOnce({ status: 201, jsonBody: { id: 1, product: 5, quantity: 2 } });

    await addCartItem(5, 2);

    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/orders/cart/items/");
    expect(url).not.toMatch(/cart\/\d+\/items/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ product: 5, quantity: 2 });
  });

  it("updateCartItem PATCHes the cart-item by its own id", async () => {
    mockFetchOnce({ status: 200, jsonBody: { id: 7, quantity: 3 } });

    await updateCartItem(7, 3);

    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/orders/cart/items/7/");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({ quantity: 3 });
  });

  it("removeCartItem DELETEs the cart-item by its own id", async () => {
    mockFetchOnce({ status: 204 });

    await removeCartItem(7);

    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/orders/cart/items/7/");
    expect(init.method).toBe("DELETE");
  });
});
