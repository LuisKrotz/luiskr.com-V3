---
name: wrap-up
description: Full pre-release wrap-up pipeline — comments, docs, content surfaces (animations, searchThemes, RSS, sitemap, robots, llms, md), version bump, all quality gates (jest, a11y, security, perf, lighthouse, print, clean build+preview), CMS report table, then commit + push. NEVER deploys.
triggers:
  - user
  - model
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
---

# Wrap-Up — Pre-Release Pipeline

Run every phase below end-to-end. Do not stop early and do not report completion until every gate is green in THIS session — a red gate is a work item: fix the root cause and re-run it. "Passed earlier" does not count.

## Hard prohibitions (always on)

- NEVER deploy: no `yarn deploy`, no `firebase deploy`, no `upload-*-firebase.js` scripts (live RTDB writes), no `submit-indexnow` runs.
- Project rules stay enforced throughout: zero console calls (`core/devlog.ts` only), zero `!important`, zero hardcoded colors/dimensions/radii/class-names/strings (tokens, `CLASSES`, `core/constants.js` only), no istanbul suppressions, no codemods/bulk rewrites, JSX via `h`/`Fragment` only, yarn only — never npm/npx, recursion for self-similar traversal, one blank line between logic blocks.
- Process hygiene: kill every dev server / headless browser you start; verify no leaked vite/chrome/jest processes remain.

## Phase 1 — Comments & docs

1. `git status` + `git diff` at root AND inside each dirty submodule (`core`, `shared`, `website`, `cms`, `experiments/*`) to inventory the work being wrapped up.
2. Add/update JSDoc on every touched declaration — purpose + effect, `@param`/`@returns`; detailed math explanations for WebGL/three.js/calc code (Rule 21; enforced by `jsdoc-coverage.test.js`). Refresh stale inline comments where behavior changed.
3. Regenerate docs: `yarn docs` (docs:api + docs:jsdocs + docs:typedoc + docs:sassdoc).
4. Update `AGENTS.md`, READMEs, module docs, and any `.md` documentation affected by the change set. If a new project rule was introduced, add its automated check to `shared/tests/governance/style-governance.test.js`.

## Phase 2 — Content surfaces

5. **Animations page** — update `website/views/animations` content/descriptions/alts; re-run `node shared/scripts/i18n/patch-animation-descriptions.js` when descriptions change.
6. **searchThemes** — `node shared/scripts/i18n/patch-all-pages-search-themes.js`: rebuilds every page/project `searchThemes` array in `database.json` across all 16 locales (feeds meta keywords, JSON-LD, sitemap captions, /llm/ replicas). Do NOT run `upload-search-themes-firebase.js` — that writes live.
7. **RSS feed** — `node shared/scripts/build/generate-sitemap.js` regenerates `website/public/meta/feed.xml`, per-locale `meta/<loc>/feed.xml`, `rss.xml` and `feed.css` from current CMS + media-manifest data.
8. **Sitemap + robots** — same script emits `sitemap.xml`, `sitemap-<loc>.xml`, `sitemap-news.xml`, `urllist.txt`, root `robots.txt` and per-locale `robots.txt` into `website/public/meta/`.
9. **llms + md replicas** — `node shared/scripts/build/generate-llm-pages.mjs` emits `llms.txt`, the `/llm/` markdown+JSON replica tree and `<route>.md`/`.json` siblings (also runs inside `yarn build` via build-targets).
10. **Search index** — `node shared/scripts/build/generate-search-index.mjs` refreshes `search-index-*.json`.
11. SEO contract must stay green: `seo-indexation.test.js` + `seo-route-parity.test.js` (canonicals 200, sitemap lists only final indexable URLs, replicas noindexed).

## Phase 3 — Version bump

12. Inspect `git log` since the last version change; bump `"version"` in root `package.json` by semver: breaking → major, feat → minor, fix/perf/docs/chore → patch. If the version is surfaced anywhere else (footer, CMS, about page), update that token too — grep for the old version string.

## Phase 4 — Fix, performance & cleanup

13. `yarn lint:fix`, `yarn stylelint`, `yarn format` — then hand-fix anything remaining: SASS must consume CSS vars (never `$color-*`/`$space-*` in components), JS must use constants, both must pass `--max-warnings=0`.
14. Performance pass — review changed code against the perf skills: measure-first only (`perf-measure-protocol`), frame budgets (`perf-animation-frame`), no layout thrash (`perf-main-thread-layout`), batch CPU via wasm-pool (`perf-compute-offload`), delivery/chunk budgets (`perf-network-delivery`). Apply only measured improvements.
15. Print layout — verify `core/sass/base/structure/_print.scss` covers every new/changed surface; print-to-PDF the preview routes and confirm no clipped content or interactive chrome leaks into print.
16. Cleanup — dead code, unused imports, stale commented blocks, leftover scratch artifacts (e.g. root `.tmp-*` files). File-by-file edits only; confirm before deleting anything you did not create.

## Phase 5 — Quality gates (all must pass)

17. `yarn verify` — format check → console-scan → typecheck → eslint/stylelint → stored-result link validation → per-file 100% coverage gate → security scan.
18. Jest — `yarn test:coverage`: all suites green, 100% statements/branches/functions/lines per file (governance tests — style-governance, jsdoc-coverage, component-portability, axe-scan, contrast-aaa, seo-* — are the project-rules gate; they must pass too).
19. a11y — `yarn a11y` (+ `yarn media:a11y` if media changed): zero violations of moderate impact or higher.
20. Security — `yarn test:security`: zero high/critical; new unfixable dev-only risks need a justified `security-exceptions.json` entry, never blanket suppression.
21. Performance — `yarn test:fps` plus `chunk-budget` (runs inside build): within budget.
22. Lighthouse — `yarn lighthouse` (= `yarn build --verify-lighthouse`): all categories at their asserted thresholds.
23. Build + preview — `yarn build` exits with zero errors/warnings; `yarn preview` serves clean (no console errors/warnings). Kill the preview server when done.

## Phase 6 — Report

24. `yarn deploy:info` — bundles all `reports/` into `dist/deploy-info/` for the CMS "Build" tab.
25. Display the wrap-up report to the user as a markdown table — one row per gate/phase:

    | Gate            | Command              | Result | Report              |
    | --------------- | -------------------- | ------ | ------------------- |
    | Format          | `yarn format:check`  | PASS   | `reports/`          |
    | Jest + coverage | `yarn test:coverage` | PASS   | `reports/coverage*` |
    | …               | …                    | …      | …                   |

    Include phases 1–4 work items and every Phase-5 gate. FAIL rows must carry the fix that resolved them or the blocker.

## Phase 7 — Commit & push (never deploy)

26. Database changes first: stage and commit `database.json` plus regenerated `website/public/meta/` artifacts as their own commit (e.g. `chore(cms): regenerate search themes, sitemap, feeds`).
27. Commit + push everything bottom-up — for each dirty submodule: `cd <module> && git add -A && git commit && git push`; then at root `git add` the gitlink bumps + all remaining changes, commit, `git push`. Module hooks run their own gates — never `--no-verify`.
28. Confirm clean: `git status` empty at root and in every submodule.
