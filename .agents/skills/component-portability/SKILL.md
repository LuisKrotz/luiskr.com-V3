---
name: component-portability
description: Keep components self-contained and portable — a component folder's JS/TS + SCSS must work standalone when copied to another project.
---

# Component Portability

A component folder (`src/components/<domain>/<name>/` or `src/components/<domain>/<Name>.tsx`) must be copyable to another project and work with different data.

## Rules

- Never import from another component's folder. Shared helpers belong in `src/utils/` or `src/core/`.
- Allowed import roots: `src/core`, `src/utils`, `src/sass` (`?inline`), `src/firebase`, `src/data`, `src/polyfills`, plus `src/routes/router.js` + `src/routes/types.js` (navigation singleton contract).
- Never import `src/routes` view modules, `src/cms/*`, or `src/app/*` inside `src/components`.
- Decomposed components keep a facade (`Name.tsx`) holding state + public methods; behavior lives in same-named subfolder modules (`name/render.tsx`, `name/events.ts`). Facade methods delegate so test spies keep working.
- SCSS travels with the component via `?inline` imports — shadow-DOM scoped.

## Enforcement

`tests/governance/component-portability.test.js` scans all imports and fails on violations.
