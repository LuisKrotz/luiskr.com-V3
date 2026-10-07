# `core/tokens/motion/prefetch.ts`

Predictive-prefetch tuning tokens.

| | |
|---|---|
| **Source** | `src/core/tokens/motion/prefetch.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `NPU_PREDICT`

NPU/GPU predictor scoring constants — the heuristic weights for
hover-dwell vs pointer-speed and the auto-prefetch confidence cutoff.
NPU/GPU tiers share the same linear blend (base + hover·w + (1−speed)·w)
with slightly different coefficients per compute target; the WASM
tier converts a spring-physics position into the same 0–1 scale.

### `PREFETCH_THRESHOLD`

Confidence needed to auto-prefetch the route asset.

### `HOVER_FULL_MS`

Hover dwell (ms) that counts as full intent.

### `SPEED_FULL`

Pointer speed (px/ms) that counts as "passing through".

### `NPU_BASE`

NPU tier: base + hover weight + inverse-speed weight + cap.

### `GPU_BASE`

GPU tier — same blend, fractionally different coefficients.

### `WASM_SPRING_TARGET`

WASM tier: spring position normalization + bounds.

### `JS_BASE`

Last-resort JS heuristic when the worker returns no position.

### `DEVICE_TYPE`

WebNN deviceType requested from navigator.ml.
