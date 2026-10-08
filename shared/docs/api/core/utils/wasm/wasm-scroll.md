# `core/utils/wasm/wasm-scroll.ts`

rAF-driven smooth scroller: animates window (or a container)

| | |
|---|---|
| **Source** | `src/core/utils/wasm/wasm-scroll.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Options bag for {@link wasmSmoothScroll}.

### (module scope)

Scroll container — selector (pierces shadow DOM), element, or window.

### (module scope)

Target element — selector or element.

### (module scope)

Numeric offset or {y}/{top} shape.

### (module scope)

Extra px offset applied to the target.

### (module scope)

Animation length in ms (default 600).

### (module scope)

Replace the URL hash on arrival.

### `wasmSmoothScroll`

Smoothly scrolls a container (or the window) to a target element or
numeric offset. Target resolution order: `element` (bounding rect
relative to the container's scroll origin) → numeric `scrollTo` →
`{y}/{top}` object → 0. Sub-`SCROLL_MIN_DISTANCE` moves early-out —
an invisible scroll would still run a full RAF loop and promote the
compositor layer for nothing. During the animation the scrolled root
gets a GPU compositor promotion (will-change/transform) so the browser
repaints a layer instead of relayouting, then `releaseElementGPU`
restores it on the last frame. `updateHistory` rewrites `#id` via
replaceState so it never pushes a history entry.
- `@param` options Container/target/duration configuration.
