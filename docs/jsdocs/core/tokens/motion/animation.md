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

### `ANIMATION_DURATIONS`

The ANIMATION_DURATIONS constant.

### `ROUTE_DURATION`

Route transition duration (ms)

### `MOSAIC_DURATION`

Mosaic expand/collapse transition duration (ms)

### `CAROUSEL_FADE_DURATION`

Carousel fade-in transition duration (ms)

### `MENU_CLOSE_DURATION`

Menu modal close/fade-out duration (ms) — must cover the 1.1s shader dissolve + 0.9s modal fade

### `MENU_SETTLE_DURATION`

Menu modal entrance settle time (ms) — longest item delay (0.76s) + item duration (1.3s)

### `DIALOG_LEAVE_DURATION`

Dialog genie zoom-out duration (ms) — must match .pref-backdrop--leave transition
