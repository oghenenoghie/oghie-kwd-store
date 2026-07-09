import { apiFetch } from "./client";
import type { CmsSection } from "./types";

/**
 * GET /api/cms/sections/ returns every section type in one list - the
 * viewset only registers SearchFilter/OrderingFilter, not an exact
 * section_type filter - so hero slides are picked out and ordered here
 * instead of relying on a query param the backend doesn't support.
 */
export async function getHeroSlides(): Promise<CmsSection[]> {
  const sections = await apiFetch<CmsSection[]>("/api/cms/sections/?ordering=sort_order");
  return sections
    .filter((section) => section.section_type === "hero" && section.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}
