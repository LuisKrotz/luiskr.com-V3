# `website/components/carousel/CustomCarousel.tsx`

&lt;custom-carousel&gt; — infinite-loop horizontal carousel used by

| | |
|---|---|
| **Source** | `src/website/components/carousel/CustomCarousel.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `CustomCarousel`

<custom-carousel> element — the full-featured infinite carousel: media
slides (image/video via <media-figure>), clone-ended wrap, WebGL
prev/next arrows with a progress ring, dot nav, lazy media near the
active index, IntersectionObserver-gated autoplay, and a side-by-side
mode that drops all chrome when ≤2 items fit. Behavior delegates to
`./custom-carousel/*`; this class is the state holder + facade.

### `_items`

Slide descriptors {src, size:[w,h], label, class, isVideo, canExpand}.

### `_folder`

CDN folder prefix prepended to each item's src.

### `_forceActive`

Host-forced active flag — keeps the carousel live even when side-by-side would fit.

### `_prevArrow`

Live CarouselArrowWebGL widgets (null until viewport entry).

### `currentIndex`

Logical index into items (0..len-1; clone positions never stored).

### `autoplayRunning`

RAF cycle active flag.

### `autoplayStart`

performance.now() the current dwell cycle started at.

### `autoplayElapsed`

Accumulated ms into the cycle — survives pause→resume.

### `ringProgress`

0–1 fraction of the autoplay cycle — drives both the SVG ring and
 the WebGL arrows' progress arc.

### `rafId`

Autoplay RAF handle — cancelled by _stopAutoplay.

### `scrollTimeout`

Scroll debounce — _checkInfiniteLoop runs 150ms after the last event.

### `teleportTimer`

Pending clone→real instant jump (CAROUSEL_TIMING.TELEPORT_DELAY).

### `isNavigating`

True while a programmatic scroll is animating — suppresses the
 scroll-handler teleport so the goTo-driven clone jump isn't undone.

### `touchStartX`

Swipe origin X for the threshold check in the touchend handler.

### `slideLoaded`

Per-index lazy flag: media src assigned only for slides near the
 active one (±2 positions, wrapping).

### `circumference`

2πr of the progress ring — used as stroke-dasharray/dashoffset.

### `isFullyVisible`

≥50% visible — the autoplay gate.

### `isEnteredViewport`

Any viewport visibility ever observed.

### `observer`

IntersectionObserver driving the visibility flags + lazy media.

### `_isSideBySide`

True when ≤2 items fit side-by-side at ≥960px — no carousel chrome.

### `_fitObserver`

ResizeObserver on the host for _measureFit re-runs.

### `_lastObservedWidth`

Last width the fit observer saw — dedups sub-pixel RO noise.

### `_autoplayPermanentlyStopped`

Latched by any user interaction — autoplay never resumes after.

### `_isRegressing`

Ring regress animation in flight (drains progress on stop).

### `isMobile`

Viewport under the mobile breakpoint at construct time.

### `items`

Setter/getter — slide data (media + labels).

### `configure`

Batch-assigns items/folder/forceActive with a single render — the
setter chain would otherwise re-render per property. Re-applying the
same data (same array reference + same flags) is a no-op, so parents
may call it freely from render/update paths.
- `@param` {object} o
- `@param` {Array} o.items
- `@param` {string} o.folder
- `@param` {boolean} o.forceActive

### `folder`

Setter/getter — CDN media folder prefix for slide assets.

### `forceActive`

Setter/getter — forces the autoplay/running state on.

### `isActive`

Whether the carousel is currently auto-advancing.

### `onUnmounted`

Extra unmount hook the Safari patch calls — releases the fit observer early.

### `_setupAfterRender`

Post-render setup: measures, binds controls, starts observers.

### `_startFitObserver`

ResizeObserver that re-fits slides when the container size changes.

### `_measureFit`

Decides whether the items fit side-by-side (no carousel chrome) or
need the scroll track. Side-by-side requires: exactly ≤2 items, no
landscape item (they're too wide to pair), viewport ≥960px, and the
projected total width ≤ host width. Projection math: each item renders
at maxH = 70vh tall, so its laid-out width is (w/h)·maxH; +32px gap
per item approximates the flex gap.

### `_onResize`

Window-resize handler: re-fits and re-measures.

### `_setHeightVar`

Publishes --carousel-item-height on the enclosing <section> so all
slides share one height. Source: the first item's intrinsic ratio
applied to the host width ((h/w)·hostW), capped at MAX_HEIGHT_VH —
aspect-correct without waiting for image decode.

### `_bindControls`

Wires prev/next/dot controls and mounts the WebGL arrows.

### `_mountWebGLArrows`

Creates the CarouselArrowWebGL widgets on the prev/next canvases.

### `_destroyWebGLArrows`

Destroys the WebGL arrow widgets.

### `_markAdjacentLoaded`

Lazy-load window: marks slides within 2 positions of the active index
as loadable — distance is measured on the ring (min of direct vs
wrapped |i−center|), so sliding to the last item pre-loads the first
and vice versa. The two explicit edge lines cover len<3 edge cases.

### `goTo`

Navigate to slide idx — accepts out-of-range idx (idx<0 or idx≥len) by
scrolling to the CLONE slide at that edge, then scheduling an instant
teleport to the real slide (the infinite-loop illusion: the user sees
the clone scroll in, the swap to its identical twin is invisible).
In-range idx scrolls directly; isNavigating suppresses the scroll
handler's own teleport until the animation settles (~400ms).

### `_updateActiveClasses`

Toggles -active classes on the active slide/dot pair.

### `_scrollToElement`

Smooth-scrolls the track to a slide element.

### `_scheduleTeleport`

Schedules the invisible jump from a clone to its real slide.

### `_scrollToSlide`

Smooth-scrolls to slide idx.

### `_jumpToSlide`

Instant position jump — used for the clone teleports.

### `onScroll`

Scroll handler: detects when the track lands on a clone edge to teleport.

### `_checkInfiniteLoop`

Teleports between clone and real slides at track edges — the infinite-loop trick.

### `onPrevClick`

Prev-arrow click.

### `onNextClick`

Next-arrow click.

### `onDotClick`

Dot-navigation click to a specific slide.

### `_setupIntersectionObserver`

Observes slides for lazy media loading + autoplay pausing when offscreen.

### `_startAutoplay`

Starts/resumes the autoplay RAF cycle. autoplayStart is backdated by
the accumulated elapsed so a pause→resume continues mid-cycle rather
than restarting the countdown — the ring picks up where it drained to.

### `_stopAutoplay`

Stops autoplay; `permanently` latches _autoplayPermanentlyStopped so no resume follows a user gesture.

### `_regressRingToZero`

Animates ringProgress back to 0 (drain effect when autoplay stops).

### `_tick`

Autoplay RAF frame — advances the ring clock, flips slides on cycle end.

### `_updateRingDom`

Writes ringProgress into the SVG dashoffset + arrow widget arc.

### `renderSlide`

One slide's inner content — a <media-figure> with the item's CDN src
(folder + src), intrinsic size for aspect-ratio layout, and the
expand/video/label flags. Returns null for placeholder entries.

### (module scope)

JSX template — see carousel-render.tsx for the active/inactive
shapes (clone slides, dots, ring buttons).
