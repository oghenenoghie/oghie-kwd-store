import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/products",
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

vi.mock("@/hooks/use-cart", () => ({
  useActiveCart: () => ({ data: undefined }),
}));

vi.mock("@/hooks/use-cart-drawer", () => ({
  useCartDrawer: () => ({ open: vi.fn() }),
}));

function renderHeader() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <Header />
    </QueryClientProvider>,
  );
}

describe("Header", () => {
  // Regression test: the logo used to sit between two `flex-1` side groups,
  // which only truly centers it when both sides have equal content width.
  // On mobile the left side (just a hamburger icon) is much narrower than
  // the right side (search/wishlist/cart icons), so the logo drifted right
  // and touched the search icon at narrow viewports. A 3-column grid with
  // an `auto`-sized center column centers the logo regardless of how much
  // content sits on either side.
  it("centers the logo in a fixed grid column independent of side content", () => {
    renderHeader();

    const logo = screen.getByRole("link", { name: "OGHIE" });
    expect(logo.parentElement?.className).toContain("grid-cols-[1fr_auto_1fr]");
  });
});
