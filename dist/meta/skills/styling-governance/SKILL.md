---
name: styling-governance
description: SCSS layering rules — CSS custom properties in components, token ownership, grid breakpoints, and shared vs component styles.
---

# Styling Governance

## Layer contract

- `_variables.scss`/`_mixins.scss`/`_placeholders.scss`/`_structure.scss` own SCSS `$` tokens and emit the root CSS custom properties.
- Component SCSS consumes `var(--…)` custom properties only — never `$color-*`/`$space-*` directly.
- Shared primitives (grid `%MAXAREA`, overlays) read the same `$grid-steps` map in `_variables.scss` — one source of truth for breakpoint gutters/columns.

## Component styles

- Colocated via `styles.scss?inline` imports into shadow DOM.
- Comments must explain what the block styles and where it appears in the UI.
- BEM composition from a single `$_B_*` root per file — never repeat a block prefix string.
- No `!important`, no raw dimensions/radii/colors — tokens only.

## Responsive

Breakpoints must match the shared `$grid-steps` map (414, 960, 1280, 1440, 1920, 3840, 5120, 7680). The debug overlay (`_grid-overlay.scss`) and `%MAXAREA` must never diverge — verified by `shared/tests/governance/grid-overlay.test.js`.

## Lint

`npm run stylelint` — config `.stylelintrc.json` (postcss-scss). Intentional same-value fallbacks (`100vh`→`100dvh`) are allowed via `consecutive-duplicates-with-different-values`.
