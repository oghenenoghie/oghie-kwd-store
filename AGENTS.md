<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:testing-rules -->
# Every change needs a passing test before it merges

This repo has shipped regressions straight to production before a test suite existed (a registration form missing a required field, eight footer links 404ing on every page load) — both would have been caught by a test that ran before merge instead of a user reporting it after.

- Any change to `src/` needs a Vitest test that would fail without it — not just `npm run lint`/`npm run typecheck` passing. Put it next to the file it covers (`foo.ts` → `foo.test.ts`).
- Run `npm run test` locally before opening a PR.
- CI (`.github/workflows/ci.yml`) runs lint, typecheck, test, and build on every PR — confirm the `build` check is actually green on the PR before merging, don't assume.
- Note: this repo's real default branch is `claude/project-setup-egnj0z`, not `main` — double-check CI triggers reference the actual branch name if you ever touch `ci.yml`, since a wrong branch name silently disables CI entirely (which is exactly what happened before this rule existed).
<!-- END:testing-rules -->
