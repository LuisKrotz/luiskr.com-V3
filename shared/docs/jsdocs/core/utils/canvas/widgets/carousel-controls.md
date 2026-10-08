# `core/utils/canvas/widgets/carousel-controls.ts`

WebGL control button for the awards carousel: a circular

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/carousel-controls.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `CarouselArrowWebGL`

WebGL Carousel Arrow Controls with Circular Loading Progress & Gestural Microinteractions
- Prev button: Swipe-left gesture (tablet card outline + hand pointing left + arrow) with expanding kinetic ripples
- Next button: Swipe-right gesture (tablet card outline + hand pointing right + forward kinetic arrow burst)
- Circular WebGL loading ring with glowing leading particle head synchronized to autoplay timer
- Normalized coordinate space [-1.0 .. 1.0] scaling to all screen sizes without clipping
- Full Canvas 2D fallback

### `init`

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

### `purge`

webglPool hook — viewport left: pauses the loop; GL stays warm (the pool owns context lifecycle).

### `restore`

webglPool hook — back in view: resumes the render loop; counterpart of purge().

### `_triggerFallback`

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

### (module scope)

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.

### `setHover`

Updates hover state — the shader renders the hover accent when true.

### `triggerClick`

Programmatic activation — runs the bound onAction.

### `setPlaying`

Morphs the icon between play and pause states.

### `setProgress`

Updates the progress ring's fill fraction (and syncs play state).

### (module scope)

Called when the reduced-motion preference changes.
Restarts the animation loop if motion is now allowed,
or renders a final static frame when entering reduced mode.

### (module scope)

Render a single static frame with the arrow visible.
Used when reduced-motion is active so controls remain visible.

### `animate`

Starts the requestAnimationFrame render loop (skipped under reduced motion).

### `_renderCanvas2D`

Per-frame Canvas2D fallback render — same visual language as the shader.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.
