# `utils/gpu/npu-predict.ts`

Hardware-tiered prefetch predictor: scores navigation

| | |
|---|---|
| **Source** | `src/utils/gpu/npu-predict.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### (module scope)

Minimal WebNN surface used by this predictor (navigator.ml).

### (module scope)

The PredictionResult value.

### (module scope)

The NpuAnalytics value.

### `NPUPredictor`

Predictive input engine — tracks pointer velocity and predicts where the
pointer will be a frame ahead, so hover/prefetch work can start before
the pointer arrives. Uses WebNN (NPU) when available, else a JS linear
predictor on GPU-less devices.

### `initHardware`

Probes the execution tiers in order: WebNN NPU context, then the shared
GPU accelerator's GL context, then the WASM pool (always available).
Starts the pointer-velocity tracker afterwards.

### `bindInteractionListeners`

Tracks pointer velocity (px/ms) on window — a high-velocity gesture past a link means less intent to click it.

### `gpuAvailable`

Reports whether the shared accelerator owns a live WebGL context. The
predictor initializes before most media surfaces, so its original probe
can legitimately run before `gpuAccel` becomes active; checking the
shared context dynamically prevents that startup race from permanently
reporting the desktop GPU as unavailable.

### `predictTargetLikelihood`

Scores how likely the user is to navigate to targetUrl (0–1).
Already-preloaded targets short-circuit at 1.0. Above 0.60 the route
asset is prefetched automatically.

### `preloadRouteAsset`

Injects a <link rel="prefetch"> for the route asset (deduped by preloadedTargets).

### `getNpuAnalytics`

Metrics snapshot for the stats HUD (prediction counts, confidence, tier flags).

### `npuPredict`

The npuPredict constant.
