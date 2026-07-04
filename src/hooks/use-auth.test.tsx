import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./use-auth";
import { setTokens } from "@/lib/api/token-store";

const loginMock = vi.fn();
const registerMock = vi.fn();

vi.mock("@/lib/api/auth", () => ({
  login: (...args: unknown[]) => loginMock(...args),
  register: (...args: unknown[]) => registerMock(...args),
}));

function renderWithProviders() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

function TestConsumer() {
  const { register } = useAuth();
  return (
    <button
      onClick={() =>
        register({ username: "jane", email: "jane@example.com", password: "hunter2!!" })
      }
    >
      Register
    </button>
  );
}

describe("useAuth register()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setTokens(null);
  });

  // Regression test: register() used to follow up a successful registration
  // with login(input.email, ...), but the backend authenticates by username
  // — that mismatch made the post-registration login always fail with a 400
  // even though the account had just been created successfully.
  it("logs in with the registered username, not the email", async () => {
    registerMock.mockResolvedValue({ id: 1, username: "jane", email: "jane@example.com" });
    loginMock.mockResolvedValue({ access: "a", refresh: "r" });
    const user = userEvent.setup();

    renderWithProviders();
    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("jane", "hunter2!!");
    });
    expect(loginMock).not.toHaveBeenCalledWith("jane@example.com", expect.anything());
  });
});
