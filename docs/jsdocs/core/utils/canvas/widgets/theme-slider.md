# `core/utils/canvas/widgets/theme-slider.ts`

WebGL three-position theme slider (light / system / dark)

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/theme-slider.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `ThemeSliderWebGL`

Full Animated Day/Night/System Theme Slider
Powered by WebGL with robust Canvas 2D fallback.
Uses normalized aspect coordinates (range 0.0 to 3.33) to prevent GPU float overflow on all platforms.
Position 0: Dark (Night - Lunar moon with craters, twinkling stars, starry canyon mesas)
Position 1: System (Twilight - Balanced orb, sun rings rising on left, crescent on right)
Position 2: Light (Day - Sun knob on right, peach/coral sky, radiant sun on left)

### `_themeToP`

THEME → normalized track position. Positions are the integer stops
0/1/2 — fractional values only exist mid-animation.

### `_pToTheme`

Maps a normalized track position back to the nearest THEME value.

### `_pToKnobX`

Normalized position → knob pixel X inside the track — see
theme-slider-math.ts for the inset geometry.

### `init`

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

### `_triggerFallback`

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

### `initWebGL`

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.

### `bindEvents`

Wires pointer drag + tap-to-snap; supports keyboard arrows for a11y.

### `_xToContinuousP`

Pointer pixel X → continuous (unclamped-drag) normalized position —
see theme-slider-math.ts for the 12%–88% active band.

### `_xToP`

Pointer pixel X → normalized position using the fixed 32px insets
(same span as _pToKnobX). Retained for non-drag hit paths.

### `setTheme`

Moves the knob to the given theme's stop (spring-animated).

### `setReducedMotion`

Applies prefers-reduced-motion: swaps the animation loop for one
static frame render, or restarts the loop when motion is re-allowed.
- `@param` {boolean} isReduced

### `_renderStatic`

Snap state to target and draw a single settled frame — used under
reduced motion or when the loop is stopped.

### `animate`

Starts the requestAnimationFrame render loop (skipped under reduced motion).

### `_renderWebGL`

Per-frame WebGL render: updates time/knob uniforms and draws the quad.

### `_renderCanvas2D`

Canvas2D fallback renderer — dormant defensive code; the real
fallback hides the canvas and activates the CSS/DOM fallback
(see theme-slider-init.ts triggerFallback).

### `purge`

webglPool hook — offscreen: stops the loop and force-loses the GL
context so offscreen widgets hold no context slots; restore()
rebuilds the program on re-entry.

### `restore`

Recreates the GL context + program and resumes the loop after a purge.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.
