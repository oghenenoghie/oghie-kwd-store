/**
 * Starter design tokens for a fashion storefront.
 * These are neutral placeholders — replace with the user's actual
 * brand palette and typefaces before shipping anything final.
 *
 * Usage: merge into tailwind.config.ts under theme.extend
 */
module.exports = {
  colors: {
    ink: "#171512", // primary text, dark surfaces (header/footer)
    bone: "#F3F1EC", // page background
    stone: "#9A9186", // muted/secondary text, borders
    accent: "#7A2E2E", // sparing use: sale price, active nav state, CTA
  },
  fontFamily: {
    display: ["Fraunces", "serif"], // headings, hero copy, product titles
    sans: ["Work Sans", "sans-serif"], // nav labels, body copy, prices
  },
  letterSpacing: {
    widest: ".15em", // uppercase nav labels commonly use this genre's tracking
  },
};
