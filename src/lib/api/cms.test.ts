import { afterEach, describe, expect, it, vi } from "vitest";
import { getHeroSlides } from "./cms";

function mockFetchOnce(jsonBody: unknown) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => jsonBody,
  } as Response);
}

describe("getHeroSlides", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Regression guard: /api/cms/sections/ returns every section type mixed
  // together (banners, footer copy, etc.), not just hero slides - the
  // hero carousel would render the wrong content if these weren't filtered
  // out client-side.
  it("keeps only active hero sections, ordered by sort_order", async () => {
    mockFetchOnce([
      { id: 1, title: "Sale", section_type: "banner", is_active: true, sort_order: 10 },
      { id: 2, title: "Slide two", section_type: "hero", is_active: true, sort_order: 2 },
      { id: 3, title: "Inactive slide", section_type: "hero", is_active: false, sort_order: 1 },
      { id: 4, title: "Slide one", section_type: "hero", is_active: true, sort_order: 1 },
    ]);

    const result = await getHeroSlides();

    expect(result.map((section) => section.title)).toEqual(["Slide one", "Slide two"]);
  });

  it("requests the CMS sections endpoint ordered by sort_order", async () => {
    mockFetchOnce([]);

    await getHeroSlides();

    const [url] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/api/cms/sections/");
    expect(url).toContain("ordering=sort_order");
  });
});
