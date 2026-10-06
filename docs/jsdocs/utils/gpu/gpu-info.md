# `utils/gpu/gpu-info.ts`

Shared GPU capability detection + WebGL context-option hints.

| | |
|---|---|
| **Source** | `src/utils/gpu/gpu-info.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### (module scope)

The GPUInfo value.

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
