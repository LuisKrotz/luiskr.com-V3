# `core/utils/canvas/widgets/flag/anim.ts`

Flag geometry + animation-mode mapping for FlagWebGL:

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/flag/anim.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `displayAspect`

Display aspect of the whole canvas. A split flag shows the left half of
the first flag and the right half of the second, each at natural scale,
so its width is the mean of both natural widths.
- `@returns` {number} natural aspect ratio the flag should display at.

### `splitPoint`

Normalized 0–1 x where a hybrid flag's two halves meet: the first
flag's share of the combined aspect widths (aspect1/(aspect1+aspect2))
so each half keeps its natural proportions instead of stretching 50/50.
- `@returns` {number}

### `resizeToNaturalAspect`

Sizes the canvas to the flag's natural aspect ratio.

### `getAnimType`

Picks the shader's animation mode (wave / gentle ripple / static).

### `FLAG_DISPLAY_ASPECT_DEFAULT`

flags display aspect default.
