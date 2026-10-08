# `experiments/earth-playground/earth/setup/post-setup.ts`

Post-processing chain for the Earth engine: color-grading,

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/setup/post-setup.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

earths post deps.

### `seedPostState`

Seeds the color-grade + post FX state objects and their TSL uniforms.

### `buildEarthPostPipeline`

Assembles the RenderPipeline post chain (screen-space, in order):
  scene → CA fringe → +bloom → color grade → vignette → film grain
CA is applied before bloom so the halo isn't itself fringed.
