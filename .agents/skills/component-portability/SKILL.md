---
name: component-portability
description: Keep components self-contained and portable — a component folder's JS/TS + SCSS must work standalone when copied to another project.
---

# Component Portability

A component folder (`website/components/<domain>/<name>/` or `website/components/<domain>/<Name>.tsx`) must be copyable to another project and work with different data.

## Rules

- Never import from another component's folder. Shared helpers belong in `core/utils/` or `core/`.
- Allowed import roots: `core`, `core/utils`, `core/sass` (`?inline`), `core/firebase`, `src/data`, `src/polyfills`, plus `core/router/router.js` + `core/router/types.js` (navigation singleton contract).
- Never import `website/views` view modules, `cms/*`, or `src/app/*` inside `website/components`.
- Decomposed components keep a facade (`Name.tsx`) holding state + public methods; behavior lives in same-named subfolder modules (`name/render.tsx`, `name/events.ts`). Facade methods delegate so test spies keep working.
- SCSS travels with the component via `?inline` imports — shadow-DOM scoped.

## Enforcement

`tests/governance/component-portability.test.js` scans all imports and fails on violations.
