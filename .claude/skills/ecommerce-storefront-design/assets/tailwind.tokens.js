/**
 * Tailwind theme extension — "Ink, Bone & Brass" palette
 * Ecommerce storefront design tokens (Next.js + Django project)
 *
 * Usage: merge this into tailwind.config.ts under `theme.extend`
 * Fonts assume `next/font` variables are wired up as --font-display / --font-body
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        ink: "#12110F",
        charcoal: "#2B2A28",
        bone: "#EAE7DF",
        stone: "#8C8579",
        oxblood: "#6B1E23",
        brass: "#A8823D",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"], // Fraunces
        body: ["var(--font-body)", "sans-serif"],   // Work Sans
      },
      fontSize: {
        "display-xl": "clamp(2.2rem, 6vw, 4rem)",
        "display-l": "clamp(2rem, 5.5vw, 3.6rem)",
        "display-m": "clamp(1.5rem, 3vw, 2.2rem)",
        "body-l": "1.125rem",
        "body-base": "1rem",
        caption: "0.8rem",
      },
    },
  },
};
