# `utils/canvas/webgl-pool.ts`

Lifecycle pool for the shared WebGL contexts: registers

| | |
|---|---|
| **Source** | `src/utils/canvas/webgl-pool.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### (module scope)

Widget contract the pool drives on visibility flips.

### `WebGLPoolManager`

WebGL VRAM Lifecycle & Texture Pool Manager

Automatically monitors registered WebGL canvases with an IntersectionObserver.
- Purges GPU textures & buffers and halts render loops when off-screen.
- Seamlessly restores textures & buffers and resumes render loops when visible.
- Provides compressed texture format detection for VRAM footprint reduction.

### `initObserver`

Creates the offscreen-detection IntersectionObserver.

### `register`

Associates a widget instance with its canvas for purge/restore.

### `unregister`

Removes an element from pool management.

### `getSupportedCompression`

Queries the context's compressed-texture format support.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.
