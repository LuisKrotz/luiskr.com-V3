# `core/utils/dom.ts`

Shadow-piercing DOM queries + the SVG placeholder helper.

| | |
|---|---|
| **Source** | `src/core/utils/dom.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Any node that can host a subtree worth scanning.

### `_root`

document when it exists, null in non-DOM contexts (SSR/test shims).

### `deepQuerySelector`

Depth-first search for the FIRST element matching `selector`, descending
through every nested shadow root it passes. Order matches the visual
document order (parents before their shadow children). Recursion — not a
hand-rolled stack — matches the self-similar tree shape per repo rule 20.
- `@param` selector CSS selector.
- `@param` root Subtree root; defaults to document when present.
- `@returns` First match or null.

### `deepQuerySelectorAll`

Same traversal as deepQuerySelector but collects EVERY match across all
shadow trees — used for sweeps like "pause every video on the page".
The results array is threaded through recursion (accumulator style) so
no intermediate arrays get concatenated per level.
- `@param` selector CSS selector.
- `@param` root Subtree root; defaults to document.
- `@param` results Accumulator — internal recursion state, omit externally.
- `@returns` All matching elements in visual document order.

### `svgPlaceholder`

Generates an ultra-lightweight inline SVG placeholder data URI with exact
dimensions. An empty `<svg width height viewBox>` weighs ~110 bytes,
decodes instantly, and — crucially — gives the `<img>` a definite intrinsic
size AND aspect ratio, so `width:auto` layouts reserve the real natural box
while the actual image streams in (zero CLS, no uniform-width stretching).
Without the width/height attrs the SVG is intrinsic-ratio-only and the img
collapses to the ~300×150 default replaced size. Default is FHD
1920×1080 (16:9), the common media shape. `encodeURIComponent` (not
base64) keeps the URI readable and is the spec-supported form for
`data:image/svg+xml` per RFC 2397 — b64 would inflate size ~33%.
- `@param` w Intrinsic width to declare (px).
- `@param` h Intrinsic height to declare (px).
- `@returns` `data:image/svg+xml;charset=utf-8,…` URI for img.src.
