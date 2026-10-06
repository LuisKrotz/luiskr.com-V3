# `utils/gpu/npu-predict.ts`

Hardware-tiered prefetch predictor: scores navigation

| | |
|---|---|
| **Source** | `src/utils/gpu/npu-predict.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### (module scope)

Minimal WebNN surface used by this predictor (navigator.ml).

### `initHardware`

Probes the execution tiers in order: WebNN NPU context, then the shared
GPU accelerator's GL context, then the WASM pool (always available).
Starts the pointer-velocity tracker afterwards.

### `bindInteractionListeners`

Tracks pointer velocity (px/ms) on window — a high-velocity gesture past a link means less intent to click it.

### `predictTargetLikelihood`

Scores how likely the user is to navigate to targetUrl (0–1).
Already-preloaded targets short-circuit at 1.0. Above 0.60 the route
asset is prefetched automatically.

### `preloadRouteAsset`

Injects a <link rel="prefetch"> for the route asset (deduped by preloadedTargets).

### `getNpuAnalytics`

Metrics snapshot for the stats HUD (prediction counts, confidence, tier flags).
