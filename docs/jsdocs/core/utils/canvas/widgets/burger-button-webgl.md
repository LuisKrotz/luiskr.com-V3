# `core/utils/canvas/widgets/burger-button-webgl.ts`

WebGL hamburger icon for the nav burger button: three

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/burger-button-webgl.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `BurgerButtonWebGL`

WebGL animated hamburger icon for the mobile burger button.
Renders three sleek horizontal lines with rounded pill caps and subtle wave animation.
Adapts to the current theme: dark icon in light mode, bright icon in dark mode.

### `canvas`

- `@param` {HTMLCanvasElement} canvas - icon canvas inside the nav burger button
- `@param` {Function} onClick - optional click handler (the canvas becomes

### `_initGL`

Creates the WebGL context + shader program; falls back to the CSS/DOM path on failure.

### `_triggerFallback`

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

### `_checkResize`

Re-syncs the drawing buffer to the canvas's CSS box × devicePixelRatio
(capped at 2). Only reallocates when the rounded size actually changed,
and repaints one frame immediately when the RAF loop isn't running —
in reduced-motion static mode a resize would otherwise leave the
cleared buffer blank until the next state change.

### `_start`

Chooses reduced-motion static render vs the rAF loop.

### `_drawFrame`

Renders one frame at time t (seconds) — shared by the RAF loop and the
static reduced-motion path. u_dark is re-evaluated per frame from the
live DOM classes (dark theme OR nav-on-dark over the contact band) so
the icon recolors instantly on theme/scroll changes with no listener.
- `@param` {number} t - seconds since construction

### `_loop`

rAF callback — repaints each frame while running.

### `purge`

webglPool hook — offscreen: stops the loop and releases the GL
context entirely; restore() rebuilds it on re-entry so offscreen
widgets never hold context slots.

### `restore`

Recreates the GL context and resumes the loop after an offscreen purge.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.
