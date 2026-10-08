# `core/safari/patches/media-figure.ts`

MediaFigure patch orchestrator: safari-media styles,

| | |
|---|---|
| **Source** | `src/core/safari/patches/media-figure.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `patchMediaFigure`

Installs the MediaFigure patch once the element registers:
 - `_renderInitial` is wrapped to inject the safari-media stylesheet
   into the shadow root after the base render.
 - `loadHighRes` is replaced by safariLoadHighRes (Q50-capped source so
   the decode stays under WebKit's ~4096px image ceiling).
 - `onMounted` is wrapped to clear the compositor hints Safari
   mishandles (will-change/transform/backface-visibility), patch video
   figures (muted autoplay + first-touch unlock retry), bind the
   tap-vs-scroll expand gesture on expandable figures, and bind the
   image load/error → isLoaded path for the shimmer handoff.
