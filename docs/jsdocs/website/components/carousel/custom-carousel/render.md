# `website/components/carousel/custom-carousel/render.tsx`

Pure JSX render helpers for &lt;custom-carousel&gt;, extracted

| | |
|---|---|
| **Source** | `src/website/components/carousel/custom-carousel/render.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Slide descriptor consumed by the carousel.

### `src`

Extensionless CDN stem — the media-figure resolves the real filename.

### (module scope)

Intrinsic [w,h] for aspect-ratio layout (optional — falls back to GENERIC_DIMENSIONS).

### (module scope)

Accessible/visible caption.

### (module scope)

Extra layout class (e.g. 'landscape') forwarded to the item wrapper.

### (module scope)

Video slide flag — routes to the mp4 grammar + video element.

### (module scope)

Whether the slide can open the fullscreen expand modal.

### (module scope)

Localized carousel control labels (store.lang.carousel).

### `prev`

aria-label for the prev arrow.

### `next`

aria-label for the next arrow.

### `ofLabel`

Localized "of" joiner for the "N of M" counter.

### `renderCarouselSlide`

One slide's inner content — a <media-figure> with the item's CDN src
(folder + src), intrinsic size for aspect-ratio layout, and the
expand/video/label flags. Returns null for placeholder entries.
`classes`/`class` are both set — the custom-element attribute and the
rendered class list must match for the Safari CSS path.
- `@param` item Slide descriptor, or null for empty slots.
- `@param` folder CDN folder prefix (e.g. 'projectslug/').

### `renderArrowButton`

One prev/next control button: a WebGL arrow canvas behind an SVG
autoplay progress ring (stroke-dashoffset driven by the carousel's
_updateRingDom) plus a text glyph fallback. `direction` selects the
modifier class, aria-label and glyph (ARROW_TYPES.PREV/NEXT). The ring
starts at dashoffset=circumference (empty) — autoplay shrinks it.
- `@param` direction ARROW_TYPES.PREV | ARROW_TYPES.NEXT.
- `@param` lang Localized control labels.
- `@param` circumference Ring circle's 2πr — shared with the dashoffset math.

### `renderDots`

Dot-navigation strip: localized "N of M" counter + one button per real slide.

### `renderCarousel`

JSX template. Two shapes:
  inactive (≤1 item, or items fit side-by-side) → a plain flex row,
    no track/controls — media is already fully visible
  active → track = [clone-last][items…][clone-first] + controls.
    Clones are aria-hidden + inert — screen readers and tab order see
    only the real slides; the teleport logic uses them for the wrap.
Each control button carries an SVG progress ring (dashoffset driven
by _updateRingDom) behind a WebGL arrow canvas.
- `@param` host The CustomCarousel element.
- `@returns` JSX — fallback row or the full track+controls shape.
