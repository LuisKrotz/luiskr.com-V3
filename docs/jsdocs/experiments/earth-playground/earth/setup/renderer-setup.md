# `experiments/earth-playground/earth/setup/renderer-setup.ts`

Renderer creation for the Earth engine: probes for a

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/setup/renderer-setup.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Builds + initializes the renderer on `s`. Probes WebGPU first; a failed
init swaps in a fresh canvas clone (a canvas that failed context
creation is poisoned) and retries with forceWebGL.
