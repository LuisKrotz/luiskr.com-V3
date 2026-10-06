# `playground/earth/renderer-setup.ts`

Renderer creation for the Earth engine: probes for a

| | |
|---|---|
| **Source** | `src/playground/earth/renderer-setup.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

### (module scope)

Builds + initializes the renderer on `s`. Probes WebGPU first; a failed
init swaps in a fresh canvas clone (a canvas that failed context
creation is poisoned) and retries with forceWebGL.
