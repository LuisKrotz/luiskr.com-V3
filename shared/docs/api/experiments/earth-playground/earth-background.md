# `experiments/earth-playground/earth-background.ts`

Three.js WebGPU Earth background engine.

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth-background.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `EarthBackground`

Owns the full WebGPU/WebGL Earth scene: renderer, camera rig, sun+moon
lighting, the textured Earth group (surface/clouds/atmosphere shells), and
the TSL post-processing pipeline (bloom → chromatic aberration → color
grade → vignette → film grain).

### `#s`

All mutable engine state — see earth/state.ts.

### `setReducedMotion`

Pause/resume the render loop for prefers-reduced-motion. The last frame
stays on screen (preserveDrawingBuffer), so pausing never blanks the
background — motion just stops.

### `setTheme`

Store the UI theme for the sun-rotation theme feature (not yet wired
into the scene — kept as public API for the playground controls).

### `setVisible`

Show/hide the canvas and stop the loop while hidden — the playground
page is the only consumer, so hiding releases GPU work entirely.

### `takeScreenshot`

Renders one frame at 2× resolutionScale and downloads it as PNG.
Temporarily bumps pixel ratio → resize → render → capture → restore,
so the saved image is sharper than the live viewport.

### `destroy`

Tears down the engine: stops RAF, unbinds resize, releases the
renderer's GPU context and the controls' DOM listeners. Idempotent —
safe to call while bootstrap awaits are still in flight (they check
disposed after each await and bail).

### `settings`

Snapshot of every tunable, shaped exactly like DEFAULT_SP_GUI so the
playground control panel can render sliders without knowing which
values are live uniforms vs build-time constants.
- `@returns` {object} settings tree keyed like DEFAULT_SP_GUI

### `getCameraState`

Current camera position + orbit target, rounded to 2 decimals — used
to persist/restore the view in the playground's settings snapshot.

### `resetView`

Restore the default framing: OrbitControls.reset() replays saveState()
(captured at bootstrap), then fov/position/target are pinned to
DEFAULT_SP_GUI.CAMERA in case the saved state drifted.
