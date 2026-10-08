# `core/utils/gpu/gpu-info.ts`

Shared GPU capability detection + WebGL context-option hints.

| | |
|---|---|
| **Source** | `src/core/utils/gpu/gpu-info.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Classified GPU probe result — frozen so consumers can't mutate the cache.

### `renderer`

Unmasked renderer string ('ANGLE (NVIDIA…)', 'Apple M1', 'SwiftShader', …).

### `dedicated`

Discrete-card class detected (NVIDIA/AMD/Radeon Pro).

### `apple`

Apple Silicon detected — unified memory but GPU-class performance.

### `integrated`

Integrated GPU detected (Intel UHD/Iris, basic ANGLE adapters).

### `software`

Software rasterizer (SwiftShader/llvmpipe) — GPU work falls back to CSS.

### `mobile`

Mobile-class user agent — deprioritizes GPU pinning regardless of chip.

### `capable`

Worth pinning GPU work to — desktop discrete or Apple Silicon.

### `_probeRenderer`

Reads the real GPU renderer string via WEBGL_debug_renderer_info —
tries WebGL2 then WebGL1, preferring the unmasked constants so the result
identifies the actual adapter instead of the vendor redaction string.
- `@returns` {string} the renderer description, or "" when GPU probing is impossible

### `getGPUInfo`

Detects GPU capabilities once and caches the result.
- `@returns` {{renderer: string, dedicated: boolean, apple: boolean, integrated: boolean, software: boolean, mobile: boolean, capable: boolean}}

### `glContextOptions`

Builds WebGL context attributes with the correct `powerPreference` hint
for this device. Callers merge their rendering-specific flags on top.
- `@param` {object} overrides
- `@returns` {object}
