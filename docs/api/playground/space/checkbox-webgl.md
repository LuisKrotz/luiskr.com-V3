# `playground/space/checkbox-webgl.ts`

Canvas checkbox widget for the playground controls panel.

| | |
|---|---|
| **Source** | `src/playground/space/checkbox-webgl.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

### `setChecked`

Sets the checked state (animates the transition).

### `init`

Sizes the backing store to 20 CSS px × devicePixelRatio (capped at 2× —
beyond that the extra pixels are invisible on a 20px control) and
acquires the 2D context. A failed context just leaves the box empty;
the label still communicates state.

### (module scope)

Animation loop with exponential-approach easing: each frame closes 22%
of the gap to the target (fast start, asymptotic landing — a cheap
spring feel without a physics solver). Settles within 0.005 → snaps to
target, draws once, and the loop exits — zero frames burned while idle.
pulseTime advances 0.04/frame ≈ one full sin() cycle every ~157 frames
(~2.6s at 60fps) for the glow breathing.

### (module scope)

Renders one frame of the checkbox HUD animation.

### `destroy`

Stops the loop and releases the canvas resources.
