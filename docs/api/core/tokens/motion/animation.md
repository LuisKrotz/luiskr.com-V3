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

Frozen animation map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `ROUTE_DURATION`

Route transition duration (ms)

### `PAGE_FADE_HALF`

Half-duration of the view cross-fade (ms) — fade-out leg, then fade-in

### `PROGRESS_BAR_RESET`

Delay before the progress bar's --done class is removed (ms) — must
outlast the CSS sweep-to-100% (0.3s) + delayed fade-out (0.3s delay +
0.4s fade) so the transform reset happens while the bar is invisible.

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

### `LOADER_FADE_MS`

Space-playground loader fade-out before the node is removed (ms) — must match the CSS opacity transition

### `SCROLL_DURATION`

Default smooth-scroll animation length (ms) — long enough to read the ease, short enough to not feel laggy

### `SCROLL_MIN_DISTANCE`

Minimum scroll distance (px) below which the animation is skipped — sub-2px moves are invisible and would only churn frames
