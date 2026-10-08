# `website/components/carousel/awards-carousel/nav.ts`

| | |
|---|---|
| **Source** | `src/website/components/carousel/awards-carousel/nav.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `scrollToElement`

Smooth-centers an element in the track. Formula (same geometry as
CustomCarousel): scrollLeft + (el.left − track.left) positions the
slide at the track's left edge; −(track.w − el.w)/2 recenters it so
the slide's midpoint sits on the track's midpoint.
- `@param` host The AwardsCarousel element.
- `@param` el Slide element to center.

### `jumpToSlide`

Instant centering jump (offsetLeft variant — no smooth scroll): used
for the invisible clone→real teleport and resize refits. Retries one
frame later when layout hasn't produced measurable widths yet (a
display:none parent yields clientWidth 0 — waiting a frame beats
computing a bogus 0-offset jump).
- `@param` host The AwardsCarousel element.
- `@param` idx Real-slide index; `children[idx + 1]` skips the leading
- `@param` smooth true for a smooth jump, false (default) for instant.

### `scheduleTeleport`

Clone→real teleport for the infinite loop: waits TELEPORT_DELAY (420ms,
just past the smooth-scroll duration) so the clone finishes animating
in, then instant-jumps to its real twin — invisible because the clone
and real slide are pixel-identical. A pending teleport is cancelled so
rapid nav can't queue competing jumps.
- `@param` host The AwardsCarousel element.
- `@param` targetIdx Real-slide index to land on after the clone animates.

### `scrollToSlide`

Smooth scroll to slide idx (children offset +1 skips the last-clone).
Same centering math as scrollToElement but reads rects fresh — the
track may have scrolled between calls, so offsets come from
getBoundingClientRect, not offsetLeft.
- `@param` host The AwardsCarousel element.
- `@param` idx Real-slide index.

### `goTo`

Navigate to slide idx. idx may be out-of-range (−1 or len): the call
scrolls to the matching CLONE slide at that edge and schedules an
instant teleport to its real twin — the user sees a continuous wrap
scroll while the clone→real swap is invisible. In-range idx scrolls
directly; the NAVIGATION_SETTLE_DELAY isNavigating window suppresses
scroll-handler teleports until the smooth animation settles.
`((idx % len) + len) % len` normalizes idx into [0,len) — the double
modulo handles negative idx (−1 → len−1) where a single % yields −1.
- `@param` host The AwardsCarousel element.
- `@param` idx Target index — may be −1 or len for edge wraps.

### `onDotClick`

Jumps to the slide matching the clicked dot — a manual choice stops
autoplay (user intent overrides the ambient cycle).
- `@param` host The AwardsCarousel element.
- `@param` idx Dot index → real-slide index.
