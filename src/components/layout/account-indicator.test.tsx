import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccountIndicator } from "./account-indicator";

let isAuthenticated = false;
let currentUser: { username: string; email: string } | undefined;

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ isAuthenticated }),
}));

vi.mock("@/hooks/use-current-user", () => ({
  useCurrentUser: () => ({ data: currentUser }),
}));

describe("AccountIndicator", () => {
  it("shows the plain account icon when signed out", () => {
    isAuthenticated = false;
    currentUser = undefined;
    render(<AccountIndicator light={false} />);

    expect(screen.getByRole("link", { name: "Account" })).toBeInTheDocument();
  });

  // Regression guard: this is the only visible cue that a visitor is signed
  // in - it must show something identity-like (here, initials, since the
  // backend's AuthUser has no profile picture field) rather than the same
  // generic icon shown to signed-out visitors.
  it("shows initials derived from the username when signed in", () => {
    isAuthenticated = true;
    currentUser = { username: "customer_chidi", email: "chidi@oghiestore.test" };
    render(<AccountIndicator light={false} />);

    const link = screen.getByRole("link", { name: "Account, signed in as customer_chidi" });
    expect(link).toHaveTextContent("CC");
  });

  it("falls back to the plain icon while the signed-in user hasn't loaded yet", () => {
    isAuthenticated = true;
    currentUser = undefined;
    render(<AccountIndicator light={false} />);

    expect(screen.getByRole("link", { name: "Account" })).toBeInTheDocument();
  });
});
