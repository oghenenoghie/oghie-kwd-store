import { defineConfig, devices } from "@playwright/test";

// Runs against a live URL rather than a local dev server, since the app talks
// to the real oghie-store Django API. In CI, point PLAYWRIGHT_BASE_URL at a
// Vercel preview deployment (per-PR) so E2E tests the exact build under
// review; locally it falls back to the production storefront.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "https://oghie-kwd-store.vercel.app";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // The cart is a mobile bottom-sheet (Vaul) - worth testing that viewport.
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],
});
