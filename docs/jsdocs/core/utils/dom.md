# `core/utils/dom.ts`

Shadow-piercing DOM queries + the SVG placeholder helper.

| | |
|---|---|
| **Source** | `src/core/utils/dom.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Any node that can host a subtree worth scanning.

### `deepQuerySelector`

Depth-first search for the FIRST element matching `selector`, descending
through every nested shadow root it passes. Order matches the visual
document order (parents before their shadow children).

### `deepQuerySelectorAll`

Same traversal as deepQuerySelector but collects EVERY match across all
shadow trees — used for sweeps like "pause every video on the page".

### `svgPlaceholder`

Generates an ultra-lightweight inline SVG placeholder data URI with exact
dimensions. An empty `<svg viewBox="0 0 w h">` weighs ~90 bytes, decodes
instantly, and — crucially — gives the `<img>` the right intrinsic aspect
ratio so layout is stable while the real image streams in (zero CLS).
Default is FHD 1920×1080 (16:9), the common media shape.
