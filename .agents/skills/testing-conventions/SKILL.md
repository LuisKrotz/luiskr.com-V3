---
name: testing-conventions
description: Test layout, JavaScript-on-purpose policy, 100% per-file coverage, coverage-tail organization, and istanbul/resetModules pitfalls.
---

# Testing Conventions

## Language

Tests under `tests/` are intentionally **JavaScript** — they exercise the runtime surface as a consumer would and stay decoupled from type churn. Do not migrate tests to TS. Token-import and zero-hardcoding rules still apply (fixtures in `tests/fixtures/test-constants.js`).

## Coverage

- Gate: 100% statements/branches/functions/lines **per file** — `scripts/verify/coverage-gate.mjs`, runs in `npm run verify`.
- Coverage tails live under `tests/coverage/<domain>/<subdomain>/` mirroring the `src/` tree (`core/component`, `core/store`, `utils/wasm`, `utils/gpu`, `canvas/widgets`, `cms/editors`, `routes/pages`, `playground/earth`, …) — one file per describe, named after the module under test. Cross-domain sweep files live in `tests/coverage/sweep/`; never resurrect a `misc/` junk drawer.
- Test files should stay fast (<1s each).

## istanbul + jest.resetModules pitfall

Counters are per module instance. `jest.resetModules()` + re-import creates a new instance whose counters replace the earlier ones in the merged report — hits recorded before the reset are silently discarded. For tails that need module-state isolation, use dedicated reset-free files and exercise arms via exported functions instead.

## Flake prevention

- Never rely on real `requestIdleCallback`/`setTimeout` timing: stub or poll with a deadline. Use `waitFor(fn)` from `tests/fixtures/test-constants.js` (15s budget) instead of fixed `setTimeout` waits before assertions.
- Boot tests must `await (await import('@/main.js')).bootPromise` — the exported boot promise prevents lazy `import()` calls from executing in a torn-down registry.
- Firebase is unauthenticated in tests — `setLogLevel('silent')` plus the `TEST_NOISE` console filter (both in `tests/setup.js`/`test-constants.js`) keep output at zero warnings/errors. Expected-noise signatures are documented in `TEST_NOISE`; non-matching output still prints and must be investigated.

## Zero-warning output

Test output must be free of warnings/errors. `tests/setup.js` wraps `console.warn/error/info` and drops messages matching `TEST_NOISE` (in `test-constants.js`) — Firebase offline writes, CMS-mock logging, engine teardown races, and deliberate warn-path exercises. New expected noise gets an entry with a documented reason; anything else printing is a bug to fix, not suppress.

## Debug params under test

`?debug=webGLMode:fallback` (via `window.history.replaceState`) forces every `webglContext` acquisition to fail → fallback path. `?debug=sendNotificationTest` mounts a toast.
