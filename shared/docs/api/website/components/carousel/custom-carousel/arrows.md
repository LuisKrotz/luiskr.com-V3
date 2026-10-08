# `website/components/carousel/custom-carousel/arrows.ts`

Control wiring for CustomCarousel — prev/next/dot click

| | |
|---|---|
| **Source** | `src/website/components/carousel/custom-carousel/arrows.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `bindControls`

Wires every carousel control: prev/next clicks + hover (hover stops
autoplay permanently — pointer over a control is intent to drive),
dot clicks, and track scroll/swipe. Touch listeners are `passive` so
scroll stays on the compositor thread — the handler only reads
positions and never calls preventDefault.
- `@param` c The CustomCarousel element.

### `mountWebGLArrows`

Mounts the CarouselArrowWebGL widgets on the prev/next button canvases.
Idempotent per canvas: a live widget whose canvas was replaced by a
re-render is destroyed first (a canvas can't host two GL contexts), and
a widget on the same canvas is left alone — GL contexts are never
churned by renders.
- `@param` c The CustomCarousel element.

### `destroyWebGLArrows`

Destroys both arrow widgets — called on viewport exit (contexts are
released offscreen to keep the pool small) and on destroy. Nulling the
refs lets the next mount rebuild fresh.
- `@param` c The CustomCarousel element.
