# Styling & governance

## Sass layout

```
core/sass/
├── base/                 token layer — the ONLY files that may use $vars
│   ├── _variables.scss   $color-*, $space-* Fibonacci scale, $cms-*
│   ├── _mixins.scss      to-rem(), media helpers
│   ├── _fonts.scss       .ttl-* type scale
│   ├── _placeholders.scss %MAXAREA, %RESETBTN, %SKEL_DARK_SURFACE, …
│   ├── _structure.scss   :root CSS custom properties (--bg-*, --skel-*,
│   │                     --grey-*, --shadow-*, --space-*, --radius-*)
│   └── _grid-overlay.scss
└── components/           per-component shadow styles (consumed ?inline)
    app.scss              app-nav + global shell styles (imported by main.ts)
    home-mosaic.scss, carousel*.scss, internals.scss, media-figure.scss,
    modal.scss, preferences.scss, stats-hud.scss, draw-text.scss,
    about.scss, contact.scss, awards-footer.scss, safari-*.scss,
    intro-loader.scss, carousel-host.scss
```

Route-scoped styles live next to their views (`routes/*.scss`,
`playground/space-playground.scss`, `cms/sass/cms.scss`).

The old flat `core/sass/*.scss` duplicate layer was deleted — it had drifted
from the live `components/` copies (missing fixes) and was only reachable via
a stale `Footer.tsx` import (now repointed to `components/internals.scss`).

## Rules (AGENTS.md, enforced by tests/governance/style-governance.test.js)

1. **No raw colors** — `var(--*)`/tokens only; hex/`rgba()` literals only in
   `base/_variables.scss` (definitions) and `base/_structure.scss` shadow
   tokens.
2. **No raw spacing** — `to-rem($space-*)` or `var(--space-*)`.
3. **No raw radii** — `var(--radius-*)`/`to-rem($space-2xs)`.
4. **No raw class names in JS** — `CLASSES.*`/`CMS_CLASSES.*`; BEM block
   strings via `$_B_*` SCSS vars.
5. **No repeated string literals** — anything used twice moves to a leaf
   group in `core/tokens/**`, surfaced through `core/constants.ts`
   (PATHS, ATTRS, EVENTS, CLASSES, URLS, MEDIA, CMS_KEYS…).
   The rule applies to `tests/` too: every literal matching a token value must
   be an import; test-only vocabulary lives in
   `tests/fixtures/test-constants.js` (`TEST_*` groups). Enforced by
   style-governance Rule 11.
6. **JSX only** — `h()`/`Fragment`; no HTML template strings or `innerHTML`
   for structure.
7. **No `!important`.**
8. **Component SCSS consumes CSS vars** — `$` vars only in `base/` files.
9. **DRY selectors** — `@extend`/BEM composition; block prefix strings once.
10. **One blank line** between logical steps in functions.
11. **Governance is automated** — new rule ⇒ new check in
    `style-governance.test.js`.

The governance suite scans `core/sass/**` recursively (`base/` excluded from
color/keyword rules — it is the definition layer) and every
`{src,core,website,cms,experiments}/**/*.{ts,tsx,js}` for rules 4–6 and 9–10.

## Theme system

`:root` declares light tokens in `_structure.scss`; `[data-theme="dark"]` (or
media-query block) overrides them. Components never branch on theme — they
read `var(--*)`. Shadow-DOM components inherit custom properties across the
boundary; `:host-context()` rules reach out for ancestor-based variants
(e.g. `.internal-extra-item` sizing).

## Keyboard focus + hover parity

- `--focus-ring` (in `_structure.scss`) tracks `--color-accent-contrast` —
  deep teal in light mode, signature cyan in dark — so the Tab affordance
  matches the palette and clears the WCAG 2.4.13/1.4.11 ≥3:1 floor.
- `@mixin focus-ring` (declarations) and `@mixin focus-ring-scope`
  (`a`/`button`/`input`/`summary`/`[role=…]`/`[tabindex]` under
  `:focus-visible`) live in `_mixins.scss`. `_structure.scss` emits the
  scope once at top level — every component stylesheet that imports the
  base layer ships it inside its shadow root (document rules don't cross
  the boundary). Files that don't import `_structure` add
  `@include focus-ring-scope;` at the bottom — verified by convention.
- Hover affordances must also fire under keyboard focus: every `&:hover`
  selector group carries a cloned `&:focus-visible` sibling (compound
  selectors like `&:hover:not(&--active)::before` are cloned whole).
- Enter/Space activation: custom-element controls expose `role="button"` +
  `tabindex="0"` AND a `keydown` handler (see `BurgerButtonWebGL`) — the
  canvas is the only focusable control while WebGL renders because the CSS
  fallback `<button>` is `display:none`. Redundant decorative canvases
  (theme slider, switch, check) are `aria-hidden`; the real
  `<button>`/`<input>` beside them carries the interaction.
- JS-driven hover effects need the same parity: `focusin`/`focusout`
  listeners (they bubble — `focus`/`blur` don't) mirror the mouseover
  expand, e.g. the HomeMosaic card details opening when Tab reaches a
  card's control.
- Click-to-reveal text (e.g. the footer disclaimer clamp) is a real
  `<button>` with `aria-expanded` — never a bare `<p>`/`<div>` click target.

## Known debt

`cms/sass/cms.scss` still contains raw `rem`/`rgba`/hardcoded values from the
pre-governance era — it renders in a normal shadow root so CSS vars work; the
file should migrate to `to-rem($space-*)` + `var(--*)` + `$_B_*` composition.
All CMS editors render JSX now; `innerHTML:` props on textareas are
value bindings, not template-string HTML.
