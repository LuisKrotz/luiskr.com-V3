---
name: quality-gates
description: The verification pipeline, hook wiring, and the hard prohibition on deploying without explicit user approval.
---

# Quality Gates

## Pipeline

`npm run verify` is THE gate (also runs as `prebuild` and in git hooks):

1. `scripts/verify/console-scan.mjs` — no forbidden console calls in src/
2. `tsc --noEmit`
3. `eslint src tests --max-warnings=0`
4. jest + coverage (includes axe a11y scan)
5. `scripts/verify/coverage-gate.mjs` — 100% per file
6. `scripts/verify/security-scan.mjs` — snyk (or npm audit fallback); high/critical fail

Style gate: `npm run stylelint` (`src/**/*.scss`, config `.stylelintrc.json`).
Format gate: `npm run format:check`; autofix via `npm run format`.
Lighthouse: `npm run lighthouse` — all categories 100 except performance.

## Hooks

Versioned in `scripts/git-hooks/` — install via `scripts/install-hooks.sh`:

- `pre-commit`: prettier --write staged files, re-stage, then verify
- `pre-push`: verify

## Console discipline

`console.log/debug/trace/table/group*` are forbidden in `src/`; `warn/error/info` allowed only as intentional signal. Enforced by console-scan.

## DEPLOYMENT — never without asking

Never run `npm run deploy`, `firebase deploy`, or any deploy command unless the user explicitly asks for that specific deploy in the conversation. Verification and builds never deploy.
