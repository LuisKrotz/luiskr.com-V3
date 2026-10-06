# `components/carousel/custom-carousel/render.tsx`

Pure JSX render helpers for &lt;custom-carousel&gt;, extracted

| | |
|---|---|
| **Source** | `src/components/carousel/custom-carousel/render.tsx` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### (module scope)

Slide descriptor consumed by the carousel.

### (module scope)

Localized carousel control labels (store.lang.carousel).

### `renderCarouselSlide`

One slide's inner content — a <media-figure> with the item's CDN src
(folder + src), intrinsic size for aspect-ratio layout, and the
expand/video/label flags. Returns null for placeholder entries.

### `renderArrowButton`

One prev/next control button: a WebGL arrow canvas behind an SVG
autoplay progress ring (stroke-dashoffset driven by the carousel's
_updateRingDom) plus a text glyph fallback. `direction` selects the
modifier class, aria-label and glyph (ARROW_TYPES.PREV/NEXT).

### `renderDots`

Dot-navigation strip: counter + one button per real slide.

### `renderCarousel`

JSX template. Two shapes:
  inactive (≤1 item, or items fit side-by-side) → a plain flex row,
    no track/controls — media is already fully visible
  active → track = [clone-last][items…][clone-first] + controls.
    Clones are aria-hidden + inert — screen readers and tab order see
    only the real slides; the teleport logic uses them for the wrap.
Each control button carries an SVG progress ring (dashoffset driven
by _updateRingDom) behind a WebGL arrow canvas.
