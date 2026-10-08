# `core/utils/canvas/loaders/skeleton/renderer.ts`

Shared WebGL shimmer renderer for skeleton layers,

| | |
|---|---|
| **Source** | `src/core/utils/canvas/loaders/skeleton/renderer.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SkeletonRenderer`

Single shared WebGL context for every skeleton layer on the page. Layers
own a cheap 2D canvas; each frame is drawn on the shared GL canvas (grown
to the largest live layer, never reallocated per frame) and blitted over.
Released when the last layer is destroyed, recreated on demand.

### `gl`

The shared GL context — null before init, after loss, or after dispose.

### `canvas`

The offscreen GL canvas frames are drawn on (grown to the largest layer).

### `program`

Compiled shimmer program (SKELETON_VS/SKELETON_FS).

### `quadBuffer`

Quad vertex buffer bound for every draw.

### `u`

Resolved uniform locations keyed by logical name.

### `refs`

Live borrowers — the context is disposed when this reaches zero.

### `lost`

Sticky "context is gone" flag — acquire() stops retrying after loss.

### `acquire`

Borrows (and lazily creates) the shared GL context. Refcount +1 on
success; a failed init hands the ref back so the count still reaches
zero and disposal stays reachable. Returns null when GL is
unavailable/lost — the layer keeps its CSS fallback.

### `release`

Returns the shared context to the pool, disposing at refcount zero —
the last layer dropping out frees the GL context entirely (browsers
cap ~16 live contexts).

### `_init`

Creates the shared canvas + GL context, wires context-loss handling,
and compiles the shimmer program. Aborts (leaving `gl` null) when the
context can't be created, is software-rendered, or the shaders fail —
each failure self-releases the context so nothing leaks.

### `_isSoftwareRenderer`

Detects CPU rasterizers (SwiftShader/llvmpipe) via the unmasked
renderer string — software GL pays per-frame CPU cost, so those take
the CSS fallback instead.
- `@param` gl The just-acquired context.
- `@returns` true when the renderer matches SKELETON_WARN.SOFTWARE_RENDERERS.

### `_dispose`

Frees the GL program + quad buffer and force-loses the context so the
browser's context budget is returned immediately (deleteProgram alone
leaves the context alive). Resets `lost` so a later acquire can retry
on a fresh canvas.

### `draw`

Renders one shimmer frame for a skeleton layer on the shared offscreen
canvas at time t, then blits the result onto the layer's own canvas —
`resolve` ∈ [0,1] cross-fades the shimmer into the "decoded" look.
The shared canvas only ever grows (never shrinks), so per-frame draws
don't thrash GPU allocations; the scissor box limits the draw to the
layer's w×h corner (GL origin is bottom-left — hence the
canvas.height−h blit offset).
- `@param` layer The skeleton layer requesting the frame.
- `@param` t Animation clock in seconds — feeds u_time.
- `@param` resolve Content-arrival cross-fade 0→1.
- `@returns` false when GL/layer canvas is missing (caller skips the frame).

### `_initProgram`

Compiles the shimmer shaders and resolves every uniform location up
front — getUniformLocation during draw would cost a driver round-trip
per frame. A compile/link failure returns false so _init can release
the context instead of leaving a broken half-pipeline.
- `@param` gl The live shared context.
- `@returns` true when the program is bound and uniforms resolved.

### `skeletonRenderer`

Shared renderer singleton — every skeleton layer borrows this one
context via acquire()/release() so the page never holds more than one
shimmer pipeline regardless of how many skeletons mount.
