import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrentUser } from "./use-current-user";

const getCurrentUserMock = vi.fn();
let isAuthenticated = false;

vi.mock("@/lib/api/auth", () => ({
  getCurrentUser: () => getCurrentUserMock(),
}));

vi.mock("./use-auth", () => ({
  useAuth: () => ({ isAuthenticated }),
}));

function TestConsumer() {
  const { data } = useCurrentUser();
  return <span>{data ? data.username : "no user"}</span>;
}

function renderWithProviders() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TestConsumer />
    </QueryClientProvider>,
  );
}

describe("useCurrentUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    isAuthenticated = false;
  });

  it("does not fetch the current user when signed out", () => {
    isAuthenticated = false;
    renderWithProviders();

    expect(getCurrentUserMock).not.toHaveBeenCalled();
    expect(screen.getByText("no user")).toBeInTheDocument();
  });

  it("fetches and exposes the current user once signed in", async () => {
    isAuthenticated = true;
    getCurrentUserMock.mockResolvedValue({ id: 1, username: "jane", email: "jane@example.com" });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("jane")).toBeInTheDocument();
    });
    expect(getCurrentUserMock).toHaveBeenCalledTimes(1);
  });
});
