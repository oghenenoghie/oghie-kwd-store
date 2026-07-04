// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FOOTER_COLUMNS } from "./nav-data";

// Regression test: the footer used to link to 8 routes with no matching page,
// so every visitor's browser 404'd on Next.js's automatic link-prefetch. This
// fails the build if a footer link is ever added without its page.
function pageExistsFor(pathname: string): boolean {
  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);
  const pagePath = path.join(process.cwd(), "src", "app", ...segments, "page.tsx");
  return fs.existsSync(pagePath);
}

describe("FOOTER_COLUMNS", () => {
  const internalLinks = FOOTER_COLUMNS.flatMap((column) => column.links)
    .map((link) => link.href)
    .filter((href) => href.startsWith("/") && !href.includes("?"));

  it.each(internalLinks)("%s has a matching page under src/app", (href) => {
    expect(pageExistsFor(href)).toBe(true);
  });
});
