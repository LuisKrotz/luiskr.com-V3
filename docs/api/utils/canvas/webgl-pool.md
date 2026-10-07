# `utils/canvas/webgl-pool.ts`

Lifecycle pool for the shared WebGL contexts: registers

| | |
|---|---|
| **Source** | `src/utils/canvas/webgl-pool.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### (module scope)

Widget contract the pool drives on visibility flips and recovery actions.

### `WebGLPoolManager`

WebGL VRAM Lifecycle & Texture Pool Manager

Automatically monitors registered WebGL canvases with an IntersectionObserver.
- Purges GPU textures & buffers and halts render loops when off-screen.
- Seamlessly restores textures & buffers and resumes render loops when visible.
- Provides compressed texture format detection for VRAM footprint reduction.

### `initObserver`

Creates the offscreen-detection IntersectionObserver.

### `initRecoverySignals`

Registers global actions that can coincide with a healthier rendering
context: user clicks/keys, browser history changes, and app modal opens.
One listener set serves every widget; retries are deferred until the
triggering action finishes mounting/updating its UI.

### `scheduleFallbackRetry`

Coalesces all actions in one turn into a single fallback retry pass.

### (module scope)

True when a visible registered widget is currently using its fallback.

### `retryFallbacks`

Retries visible fallback widgets when WebGL is preferred. Reduced motion
and the explicit debug fallback mode are authoritative and suppress all
recovery attempts.

### `register`

Associates a widget instance with its canvas for purge/restore/retry.

### `unregister`

Removes an element from pool management.

### `getSupportedCompression`

Queries the context's compressed-texture format support.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

### `webglPool`

The webglPool constant.
