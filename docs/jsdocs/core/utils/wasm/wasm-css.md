# `core/utils/wasm/wasm-css.ts`

Dynamic-CSS injector: owns the single &lt;style id="wasm-dynamic-css"&gt;

| | |
|---|---|
| **Source** | `src/core/utils/wasm/wasm-css.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Skeleton-placeholder style tuple produced by calcWasmSkeletonStyle.

### `width`

CSS width — `${n}px` for numeric input, passthrough for strings.

### `height`

CSS height — `${n}px` for numeric input, passthrough for strings.

### `borderRadius`

CSS border-radius — a var() token reference.

### `display`

CSS display — inline-block so the placeholder participates in text flow.

### `styleSheetEl`

The lazily-created managed <style> node in <head>.

### `WASMCSSManager`

Injects generated utility CSS into a single managed <style> element.
Keeps a rule registry so repeated injects update in place instead of
appending duplicates — used by the WASM layout helpers for classes they
compute at runtime.

### `initStyleSheet`

Finds-or-creates the shared <style id="wasm-dynamic-css"> node and
injects the static rule set. SSR-safe: returns early without document.

### `injectStaticWasmCSS`

Writes the baseline rules — the GPU compositor-promotion utility class
(will-change + translate3d + backface-visibility) used by carousel and
media components. Skeleton shimmer stays CSS-only in _structure.scss.

### `calcWasmSkeletonStyle`

Computes the skeleton-placeholder style tuple (dimensions only — the
shimmer animation is CSS-driven). Numeric inputs become px strings;
strings pass through. As a side effect it dispatches a media-analytics
job to the pool so sizing telemetry feeds the WASM analytics pipeline.
- `@param` width CSS width or pixel number (default 100%).
- `@param` height CSS height or pixel number (default 1.2em ≈ one text line).
- `@param` borderRadius CSS radius (default var(--radius-2xs)).
- `@returns` The style tuple for inline application.

### `setWasmCSSRule`

Appends a new selector rule once — dedupes by selector substring so
repeat calls can't bloat the sheet with identical rules.
- `@param` selector CSS selector text.
- `@param` declarations Declaration body (`prop: value; …`).

### `wasmCSS`

Shared injector singleton — one managed <style> node serves every
runtime rule so the head never accumulates duplicate sheets.

### `calcWasmSkeletonStyle`

Convenience wrapper over wasmCSS.calcWasmSkeletonStyle — the historical
free-function API kept so call sites stay on the old import.
- `@param` w Width (CSS string or px number).
- `@param` h Height (CSS string or px number).
- `@param` r Border-radius override.
- `@returns` The skeleton style tuple.
