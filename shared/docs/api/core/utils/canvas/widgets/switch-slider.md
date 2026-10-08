# `core/utils/canvas/widgets/switch-slider.ts`

WebGL toggle switch for preferences/stats contexts: a pill

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/switch-slider.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SwitchWebGL`

Contextual WebGL Switch Slider for Developer Tools
Renders custom animated graphical draw elements referent to each toggle's context:
- 'stats': Live ECG oscilloscope waveform + pulsing chip matrix (Stats for Nerds)
- 'grid': Glowing blueprint column grid lines + scanning crosshairs (Show Grid)
- 'motion': Subtle ambient drift (OFF) vs calm still horizon datum (ON) (Reduced Motion)
All switches share an identical solid centered knob indicator dot.

### `_pToKnobX`

Progress 0–1 → knob pixel X. The knob (radius 11) is inset 14px from
each end — exactly half the 28px track height — so it sits centered
inside the capsule's rounded caps at both extremes.
- `@param` {number} p
- `@returns` {number} CSS px

### `_contextCode`

Context → shader's u_context float id (0=stats, 1=grid/cyan/space,
2=motion). The fragment shader branches on ranges (<0.5, <1.5, else)
so several visual aliases can share the grid animation.
- `@returns` {number}

### `init`

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

### `_triggerFallback`

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

### `initWebGL`

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.

### `bindEvents`

Wires pointer/hover listeners that drive the widget's interactive state.

### `toggle`

Flips the switch and fires the onToggle callback.

### `setActive`

Sets the knob position programmatically (animates the slide).

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

Per-frame Canvas2D fallback render — same visual language as the shader.

### `purge`

webglPool hook — offscreen: stops the loop (GL or 2D) and force-loses
the GL context so offscreen widgets hold no context slots; restore()
rebuilds the GL program or re-acquires the 2D context on re-entry.

### `restore`

Recreates the GL context + program (or the 2D fallback) and resumes the loop after a purge.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.
