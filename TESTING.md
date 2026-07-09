# Testing & Performance Layer — Oghie Store (frontend)

Three layers, each catching a different class of regression:

```
src/**/*.test.ts(x)          # unit + component tests (Vitest + Testing Library)
e2e/checkout.spec.ts         # Playwright: anonymous browse + cart-drawer smoke test
lighthouserc.js              # perf/a11y/SEO budgets against the deployed site
.github/workflows/ci.yml     # lint · typecheck · unit · build · e2e · lighthouse
```

## Unit / component tests

Already wired into every hook and component that has meaningful logic
(`src/hooks/*.test.tsx`, `src/lib/api/*.test.ts`, `src/components/**/*.test.tsx`).
Convention: mock the hook/module boundary directly with `vi.mock`, assert on
accessible roles/text rather than class names or test ids, and put the test file
next to the thing it covers. Run with:

```bash
npm run test
```

## End-to-end (Playwright)

`e2e/checkout.spec.ts` runs against a live URL (defaults to production,
override with `PLAYWRIGHT_BASE_URL` for a Vercel preview) rather than a local
dev server, since the app depends on the real oghie-store Django API. It
currently only covers the **anonymous** path — catalog renders, cart icon
opens the drawer and shows the sign-in prompt. A full add-to-cart → checkout
E2E test needs a seeded test account and is a natural next addition.

```bash
npx playwright install --with-deps chromium webkit   # one-time
npm run test:e2e
npm run test:e2e:ui   # interactive runner
```

## Lighthouse CI

`lighthouserc.js` runs Lighthouse against the deployed URL 3x and fails the
build on regressions past the budgets defined there (performance ≥ 0.85,
accessibility/best-practices ≥ 0.95, SEO ≥ 0.9, LCP ≤ 2.5s, CLS ≤ 0.1).

```bash
npm run lighthouse
```

## CI

`.github/workflows/ci.yml` runs on every PR against `claude/project-setup-egnj0z`
(this repo's actual default branch — double-check that if you ever touch the
workflow, a wrong branch name silently disables CI). `build` gates `e2e` and
`lighthouse`, which both run against the deployed prod URL until a preview-URL
wiring is added.
