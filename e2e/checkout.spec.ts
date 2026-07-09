import { test, expect } from "@playwright/test";

// Smoke-tests the anonymous browse flow against the live deployment. The
// full authenticated add-to-cart -> checkout hand-off needs a seeded test
// account and isn't covered here yet - see TESTING.md.

test.describe("storefront browsing", () => {
  test("homepage renders a catalog of products", async ({ page }) => {
    await page.goto("/");

    // Each product card links to its PDP at /products/{slug}.
    const firstProductLink = page.locator('a[href^="/products/"]').first();
    await expect(firstProductLink).toBeVisible();

    // Each card also carries an "Add" to cart action.
    await expect(page.getByRole("button", { name: /^add$/i }).first()).toBeAttached();
  });

  test("the cart icon opens the bag drawer", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open cart" }).click();

    // Anonymous visitors see a sign-in prompt rather than cart contents -
    // the drawer never renders a broken/half-loaded cart for them.
    await expect(page.getByText(/sign in to view your bag/i)).toBeVisible();
  });
});
