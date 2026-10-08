# `core/utils/canvas/webgl-pool.ts`

Lifecycle pool for the shared WebGL contexts: registers

| | |
|---|---|
| **Source** | `src/core/utils/canvas/webgl-pool.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Widget contract the pool drives on visibility flips and recovery actions.

### (module scope)

Whether the widget currently renders via WebGL (false = CSS/2D fallback).

### (module scope)

Called when the canvas leaves the viewport — free GL resources + stop the loop.

### (module scope)

Called when the canvas re-enters the viewport — re-acquire + resume.

### (module scope)

Optional custom re-probe; when absent the pool runs purge+restore.

### (module scope)

One registered canvas: its widget + last-seen visibility flag.

### (module scope)

Compressed-texture extension handles keyed by format family (null = unsupported).

### `WebGLPoolManager`

WebGL VRAM Lifecycle & Texture Pool Manager

Automatically monitors registered WebGL canvases with an IntersectionObserver.
- Purges GPU textures & buffers and halts render loops when off-screen.
- Seamlessly restores textures & buffers and resumes render loops when visible.
- Provides compressed texture format detection for VRAM footprint reduction.

### (module scope)

Registered canvas → widget+visibility state.

### (module scope)

The shared IntersectionObserver driving purge/restore — null when unsupported.

### (module scope)

Coalescing latch — one scheduled retry pass per turn.

### (module scope)

One-shot latch so the global recovery listeners bind exactly once.

### (module scope)

Bound recovery handler — any user action schedules a fallback retry.

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
Registered entries start `isActive: true` — the observer's first
callback corrects it if the canvas mounted offscreen.
- `@param` element The canvas element to watch.
- `@param` instance The widget implementing the poolable contract.

### `unregister`

Removes an element from pool management — unobserves it and drops the
entry so a destroyed widget can't be resurrected by a queued callback.
- `@param` element The canvas element to release.

### `getSupportedCompression`

Queries the context's compressed-texture format support — probes each
family (incl. vendor-prefixed s3tc variants) so callers can pick the
smallest uploadable format. Nulls inside the result mean unsupported.
- `@param` gl A live GL context; null short-circuits to null.
- `@returns` Per-family extension handles, or null without a context.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

### `webglPool`

Shared pool singleton — one observer + one entry map governs every WebGL
canvas so purge/restore stays consistent and the context budget is global.
