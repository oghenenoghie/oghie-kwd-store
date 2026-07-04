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
});
