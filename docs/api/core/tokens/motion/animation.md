# `core/tokens/motion/animation.ts`

Easing curve + transition duration tokens — grouped subsets

| | |
|---|---|
| **Source** | `src/core/tokens/motion/animation.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `EASING`

Smooth cubic-bezier used throughout the design system

### `PAGE_EASING`

Page transition easing

### `ROUTE_DURATION`

Route transition duration (ms)

### `MOSAIC_DURATION`

Mosaic expand/collapse transition duration (ms)

### `CAROUSEL_FADE_DURATION`

Carousel fade-in transition duration (ms)

### `MENU_CLOSE_DURATION`

Menu modal close/fade-out duration (ms) — must match --closing transition

### `MENU_SETTLE_DURATION`

Menu modal entrance settle time (ms) — longest item delay + duration

### `DIALOG_LEAVE_DURATION`

Dialog genie zoom-out duration (ms) — must match .pref-backdrop--leave transition

### `ANIMATION`

Composed view — backwards-compatible registry.
