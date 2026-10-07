# `playground/earth/setup/post-setup.ts`

Post-processing chain for the Earth engine: color-grading,

| | |
|---|---|
| **Source** | `src/playground/earth/setup/post-setup.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

### (module scope)

earths post deps.

### `seedPostState`

Seeds the color-grade + post FX state objects and their TSL uniforms.

### `buildEarthPostPipeline`

Assembles the RenderPipeline post chain (screen-space, in order):
  scene → CA fringe → +bloom → color grade → vignette → film grain
CA is applied before bloom so the halo isn't itself fringed.
