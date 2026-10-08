# `core/tokens/attrs/common.ts`

Generic DOM attribute + attribute-value tokens — the

| | |
|---|---|
| **Source** | `src/core/tokens/attrs/common.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `COMMON_ATTRS`

Frozen common attribute-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `CLASS`

`class` attribute name — used where setAttribute targets classes (SVG, foreign contexts).

### `CLASS_NAME`

`className` IDL property name — for property-style assignment in the JSX pragma.

### `ID`

`id` attribute name.

### `STYLE`

`style` attribute name — shared via _K_STYLE so the literal is declared once.

### `LANG`

`lang` attribute — set on <html> when the locale changes (a11y/SEO contract).

### `DEFAULT_LANG`

Default language code — English is the canonical un-prefixed locale.

### `OPEN`

`open` attribute — also the ShadowRoot mode value ('open' shadow roots stay inspectable).

### `HIDDEN`

`hidden` attribute/value — used for both the attribute and visibility checks.

### `VISIBLE`

`visible` marker value — counterpart to HIDDEN in visibility state comparisons.

### `PROP`

`prop` — generic prop identifier used by CMS editor field bindings.

### `SECTION`

`section` — element/attribute name for landmark sections.

### `PX`

`px` — the CSS pixel unit suffix for numeric style assignments.

### `DELAY`

`delay` — animation/transition delay field name in option objects.

### `OFFSET`

`offset` — geometry offset field name.

### `CLASSES`

`classes` — option-bag field carrying a class list.

### `TRIGGER`

`trigger` — DrawText trigger attribute name (viewport/manual).

### `ORDERED`

`ordered` — DrawText queue flag: marks the element as part of the
document-order reveal session, so its `offset` is read as a scheduled
start on the shared clock instead of a delay after its own trigger.

### `TRIGGER_VIEWPORT`

`viewport` trigger value — DrawText plays when scrolled into view.

### `TOUCH`

`touch` input-method value — primary-input is coarse (see store/state.ts probe).

### `POINTER`

`pointer` input-method value — fine pointer (mouse/trackpad) primary input.

### `FIT`

`fit` — sizing/fit field name used by media layout contracts.
