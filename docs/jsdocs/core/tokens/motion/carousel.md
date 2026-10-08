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

### `NAVIGATION_SETTLE_DELAY`

Window (ms) scroll-handler teleports stay suppressed after a programmatic nav — just under TELEPORT_DELAY so a wrap scroll can finish before scroll events re-arm

### `SCROLL_DEBOUNCE_MS`

Scroll-event debounce (ms) before the clone-teleport detector runs — scroll fires per pixel, the check only matters at rest

### `RING_REGRESS_STEP`

ringProgress drained per RAF frame when autoplay stops (0–1 scale) — ~25 frames ≈ 0.4s unwind

### `CAROUSEL_LAYOUT`

Frozen carousel map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

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

### `CENTER_EPS_PX`

px tolerance for "slide center ≈ track center" in the clone-teleport detector — loose enough for sub-pixel scroll stops, tight enough not to fire mid-swipe

### `VISIBILITY_RATIO`

IntersectionObserver ratio that counts as "visible enough" to autoplay (15%)

### `FIT_EPS_PX`

px delta below which ResizeObserver width reports are ignored — sub-pixel RO noise must not trigger a re-fit storm

### `ITEM_GAP_PX`

Approx flex gap (px) added per item in the side-by-side width projection

### `MEDIA_MIN_WIDTH`

Minimum slide media width (px) — tall media floor so a fixed strip height never yields slivers; mirrors min-width in media-figure.scss

### `MEDIA_MIN_WIDTH_VW`

Viewport width below which the media min-width floor is dropped — on sub-375px screens the floor would push media past the edges

### `ITEM_MARGIN_PX`

Outer margin (px) applied to each slide item on desktop — media keeps padding + this margin of clearance on each side

### `ITEM_MARGIN_VW`

Viewport width at which the slide side margin kicks in — mirrors layout-1024 in carousel-host.scss / internals.scss

### `STRIP_H_1024`

Strip height ladder (px) — mirrors --mf-h breakpoints in carousel-host.scss: below 1024 it is 70dvh minus a breakpoint pad, at/above these widths it is a fixed $space-* value

### `STRIP_SUB_MOBILE`

px subtracted from 70dvh for the sub-1024 strip heights — mirrors --mf-h's calc() at <768 / ≥768

### `ITEM_PAD_DEFAULT`

Horizontal item padding (both sides, px) per breakpoint — mirrors .internal-extra-item padding-inline ladder

### `REG_CAP_SUB`

px subtracted from the viewport for the regular-item desktop width cap — mirrors the --mf-max-w gutter fallback (2×space-3xl + 2×margin)

### `LAND_CAP_SUB_1024`

px subtracted from the viewport for landscape-item width caps — mirrors the landscape --mf-max-w ladder

### `MAX_HEIGHT_FALLBACK`

Max slide height (px) used when window.innerHeight is unavailable (SSR/tests)

### `CAROUSEL_LOADING`

Frozen carousel map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `EAGER_COUNT`

Carousels rendered synchronously with the page (the ones that can be in the first viewport)

### `BATCH_SIZE`

Below-the-fold carousels are rendered this many at a time in idle periods

### `DEFERRED_TIMEOUT`

Upper bound before a deferred batch runs anyway (ms)
