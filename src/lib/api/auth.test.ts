import { afterEach, describe, expect, it, vi } from "vitest";
import { login, register } from "./auth";

function mockFetchOnce(jsonBody: unknown) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => jsonBody,
  } as Response);
}

describe("register", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Regression test: the live RegisterSerializer (Django's default auth.User
  // model) requires username/email/password. A previous version of this form
  // never sent `username`, which made every registration fail with a 400.
  it("posts exactly {username, email, password} to /api/auth/register/", async () => {
    mockFetchOnce({ id: 1, username: "jane", email: "jane@example.com" });

    await register({ username: "jane", email: "jane@example.com", password: "hunter2!!" });

    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/auth/register/");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      username: "jane",
      email: "jane@example.com",
      password: "hunter2!!",
    });
  });
});

describe("login", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts {email, password} to /api/auth/token/", async () => {
    mockFetchOnce({ access: "a", refresh: "r" });

    await login("jane@example.com", "hunter2!!");

    const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/auth/token/");
    expect(JSON.parse(init.body as string)).toEqual({
      email: "jane@example.com",
      password: "hunter2!!",
    });
  });
});
