---
name: quality-gates
description: The verification pipeline, hook wiring, and the hard prohibition on deploying without explicit user approval.
---

# Quality Gates

## Pipeline

`npm run verify` is THE gate (also runs as `prebuild` and in git hooks):

1. `shared/scripts/verify/console-scan.mjs` — no forbidden console calls in the module sources
2. `tsc --noEmit`
3. `eslint src tests --max-warnings=0`
4. jest + coverage (includes axe a11y scan)
5. `shared/scripts/verify/coverage-gate.mjs` — 100% per file
6. `shared/scripts/verify/security-scan.mjs` — snyk (or npm audit fallback); high/critical fail

Style gate: `npm run stylelint` (`{shared,core,website,cms,experiments}/**/*.scss`, config `.stylelintrc.json`).
Format gate: `npm run format:check`; autofix via `npm run format`.
Lighthouse: `npm run lighthouse` — all categories 100 except performance.

## Hooks

Versioned in `shared/scripts/git-hooks/` — install via `shared/scripts/install-hooks.sh`:

- `pre-commit`: prettier --write staged files, re-stage, then verify
- `pre-push`: verify

## Console discipline

`console.log/debug/trace/table/group*` are forbidden in `shared/src/`; `warn/error/info` allowed only as intentional signal. Enforced by console-scan.

## Istanbul suppressions — HARD RULE, never add them

`istanbul ignore` comments (`next`/`if`/`else`/`file`) are forbidden for agents — uncovered statements/branches/functions get real tests (dispatch synthetic events, mock rejections, drive component state), never a suppression comment. The only permitted occurrences are the grandfathered `ISTANBUL_BASELINE` entries in `shared/tests/fixtures/test-constants.js` — the baseline may only shrink. Enforced by `style-governance.test.js` Rule 32.

## Never stop before full delivery

Do not stop or report completion until every item is green in the current session: code comments placed, docs updated, all Jest gates, all a11y gates, all security gates, the performance gate, all Lighthouse gates, a build with zero errors/warnings, a clean preview, and committed+pushed changes when the task calls for it. A red gate is a work item — fix the root cause and re-run; "passed earlier" or "looks flaky" does not count.

## DEPLOYMENT — never without asking

Never run `npm run deploy`, `firebase deploy`, or any deploy command unless the user explicitly asks for that specific deploy in the conversation. Verification and builds never deploy.

## Process hygiene — no leaked children

Headless Chrome/puppeteer, dev servers (vite), and watch/batch jobs MUST be fully reaped after use — leaked zombies have filled the swap partition and killed the session before. Rules:

- Wrap browser use in try/finally: `await browser.close()` then `browser.process()?.kill('SIGKILL')` as backstop.
- Launch chrome with `--no-zygote --single-process --disable-dev-shm-usage` to minimize child processes.
- Give every script a hard `setTimeout(() => process.exit(2), …)` ceiling so a hung page can't pin chrome forever.
- Kill dev servers you started when done (`pkill -f <pidfile>`/shell kill), and verify with `ps` that no chrome/jest/vite processes survive.
