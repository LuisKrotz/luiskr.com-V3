# Portability & Gates

- Components are self-contained: no cross-component imports; shared helpers live in `src/utils`/`src/core`. Enforced by `tests/governance/component-portability.test.js`.
- Tests are JavaScript on purpose — do not migrate them; still use token imports.
- Coverage: 100% per file (statements/branches/functions/lines) via `scripts/verify/coverage-gate.mjs`.
- Coverage tails: `tests/coverage/<domain>/<subdomain>/` mirroring `src/` (`core/component`, `utils/wasm`, `canvas/widgets`, `cms/editors`, `routes/pages`, …) — one file per describe. Cross-domain sweep files live in `tests/coverage/sweep/`. Never `jest.resetModules()` after exercising a module — istanbul discards earlier instance hits.
- WebGL acquisition goes through `src/utils/canvas/webgl-mode.ts` (`webglContext`) so `?debug=webGLMode:fallback` stays authoritative. `?debug=sendNotificationTest` mounts a toast.
- NEVER deploy (`npm run deploy`, `firebase deploy`) without an explicit user instruction for that specific deploy.
- `npm run verify` before commit/push; hooks versioned at `scripts/git-hooks/`, install via `scripts/install-hooks.sh`.
