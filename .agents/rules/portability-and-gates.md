# Portability & Gates

- Components are self-contained: no cross-component imports; shared helpers live in `core/utils`/`core`. Enforced by `shared/tests/governance/component-portability.test.js`.
- Tests are JavaScript on purpose — do not migrate them; still use token imports.
- Coverage: 100% per file (statements/branches/functions/lines) via `shared/scripts/verify/coverage-gate.mjs`.
- Coverage tails: `<module>/tests/coverage/<domain>/<subdomain>/` mirroring `src/` (`core/component`, `utils/wasm`, `canvas/widgets`, `cms/editors`, `routes/pages`, …) — one file per describe. Cross-domain sweep files live in `<module>/tests/coverage/sweep/`. Never `jest.resetModules()` after exercising a module — istanbul discards earlier instance hits.
- WebGL acquisition goes through `core/utils/canvas/webgl-mode.ts` (`webglContext`) so `?debug=webGLMode:fallback` stays authoritative. `?debug=sendNotificationTest` mounts a toast.
- Zero console: every `console.*` in `shared/src/` is a violation — diagnostics go through `core/devlog.ts` (`devWarn`/`devError`/`devInfo`, inspect via `__lkDevLog()`); `shared/scripts/verify/console-scan.mjs` fails the gate on any callsite.
- Recursion is the preferred shape for self-similar traversal (filesystem trees, nested children, DOM subtrees) — no manual stack/queue emulation; annotate legitimately-iterative drains. Per-frame canvas/WebGL math stays in GPU shaders or sync math; batch CPU work routes through `utils/wasm/wasm-pool.ts`.
- Test imports into src must use the `@/` alias, never `../../../src/…` deep relatives.
- NEVER deploy (`npm run deploy`, `firebase deploy`) without an explicit user instruction for that specific deploy.
- `npm run verify` before commit/push; hooks versioned at `shared/scripts/git-hooks/`, install via `shared/scripts/install-hooks.sh`.
