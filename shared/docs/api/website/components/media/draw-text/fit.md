# `website/components/media/draw-text/fit.ts`

| | |
|---|---|
| **Source** | `src/website/components/media/draw-text/fit.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `availableWidth`

Returns the parent's horizontal content-box width in px — the space the
title is actually allowed to occupy. Falls back to the host's own
clientWidth when the element has no parent (detached / test mounts).
- `@param` host — the draw-text element
- `@returns` available width in px, `0` when unmeasurable

### `widestWord`

Returns the widest word span inside the shadow root in px. Words are
`inline-block` + `nowrap`, so their rect is the true overflow source —
the line itself wraps legally at the space tokens.
- `@param` host — the draw-text element
- `@returns` widest `.draw-text__word` width in px

### `fitText`

Measures and (only when overflowing) scales the host's font size and
letter spacing so the widest word fits the parent's content box.
Clears the inline overrides first so re-measurement is always relative
to the stylesheet ramp. No-ops without the `fit` attribute, without a
measurable box, or when the text already fits.
- `@param` host — the draw-text element

### `setupFit`

Installs the fit pipeline for a fitted host: immediate measure, a
ResizeObserver on the parent (the sizing constraint) for breakpoint /
orientation changes, and a one-shot refit once webfonts finish loading
(late font swaps can widen the same word by several percent).
- `@param` host — the draw-text element

### `teardownFit`

Disconnects the fit observer and restores the stylesheet font sizing —
called on disconnect and when the `fit` attribute is removed.
- `@param` host — the draw-text element
