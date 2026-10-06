# `utils/wasm/wasm-css.ts`

Dynamic-CSS injector: owns the single &lt;style id="wasm-dynamic-css"&gt;

| | |
|---|---|
| **Source** | `src/utils/wasm/wasm-css.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `initStyleSheet`

Finds-or-creates the shared <style> node and injects the static rule set.

### `injectStaticWasmCSS`

Writes the baseline rules (GPU-compositor promotion class).

### `setWasmCSSRule`

Appends a new selector rule once (dedupes by selector substring).
