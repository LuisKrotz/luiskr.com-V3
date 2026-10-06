# `components/carousel/custom-carousel/autoplay.ts`

Autoplay/progress-ring engine for &lt;custom-carousel&gt;,

| | |
|---|---|
| **Source** | `src/components/carousel/custom-carousel/autoplay.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### (module scope)

Slice of CarouselArrowWebGL the autoplay engine drives.

### (module scope)

Host surface the autoplay engine needs (satisfied by CustomCarousel).

### `startCarouselAutoplay`

Starts the autoplay RAF loop unless latched off or already running.

### `stopCarouselAutoplay`

Stops autoplay and drains the progress ring. `permanently` latches
_autoplayPermanentlyStopped — every user-initiated navigation
(arrow/dot/swipe/hover) passes true so the carousel never auto-plays
again on this page; visibility/modal stops pass false and may resume.

### `regressRingToZero`

Drains ringProgress to 0 at −4%/frame instead of snapping — the ring
visibly unwinds when autoplay stops, matching the "paused" affordance.
autoplayElapsed stays proportional so a resume continues the cycle.

### `tickCarouselAutoplay`

Autoplay RAF tick: elapsed/duration → ringProgress 0–1 → paint →
advance when the cycle completes, then rebase the clock for the next
slide. The ring resets before goTo so the new slide starts empty.

### `updateCarouselRingDom`

Pushes progress into the DOM: the SVG ring's stroke-dashoffset (full
circumference = empty, 0 = full circle) and the WebGL arrows' arc.
