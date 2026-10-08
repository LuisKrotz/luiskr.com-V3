# `core/utils/canvas/widgets/close-button.ts`

WebGL animated circular close (X) button used by the expand

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/close-button.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `CloseButtonWebGL`

WebGL Animated Close Button
Features:
- Liquid fills slower and procedural rising bubbles with specular highlights
- Rotating X during hover/liquid animation
- Razor-sharp vector anti-aliased X line strokes (zero blur)
- Kinetic shockwave ripple on click
- Resilient Canvas 2D fallback

### `constructor`

- `@param` canvas - overlay canvas inside the host
- `@param` onClickAction - forwarded after each click (the

### `init`

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

### `initWebGL`

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.

### `bindEvents`

Wires hover + click on the parent button (not the canvas) — the canvas
is a decorative overlay so interaction belongs to the semantic button.
boundTarget is remembered for destroy().

### `setHover`

Updates hover state — the shader renders the hover accent when true.

### `triggerClick`

Records the click timestamp — the shader reads u_click_time to expand
the shockwave ring over its 0.4s window. The onClickAction callback is
invoked separately by the click handler, not here.

### `setReducedMotion`

Applies prefers-reduced-motion: swaps the animation loop for one
static frame render, or restarts the loop when motion is re-allowed.

### `_renderStatic`

Draws one settled frame with the X fully drawn — used under reduced
motion or when the loop is stopped.

### `animate`

Starts the requestAnimationFrame render loop (skipped under reduced motion).

### `_renderWebGL`

Per-frame WebGL render: updates time/hover uniforms and draws the quad.

### `purge`

webglPool hook — offscreen: stops the loop and force-loses the GL
context so offscreen widgets hold no context slots; restore()
rebuilds the program on re-entry.

### `restore`

Recreates the GL context + program and resumes the loop after a purge.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.
