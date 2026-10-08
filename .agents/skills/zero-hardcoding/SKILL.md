---
name: zero-hardcoding
description: Enforce the project's zero-hardcoding rule — every color, dimension, radius, class name, event, attribute, and string comes from token modules, never literals.
---

# Zero Hardcoding

Under NO circumstances introduce hardcoded values into this codebase.

## Colors

- No raw hex (`#fff`), rgb/rgba literals, or CSS var fallbacks (`var(--x, #000)`).
- Use SCSS tokens (`$color-*`, `$cms-*`) or root custom properties (`var(--bg-primary)`).
- Exception: `rgba(0,0,0,…)`/`rgba(255,255,255,…)` inside `--shadow-card-*` token declarations in `_structure.scss`.

## Spacing, dimensions, radii

- Only `to-rem($space-*)`, `var(--space-*)`, `var(--radius-*)`.
- CSS custom property values in `_structure.scss` use raw `rem` literals (to-rem is SCSS-only).

## Strings, classes, DOM vocabulary

- Every repeated string (class, tag, event, route, attribute, storage key) lives in `core/tokens/` (re-exported via `core/constants.js`) or `cms/tokens.js` for CMS.
- Tests follow the same rule — import tokens; test-only vocabulary goes in `tests/fixtures/test-constants.js`.
- No template-string HTML or innerHTML for templates — components return JSX (`h`, `Fragment` from `core/jsx.js`).

## Styles

- No `!important` anywhere.
- Component SCSS consumes CSS custom properties, never raw `$color-*`/`$space-*` — only `_structure.scss`, `_variables.scss`, `_mixins.scss`, `_placeholders.scss` may reference SCSS variables.
- Repeated selectors must use `@extend`/BEM `&--` composition from a single root.

## Enforcement

`tests/governance/style-governance.test.js` validates these rules — add a check there when adding a rule.
