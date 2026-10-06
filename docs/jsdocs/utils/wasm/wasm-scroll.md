# `utils/wasm/wasm-scroll.ts`

rAF-driven smooth scroller: animates window (or a container)

| | |
|---|---|
| **Source** | `src/utils/wasm/wasm-scroll.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### (module scope)

The WasmScrollOptions value.

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

Smoothly scrolls to an element/offset.
