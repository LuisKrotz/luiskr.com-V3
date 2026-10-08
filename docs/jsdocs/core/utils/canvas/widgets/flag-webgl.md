# `core/utils/canvas/widgets/flag-webgl.ts`

WebGL flag renderer for the language dialog: draws each

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/flag-webgl.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `FlagWebGL`

WebGL Flag Animator for Language Selection Buttons
Each flag has a completely unique animated kinetic effect and wave physics:
- EN (0): Star-spangled waving ripple with specular stars sparkle
- PT (1): Solar burst pulse radiating from rhombus with Southern Cross constellation twinkle
- ES (2): Warm flamenco silk wave with golden crest glow
- DE (3): Swiss cross kinetic pulse transitioning into German horizontal ribbon wave
- HRK (4): Harmonic dual-wave blending German tricolor and Brazilian tropical pulse
- CAS (5): Sol de Mayo radiant solar rays pulsing across Argentine & Uruguayan sky-blue stripes
- RIV (6): Border river ripple reflecting the Uruguayan sun into Brazilian green-gold canopy
- GN (7): Tricolor horizontal fluid wave with national seal star glow
- IT (8): Mediterranean silk flutter with delicate cloth folds
- RU (9): Northern lights aurora borealis shimmer waving across the stripes
- FR (10): Revolutionary vertical tricolor ripple with satin sheen
- TLN (11): Venetian gondola water reflection merging Italian and Brazilian tones

### (module scope)

Display aspect of the whole canvas. A split flag shows the left half of
the first flag and the right half of the second, each at natural scale,
so its width is the mean of both natural widths.

### `_splitPoint`

Normalized 0–1 x where a hybrid flag's two halves meet: the first
flag's share of the combined aspect widths (aspect1/(aspect1+aspect2))
so each half keeps its natural proportions instead of stretching 50/50.
- `@returns` {number}

### `_resizeToNaturalAspect`

Sizes the canvas to the flag's natural aspect ratio.

### `_getAnimType`

Picks the shader's animation mode (wave / gentle ripple / static).

### `init`

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

### `purge`

webglPool hook — offscreen: stops the loop and releases the shared
renderer reference so the pooled GL context can be disposed once
every flag is out of view (or destroyed).

### `restore`

Re-acquires the shared renderer and resumes the wave loop after a purge.

### `_triggerFallback`

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

### `loadImages`

Loads the flag's SVG source(s) into the texture cache.

### `bindEvents`

Wires pointer/hover listeners that drive the widget's interactive state.

### `setHover`

Updates hover state — the shader renders the hover accent when true.

### (module scope)

Called when the reduced-motion preference changes.
Restarts the animation loop if motion is now allowed,
or renders a final static frame when entering reduced mode.

### (module scope)

Render a single static frame of the flag (no waving).
Used when reduced-motion is active so the flag remains visible.

### `animate`

Starts the requestAnimationFrame render loop (skipped under reduced motion).

### `_renderWebGL`

Per-frame WebGL render: updates time/hover uniforms and draws the quad.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.
