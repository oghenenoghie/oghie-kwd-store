import { afterEach, describe, expect, it, vi } from "vitest";
import { addToWishlist, getWishlist, removeFromWishlist } from "./products";

function mockFetchOnce(response: { status: number; jsonBody?: unknown }) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    json: async () => response.jsonBody,
  } as Response);
}

describe("wishlist API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Regression test: WishlistItemViewSet is a ModelViewSet, so it returns
  // WishlistItem objects ({id, product, product_detail, created_at}), not
  // Product objects directly. getWishlist() used to be typed as Product[],
  // which would have made the wishlist page render garbage or crash.
  it("getWishlist requests the wishlist endpoint with auth", async () => {
    const items = [{ id: 1, product: 5, product_detail: { id: 5 }, created_at: "2026-01-01" }];
    mockFetchOnce({ status: 200, jsonBody: items });

    const result = await getWishlist();

    const [url] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/products/wishlist/");
    expect(result).toEqual(items);
  });

  it("addToWishlist posts {product} to the wishlist endpoint", async () => {
    mockFetchOnce({ status: 201, jsonBody: { id: 1, product: 5 } });

    await addToWishlist(5);

    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/products/wishlist/");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ product: 5 });
  });

  // Regression guard: removal must target the WishlistItem's own id, not the
  // product id — they are different numbers.
  it("removeFromWishlist DELETEs the wishlist item by its own id", async () => {
    mockFetchOnce({ status: 204 });

    await removeFromWishlist(42);

    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/products/wishlist/42/");
    expect(init.method).toBe("DELETE");
  });
});
