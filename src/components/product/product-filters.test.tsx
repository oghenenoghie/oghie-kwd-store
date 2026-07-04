import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductFilters } from "./product-filters";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("ProductFilters", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("switches to the compact grid view", async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);

    await user.click(screen.getByRole("button", { name: "Compact grid" }));

    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("view=compact"));
  });

  it("opens the filter drawer and applies a category filter", async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);

    await user.click(screen.getByRole("button", { name: /^Filter/ }));
    await user.click(screen.getByRole("button", { name: "Women" }));

    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("category=women"));
  });

  it("changes the sort order", async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);

    await user.selectOptions(screen.getByLabelText("Sort by"), "price");

    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining("ordering=price"));
  });

  // Regression test: a native <select> renders its closed width to fit its
  // widest <option> (here "Price: high to low"), which pushed the bar past
  // a 320px viewport and off the right edge of the page. Capping the
  // select's own width keeps the bar within the viewport regardless of how
  // long an ordering label gets.
  it("caps the sort select's width so long option labels can't blow out the bar", () => {
    render(<ProductFilters />);

    expect(screen.getByLabelText("Sort by").className).toContain("w-24");
  });
});
