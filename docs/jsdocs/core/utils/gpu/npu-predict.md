# `core/utils/gpu/npu-predict.ts`

Hardware-tiered prefetch predictor: scores navigation

| | |
|---|---|
| **Source** | `src/core/utils/gpu/npu-predict.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Minimal WebNN surface used by this predictor (navigator.ml).

### (module scope)

Outcome of one likelihood prediction.

### `probability`

Estimated navigation probability 0–1.

### (module scope)

true when the target was already prefetched.

### (module scope)

Which tier scored it — WebNN NPU.

### (module scope)

Which tier scored it — shared GPU.

### (module scope)

HUD-facing predictor metrics.

### `npuAccelerated`

Whether the WebNN NPU tier is live.

### `gpuAccelerated`

Whether the shared GPU tier is live.

### `wasmAccelerated`

Whether the WASM worker tier is live (always true — the last resort).

### `totalPredictions`

Lifetime prediction count.

### `successfulPreloads`

Successful prefetch injections.

### `lastPredictionConfidence`

Most recent probability, rounded to cents.

### `avgComputeMs`

Exponential-ish running mean of scoring time in ms.

### (module scope)

One pointer event sample for the velocity estimate.

### (module scope)

Pointer velocity in px/ms on each axis.

### `NPUPredictor`

Predictive input engine — tracks pointer velocity and predicts where the
pointer will be a frame ahead, so hover/prefetch work can start before
the pointer arrives. Uses WebNN (NPU) when available, else a JS linear
predictor on GPU-less devices.

### `hasNPU`

WebNN NPU context acquired — highest compute tier.

### `hasGPU`

Shared GPU accelerator live — middle tier.

### `mlContext`

The WebNN MLContext (kept opaque — only presence is tested).

### `preloadedTargets`

URLs already prefetched — dedupes repeat predictions and link tags.

### `interactionHistory`

Rolling pointer samples (reserved for trajectory shape analysis).

### `lastPointer`

Previous pointer position+stamp for the velocity delta.

### `pointerVelocity`

Latest px/ms velocity vector.

### `analytics`

Rolling metrics exposed to the stats HUD.

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
Already-preloaded targets short-circuit at 1.0. Above
PREFETCH_THRESHOLD the route asset is prefetched automatically.

Scoring blend per tier: base + hoverNorm·W + (1−speedNorm)·W — a
deliberate, slow, dwelt-on hover scores high; a fast flyby stays low.
The WASM tier asks the worker for a spring-physics position over the
same inputs and normalizes it onto 0–1 so all tiers emit comparable
probabilities.
- `@param` targetUrl Candidate route URL.
- `@param` _targetEl The hovered element (reserved for hit-testing).
- `@param` hoverTimeMs How long the pointer has dwelled on the target.
- `@returns` The probability + which tier computed it.

### `preloadRouteAsset`

Injects a <link rel="prefetch"> for the route asset — the browser
caches it at low priority so the next navigation hits warm HTTP
cache. Deduped by preloadedTargets.
- `@param` targetUrl Route URL to prefetch.

### `preloadMediaGPU`

Preloads an image/media texture into GPU VRAM via the WASM worker path.
Decoding happens off-main-thread and the resulting ImageBitmap is
uploaded zero-copy — no main-thread Image() element, no decode jank.
- `@param` src Media URL.
- `@param` width Decode/resize hint width.
- `@param` height Decode/resize hint height.

### `getNpuAnalytics`

Metrics snapshot for the stats HUD (prediction counts, confidence,
tier flags) — gpuAccelerated is re-resolved live so a late-initialized
accelerator doesn't report permanently absent.
- `@returns` The analytics object + live tier flags + preload count.

### `npuPredict`

Shared predictor singleton — pointer tracking, preloaded-target dedup,
and analytics are global state; a second instance would double-listen
pointermove.
