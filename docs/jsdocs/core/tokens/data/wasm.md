# `core/tokens/data/wasm.ts`

WASM worker action tokens — message `type` values understood

| | |
|---|---|
| **Source** | `src/core/tokens/data/wasm.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `WASM_ACTIONS`

Frozen `{ NAME: 'NAME' }` action map built from `_WASM_ACTION_LIST` —
workers dispatch on `type`, and self-keyed entries make typos
compile-checkable while the wire value stays the plain string.

### `WASM_POOL`

Frozen worker-pool sizing + asset tokens. Sole declaration site for the
worker script path and the pool-size caps — mobile SoCs thermal-throttle
under wide pools so the cap is tighter than desktop; the cores fallback
covers engines without navigator.hardwareConcurrency.

### `WASM_CSS`

Dynamic-CSS injector tokens — the managed <style> node's sole rule is
the GPU compositor-promotion utility class; skeleton defaults cover the
analytics-sizing helper's CSS fallbacks.
