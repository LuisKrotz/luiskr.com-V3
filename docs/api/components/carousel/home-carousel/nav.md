# `components/carousel/home-carousel/nav.ts`

| | |
|---|---|
| **Source** | `src/components/carousel/home-carousel/nav.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `scrollToElement`

Smooth-centers an element in the track. Formula (same geometry as
CustomCarousel): scrollLeft + (el.left − track.left) positions the
slide at the track's left edge; −(track.w − el.w)/2 recenters it so
the slide's midpoint sits on the track's midpoint.

### `jumpToSlide`

Instant centering jump (offsetLeft variant — no smooth scroll): used
for the invisible clone→real teleport and resize refits. Retries one
frame later when layout hasn't produced measurable widths yet.

### `scheduleTeleport`

Clone→real teleport for the infinite loop: waits 420ms (just past
the smooth-scroll duration) so the clone finishes animating in, then
instant-jumps to its real twin — invisible because the clone and
real slide are pixel-identical.

### `scrollToSlide`

Smooth scroll to slide idx (children offset +1 skips the last-clone).

### `goTo`

Navigate to slide idx. idx may be out-of-range (−1 or len): the call
scrolls to the matching CLONE slide at that edge and schedules an
instant teleport to its real twin — the user sees a continuous wrap
scroll while the clone→real swap is invisible. In-range idx scrolls
directly; the 400ms isNavigating window suppresses scroll-handler
teleports until the smooth animation settles.

### `onDotClick`

Jumps to the slide matching the clicked dot.
