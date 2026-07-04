import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch, ApiError } from "./client";
import { setTokens } from "./token-store";

function mockFetchOnce(response: Partial<Response> & { jsonBody?: unknown }) {
  const { jsonBody, ...rest } = response;
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => jsonBody,
    ...rest,
  } as Response);
}

describe("apiFetch", () => {
  afterEach(() => {
    setTokens(null);
    vi.restoreAllMocks();
  });

  it("returns parsed JSON on a successful response", async () => {
    mockFetchOnce({ ok: true, status: 200, jsonBody: { id: 1 } });

    const result = await apiFetch<{ id: number }>("/api/products/");

    expect(result).toEqual({ id: 1 });
  });

  it("returns undefined for a 204 response", async () => {
    mockFetchOnce({ ok: true, status: 204, jsonBody: null });

    const result = await apiFetch("/api/cart/items/1/");

    expect(result).toBeUndefined();
  });

  it("throws an ApiError with the parsed error body on a non-ok response", async () => {
    mockFetchOnce({
      ok: false,
      status: 400,
      jsonBody: { username: ["This field is required."] },
    });

    await expect(apiFetch("/api/auth/register/")).rejects.toMatchObject({
      status: 400,
      body: { username: ["This field is required."] },
    });
    await expect(apiFetch("/api/auth/register/")).rejects.toBeInstanceOf(ApiError);
  });

  it("sends a JSON Content-Type header only when a body is present", async () => {
    mockFetchOnce({ ok: true, status: 200, jsonBody: {} });

    await apiFetch("/api/auth/register/", { method: "POST", body: { email: "a@b.com" } });

    const [, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const headers = init.headers as Headers;
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ email: "a@b.com" }));
  });
});
