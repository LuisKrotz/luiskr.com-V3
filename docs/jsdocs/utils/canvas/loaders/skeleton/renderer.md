# `utils/canvas/loaders/skeleton/renderer.ts`

Shared WebGL shimmer renderer for skeleton layers,

| | |
|---|---|
| **Source** | `src/utils/canvas/loaders/skeleton/renderer.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `SkeletonRenderer`

Single shared WebGL context for every skeleton layer on the page. Layers
own a cheap 2D canvas; each frame is drawn on the shared GL canvas (grown
to the largest live layer, never reallocated per frame) and blitted over.
Released when the last layer is destroyed, recreated on demand.

### `acquire`

Borrows (and lazily creates) the shared GL context.

### `release`

Returns the shared context to the pool, disposing at refcount zero.

### `_init`

Sizes the canvas over the host and binds the shared renderer.

### `_isSoftwareRenderer`

Detects CPU rasterizers (SwiftShader/llvmpipe) — those take the CSS fallback.

### `_dispose`

Frees GL program, textures and buffers.

### `draw`

Renders one shimmer frame for a skeleton layer on the shared offscreen
canvas at time t, then blits the result onto the layer's own canvas —
`resolve` ∈ [0,1] cross-fades the shimmer into the "decoded" look.

### `_initProgram`

Compiles the shimmer shaders + resolves uniforms.

### `skeletonRenderer`

The skeletonRenderer constant.
