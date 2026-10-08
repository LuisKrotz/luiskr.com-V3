# `core/utils/canvas/widgets/close-button/init.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/close-button/init.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `FALLBACK_SIZE`

Design dimension of the expand-modal close button (px).

### `MIN_MEASURED`

Min measured size before a rect counts as "laid out".

### `RESIZE_EPS`

Width deltas below this are sub-pixel noise — skip the re-size.

### `cappedDpr`

Backing-store DPR cap — the shader's AA bands need ≤2×, not more.

### `applyBackingStore`

Applies the DPR-scaled backing-store size for the current CSS size.

### `observeResize`

Re-measures + re-sizes the backing store when the host box changes.

### `onContextLost`

Context-loss → CSS ::before/::after X strokes on the parent button.

### `init`

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

### `initWebGL`

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.
