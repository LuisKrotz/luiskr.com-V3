# `core/safari/patches/carousel.ts`

CustomCarousel patch: injects the safari-carousel stylesheet into the

| | |
|---|---|
| **Source** | `src/core/safari/patches/carousel.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `patchCarousel`

Installs the carousel patch once <custom-carousel> registers: neuters
`_measureFit` (iOS layout thrash — reading fit metrics mid-layout
forces synchronous reflow on every slide) and wraps `_renderInitial`
to inject the safari-carousel stylesheet into the shadow root.
