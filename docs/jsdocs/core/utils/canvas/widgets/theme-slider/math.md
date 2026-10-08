# `core/utils/canvas/widgets/theme-slider/math.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/theme-slider/math.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `KNOB_INSET`

Knob travel inset — the knob radius, so it never overhangs the capsule ends.

### `DRAG_MIN_RATIO`

Drag band edges — middle 76% of the canvas is active (12%–88%).

### `themeToP`

THEME → normalized track position (integer stops; fractions only mid-animation).

### `pToTheme`

Maps a normalized track position back to the nearest THEME value.

### `pToKnobX`

Normalized position → knob pixel X inside the track. The knob is
inset 32px from each capsule end (≈ its own radius) so it never
overhangs the rounded border; p/2 maps 0–2 → 0–1 of that inset span.

### `xToContinuousP`

Pointer pixel X → continuous (unclamped-drag) normalized position.
The active band is the middle 76% of the canvas (12%–88%) — the
capsule's rounded ends are dead zone so a tap near the very edge
still snaps to the outermost stop instead of overshooting.

### `xToP`

Pointer pixel X → normalized position using the fixed 32px insets
(same span as pToKnobX). Retained for non-drag hit paths.
