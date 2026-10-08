# `core/safari/patches/media-figure/image-load.ts`

Safari image-loading overrides for MediaFigure: a

| | |
|---|---|
| **Source** | `src/core/safari/patches/media-figure/image-load.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `safariLoadHighRes`

Safari loadHighRes: requests the Q50 (medium) variant instead of the
uncompressed source — iOS Safari hard-fails canvas/decode on images
above ~4096px and the Q100 asset frequently exceeds texture memory.

### `bindSafariImageLoad`

Lazy-thumbnail + img-observer wiring for non-hero images: the thumb
defers via loading=lazy and the Q50 swap triggers once the figure
scrolls within ROOT_MARGIN_50 of the viewport.
