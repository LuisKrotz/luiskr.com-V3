# `website/components/carousel/custom-carousel/sizing.ts`

Fit/height measurement for CustomCarousel — the

| | |
|---|---|
| **Source** | `src/website/components/carousel/custom-carousel/sizing.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `startFitObserver`

Wires a ResizeObserver on the host that re-runs _measureFit on width
changes. Reports under FIT_EPS_PX of the last width are dropped —
scrollbars appearing/disappearing and sub-pixel reflow would otherwise
re-fit on every layout pass. The measurement defers one RAF so it runs
post-layout, and ResizeObserver absence (old engines) degrades to the
one-shot window-resize path.
- `@param` c The CustomCarousel element.

### `measureFit`

Decides whether the items fit side-by-side (no carousel chrome) or need
the scroll track. Side-by-side requires: ≤2 items, viewport
≥ SIDE_BY_SIDE_BREAKPOINT, and projected total width ≤ host width.
The projection mirrors the shadow-DOM contract in media-figure.scss +
carousel-host.scss exactly: strip height is --mf-h (70dvh minus a pad
under 1024, fixed $space-* steps above), media width is
ratio·stripH floored at MEDIA_MIN_WIDTH on ≥375px viewports and capped
by the regular gutter cap or the landscape --mf-max-w ladder, and each
item adds its breakpoint padding + desktop side margin. Items missing
intrinsic sizes use GENERIC_DIMENSIONS defaults (conservative portrait)
so a partial CMS row can't silently flip to scroll mode.
- `@param` c The CustomCarousel element.
- `@param` observedWidth Fresh RO width when known — avoids a layout read.

### `onCarouselResize`

Window-resize handler — refreshes the mobile flag against the
side-by-side breakpoint (mobile is defined by "can't pair items", not
by the generic 768 media breakpoint) and re-publishes the slide height.
- `@param` c The CustomCarousel element.

### `setHeightVar`

Publishes --carousel-item-height on the enclosing <section>: the first
item's intrinsic ratio applied to the host width ((h/w)·hostW), capped
at MAX_HEIGHT_VH — aspect-correct heights before image decode so slides
never pop. When the item lacks a size the measured slide height is the
fallback; a ≤0 result bails rather than writing a 0px var. The
getPropertyValue read guards the setProperty — same-value writes would
still dirty the style recalc.
- `@param` c The CustomCarousel element.
