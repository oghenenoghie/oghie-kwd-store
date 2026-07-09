// Lighthouse CI - runs against a deployed URL and fails the build if the app
// regresses past these budgets. Start with realistic floors and ratchet up.
module.exports = {
  ci: {
    collect: {
      // Set LHCI_URL to a Vercel preview URL in CI; falls back to prod locally.
      url: [process.env.LHCI_URL ?? "https://oghie-kwd-store.vercel.app"],
      numberOfRuns: 3, // median of 3 smooths out network noise
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        // Category floors (0-1). Accessibility + best-practices held high on
        // purpose - cheap to hit, strong signal.
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.9 }],

        // Core Web Vitals as hard budgets.
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],

        // Ship-quality checks that catch real regressions.
        "unused-javascript": ["warn", { maxNumericValue: 150000 }],
        "modern-image-formats": "error",
        "uses-responsive-images": "warn",
      },
    },
    upload: {
      // Free, no-account option: LHCI's temporary public storage. Swap for a
      // self-hosted LHCI server if you want history/trends.
      target: "temporary-public-storage",
    },
  },
};
