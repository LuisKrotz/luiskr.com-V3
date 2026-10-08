# `website/components/carousel/custom-carousel/autoplay.ts`

Autoplay/progress-ring engine for &lt;custom-carousel&gt;,

| | |
|---|---|
| **Source** | `src/website/components/carousel/custom-carousel/autoplay.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Slice of CarouselArrowWebGL the autoplay engine drives.

### `setPlaying`

Toggles the arrow's playing affordance (ring visible vs idle).

### `setProgress`

Paints the 0–1 progress arc.

### (module scope)

Host surface the autoplay engine needs (satisfied by CustomCarousel).

### `autoplayRunning`

RAF cycle active flag.

### `autoplayStart`

performance.now() the current dwell cycle started at.

### `autoplayElapsed`

Accumulated ms into the cycle — survives pause→resume.

### `ringProgress`

0–1 fraction of the autoplay cycle — drives ring + arrow arc.

### `rafId`

RAF handle for cancellation.

### `currentIndex`

Logical slide index for goTo(+1) on cycle end.

### `circumference`

2πr of the SVG ring — dasharray/dashoffset base.

### `_autoplayPermanentlyStopped`

Latched by user interaction — blocks all autoplay resumes.

### `_isRegressing`

Ring regress animation in flight.

### `_prevArrow`

Prev/next arrow widgets (null until viewport entry mounts them).

### `goTo`

Navigate to slide idx (clone-wrap aware).

### `$$`

Shadow-scoped querySelectorAll.

### `startCarouselAutoplay`

Starts the autoplay RAF loop unless latched off or already running.
`autoplayStart` is backdated by `autoplayElapsed` so a pause→resume
continues the cycle mid-dwell — the ring picks up where it drained to
instead of restarting the countdown.
- `@param` c The carousel host.

### `stopCarouselAutoplay`

Stops autoplay and drains the progress ring. `permanently` latches
_autoplayPermanentlyStopped — every user-initiated navigation
(arrow/dot/swipe/hover) passes true so the carousel never auto-plays
again on this page; visibility/modal stops pass false and may resume.
- `@param` c The carousel host.
- `@param` permanently Latch user intent — no future resumes.

### `regressRingToZero`

Drains ringProgress to 0 by RING_REGRESS_STEP per frame instead of
snapping — the ring visibly unwinds when autoplay stops, matching the
"paused" affordance. autoplayElapsed stays proportional so a resume
continues the cycle. Self-terminating: a resumed autoplay flag or
progress reaching 0 ends the RAF chain.
- `@param` c The carousel host.

### `tickCarouselAutoplay`

Autoplay RAF tick: elapsed/duration → ringProgress 0–1 → paint →
advance when the cycle completes, then rebase the clock for the next
slide. The ring resets before goTo so the new slide starts empty.
- `@param` c The carousel host.
- `@param` timestamp RAF timestamp (ms) — the clock source for this frame.

### `updateCarouselRingDom`

Pushes progress into the DOM: the SVG ring's stroke-dashoffset (full
circumference = empty, 0 = full circle) and the WebGL arrows' arc.
The offset math lives in wasm-layout (SIMD-capable batch helper with a
JS fallback) since this runs per frame.
- `@param` c The carousel host.
