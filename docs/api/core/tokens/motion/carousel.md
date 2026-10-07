# `core/tokens/motion/carousel.ts`

Carousel timing/geometry tokens — grouped subsets of

| | |
|---|---|
| **Source** | `src/core/tokens/motion/carousel.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `AUTOPLAY_DURATION`

Autoplay interval in milliseconds before advancing to next slide

### `TELEPORT_DELAY`

Teleport animation duration (ms) — must match CSS transition

### `CAROUSEL_LAYOUT`

The CAROUSEL_LAYOUT constant.

### `CIRCUMFERENCE`

SVG countdown ring circumference: 2π × r (r=19)

### `MOBILE_BREAKPOINT`

Viewport width below which mobile behaviour applies

### `SIDE_BY_SIDE_BREAKPOINT`

Minimum viewport width for the ≤2-item side-by-side (non-carousel) layout

### `SWIPE_THRESHOLD`

Minimum swipe distance (px) required to trigger a slide change

### `MAX_HEIGHT_VH`

Slide height cap as a fraction of the viewport height

### `SKELETON_ITEM_HEIGHT`

Skeleton sections reserve the same capped height so content loads without shifting

### `CAROUSEL_LOADING`

The CAROUSEL_LOADING constant.

### `EAGER_COUNT`

Carousels rendered synchronously with the page (the ones that can be in the first viewport)

### `BATCH_SIZE`

Below-the-fold carousels are rendered this many at a time in idle periods

### `DEFERRED_TIMEOUT`

Upper bound before a deferred batch runs anyway (ms)
