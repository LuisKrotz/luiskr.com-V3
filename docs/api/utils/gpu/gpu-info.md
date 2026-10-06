# `utils/gpu/gpu-info.ts`

Shared GPU capability detection + WebGL context-option hints.

| | |
|---|---|
| **Source** | `src/utils/gpu/gpu-info.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `getGPUInfo`

Detects GPU capabilities once and caches the result.
- `@returns` {{renderer: string, dedicated: boolean, apple: boolean, integrated: boolean, software: boolean, mobile: boolean, capable: boolean}}

### `glContextOptions`

Builds WebGL context attributes with the correct `powerPreference` hint
for this device. Callers merge their rendering-specific flags on top.
- `@param` {object} overrides
- `@returns` {object}
