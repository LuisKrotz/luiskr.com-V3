# `core/utils/canvas/loaders/skeleton/loop.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/loaders/skeleton/loop.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

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
