# `website/components/carousel/AwardsCarousel.tsx`

&lt;awards-carousel&gt; — lightweight carousel used by the awards

| | |
|---|---|
| **Source** | `src/website/components/carousel/AwardsCarousel.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `AwardsCarousel`

<awards-carousel> element — a lightweight looping carousel for award
and selected-work strips. Clone-ended infinite scroll (first/last
slides duplicated so the wrap jump looks seamless), dot navigation,
and a 30s RAF-driven autoplay gated on ≥50% visibility and
reduced-motion. All behavior delegates to `./awards-carousel/*`; this
class is the state holder + custom-element facade.

### `_items`

Slide entries pushed by the host — setter guards identity so repeat pushes don't re-render.

### `variant`

Render mode: 'selected' content cards | 'awards' link list.

### `duration`

Autoplay dwell per slide (ms) — 30s keeps it ambient, not distracting.

### `showDots`

Dot nav visibility (host sets it for awards).

### `currentIndex`

Real-slide index (clones excluded).

### `autoplayRunning`

RAF cycle active flag.

### `autoplayStart`

performance.now() at cycle start.

### `autoplayElapsed`

Accumulated pause→resume offset so dwell survives interruptions.

### `rafId`

Autoplay RAF handle.

### `teleportTimer`

Pending clone→real jump timer (teleport after wrap settles).

### `touchStartX`

Swipe origin X for the 40px threshold check.

### `isNavigating`

Programmatic scroll in flight — scroll events during it are ignored.

### `isEnteredViewport`

Any viewport visibility ever observed (starts fade-in on first sight).

### `isFullyVisible`

≥50% visible — the autoplay gate.

### `observer`

IntersectionObserver handle driving the visibility flags.

### `setupRafId`

Pending one-shot init frame (setup runs after first paint so layout exists).

### `items`

Slide entries pushed by the host. The identity-equality early-return
(same array instance, or same items in same order) prevents Firebase
re-pushes that carry identical data from wiping the DOM and
restarting autoplay + draw animations mid-cycle.

### (module scope)

Mount: render items, wire events/observer, subscribe to the store for reduced-motion.

### (module scope)

Re-render: re-strip clone focusability (clones get re-created).

### (module scope)

Reduced-motion commit → kill autoplay immediately (no residual RAF).

### `_setupCarousel`

Initializes the carousel: bind → jump → observer → clone a11y. The work runs inside one RAF so layout is settled before jump/observer measure positions.

### (module scope)

Teardown: stop RAF + observer + timers — every async handle is released so nothing fires after disconnect.

### `_bindEvents`

Binds scroll/touch/dot listeners (awards-carousel/events.ts).

### `onDotClick`

Dot-nav click → goTo.

### `goTo`

Navigate to real-slide index (wraps via clone path).

### `_scrollToElement`

Scrolls the track so `el` lands at the carousel start edge.

### `_scrollToSlide`

Scrolls to slide `idx` — real index, resolved through the clone map.

### `_scheduleTeleport`

Schedules the post-wrap teleport from a clone position back to the real slide.

### `_jumpToSlide`

Positions the track on slide `idx` (smooth=false for instant jumps).

### `_setupObserver`

Creates the IntersectionObserver driving isEnteredViewport/isFullyVisible.

### `_onResize`

Resize handler — remeasures slide width and re-jumps without animation.

### `_disableClonesFocus`

Strips focusability from clone slides so Tab order only visits real slides.

### `_startAutoplay`

Starts the autoplay RAF cycle (gated by visibility + reduced-motion).

### `_stopAutoplay`

Stops the autoplay RAF cycle.

### `_tickAutoplay`

One autoplay frame — advances when dwell elapsed, then self-schedules.

### `renderItem`

Renders one slide JSX (variant-aware).

### (module scope)

JSX template (delegate — ./awards-carousel/render.tsx).
