# `utils/canvas/skeleton/loop.ts`

| | |
|---|---|
| **Source** | `src/utils/canvas/skeleton/loop.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `upload`

Uploads the latest geometry + theme to shader uniforms.

### `loop`

rAF callback — animates the shimmer until resolved.

### `render`

Renders a frame via the shared renderer.

### `resolve`

Content has arrived: fades the real content in, plays the shimmer
resolve-out animation, then tears down and releases the shared GL
context back to the pool.
