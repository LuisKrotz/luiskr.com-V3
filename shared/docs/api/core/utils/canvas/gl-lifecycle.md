# `core/utils/canvas/gl-lifecycle.ts`

Shared context-loss + release plumbing for the quad-based

| | |
|---|---|
| **Source** | `src/core/utils/canvas/gl-lifecycle.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Minimal surface every quad-based widget/renderer exposes for teardown.

### `watchContextLoss`

Attaches a `webglcontextlost` listener that runs `onLost` (the widget's
fallback trigger) without preventDefault — a lost context stays lost
and the CSS/2D fallback takes over. Returns the bound handler so
`releaseQuadGL` can detach it before an intentional `loseContext()`.

### `releaseQuadGL`

Frees the quad program + buffer and force-loses the context. The
`onLost` listener (from watchContextLoss) is detached first so the
asynchronous loss event cannot fire the widget's fallback (or mark
the canvas) during a deliberate teardown — and without preventDefault
no zombie context is ever restored.
