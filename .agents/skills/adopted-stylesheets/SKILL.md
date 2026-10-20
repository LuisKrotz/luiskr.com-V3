---
name: adopted-stylesheets
description: Stylesheet delivery contract — CSS rules are authored in .scss and delivered via compiled sheets (document <link> / ?inline base styles / adoptedStyleSheets); never inline cssText, setAttribute('style'), or JS-authored rule strings.
---

# Adopted Stylesheets — Not Inline CSS

CSS rules in this project are **authored in `.scss` files** and delivered to a
root only through a compiled stylesheet. No JS string is a stylesheet.

## The channels

1. **Document sheet** — document-level rules live in `core/sass/base/structure/`
   partials, imported by `core/sass/base/_structure.scss` and compiled into the
   global `<link>` sheet (`app.scss` manifest).
2. **Every shadow root** — universal rules compile once via `?inline` into
   `core/tokens/styles.ts` (`BASE_HOST_STYLES`), which `BaseComponent._renderInitial`
   prepends to each component's adopted stylesheet — and to the legacy `<style>`
   fallback on engines without constructable sheets.
3. **Component scope** — per-component rules live in the component's own
   `styles.scss?inline` (adopted by `_renderInitial`, canonical implementation
   `core/Component.ts` `_sharedSheets` + `replaceSync` + `adoptedStyleSheets`).
4. **Runtime adoption** — when a helper must style nodes it injects into an
   arbitrary root, the rule text comes from a `?inline` SCSS import compiled
   once into a shared `CSSStyleSheet` and **appended** to
   `root.adoptedStyleSheets` (never a plain assignment — that wipes every other
   adopted sheet). Re-verify membership with `.includes()` on every call:
   `_renderInitial` re-assigns the array on re-mount and evicts foreign sheets.

## Forbidden

- `element.style.cssText = 'a:b;c:d'` — multi-declaration stylesheet payloads
  inlined on a node. (`core/jsx.ts` is the sole exception — it is the runtime
  that compiles the JSX `style` prop.)
- `element.setAttribute('style', '…')` rule payloads.
- Hand-writing CSS rule strings in JS/TS token files — rule text is authored
  in `.scss`; JS only transports the compiled `?inline` output.
- Relying on a document-level class rule for nodes injected into shadow roots —
  document CSS **never crosses the shadow boundary**. The rule must ship inside
  `BASE_HOST_STYLES` (universal) or the component's own `?inline` sheet.
- `display:none` on accessibility/crawler content — it evicts the node from the
  accessibility tree; use the clipped-1px visually-hidden pattern
  (`core/sass/base/structure/_a11y.scss` → `.sr-only`).

## Still allowed

Dynamic per-instance **value plumbing** is not stylesheet delivery and stays
legal: `style={{ [CSS_PROP]: v }}` / `style={{ prop: v }}` JSX props,
`style.setProperty()`, and single-property writes (`style.display`,
`style.transform`) driven by runtime state.

## Reference implementation

`.sr-only` in `core/sass/base/structure/_a11y.scss`: one authored rule →
`@import 'structure/a11y'` for the document sheet + `?inline` prepend inside
`BASE_HOST_STYLES` for every shadow root. A helper-injected node then carries
only its token class (`A11Y_CLASSES.SR_ONLY`) — the rule is already present in
whatever root it lands in.

## Why

A `.sr-only` class token with no reachable rule once shipped: helper
description nodes injected into shadow roots rendered their full text on-screen
because the document stylesheet could not cross the shadow boundary — and an
inline `cssText` workaround violated the project's styling contract instead of
fixing it. Rules are authored in SCSS, delivered through adopted sheets.
