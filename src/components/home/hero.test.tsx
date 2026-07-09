import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "./hero";
import type { CmsSection } from "@/lib/api/types";

function makeSlide(overrides: Partial<CmsSection> = {}): CmsSection {
  return {
    id: 1,
    title: "Slide title",
    slug: "slide",
    section_type: "hero",
    body: "Slide body",
    image_url: "https://picsum.photos/seed/slide/1600/900",
    link_url: "/products",
    sort_order: 1,
    is_active: true,
    ...overrides,
  };
}

describe("Hero", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // Regression guard: before the CMS-backed carousel existed, the hero was
  // always the same hardcoded copy - make sure that content still renders
  // when there's no hero data (CMS fetch failed, or nothing seeded yet) so
  // the section never renders empty.
  it("falls back to the static hero when there are no slides", () => {
    render(<Hero slides={[]} />);

    expect(screen.getByText("Quiet luxury, considered detail.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop the collection" })).toHaveAttribute(
      "href",
      "/products",
    );
    expect(screen.queryByRole("button", { name: /Go to slide/ })).not.toBeInTheDocument();
  });

  it("renders the first active hero slide's content and image", () => {
    const slide = makeSlide({ title: "New Season", body: "Fresh arrivals", link_url: "/products?ordering=-created" });
    render(<Hero slides={[slide]} />);

    expect(screen.getByText("New Season")).toBeInTheDocument();
    expect(screen.getByText("Fresh arrivals")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop the collection" })).toHaveAttribute(
      "href",
      "/products?ordering=-created",
    );
    const image = screen.getByAltText("");
    expect(image).toHaveAttribute("src", slide.image_url);
  });

  it("shows one dot indicator per slide only when there is more than one", () => {
    render(<Hero slides={[makeSlide({ id: 1 }), makeSlide({ id: 2 }), makeSlide({ id: 3 })]} />);

    expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(3);
  });

  it("switches slide content when a dot indicator is clicked", async () => {
    const user = userEvent.setup();
    const slides = [
      makeSlide({ id: 1, title: "First slide" }),
      makeSlide({ id: 2, title: "Second slide" }),
    ];
    render(<Hero slides={slides} />);

    expect(screen.getByText("First slide")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Go to slide 2" }));

    expect(screen.getByText("Second slide")).toBeInTheDocument();
    expect(screen.queryByText("First slide")).not.toBeInTheDocument();
  });

  it("auto-advances to the next slide on an interval", () => {
    vi.useFakeTimers();
    const slides = [
      makeSlide({ id: 1, title: "First slide" }),
      makeSlide({ id: 2, title: "Second slide" }),
    ];
    render(<Hero slides={slides} />);

    expect(screen.getByText("First slide")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByText("Second slide")).toBeInTheDocument();
  });
});
