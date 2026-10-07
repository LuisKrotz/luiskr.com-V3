# `core/browser/browsers.ts`

Zero-dependency UA detection table — shared by the runtime

| | |
|---|---|
| **Source** | `src/core/browser/browsers.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

navigator.gpu absent/flag-gated — the app skips the WebGPU init path.

### (module scope)

Mostly mid-range SoCs — renderers may start at reduced resolution scale.

### (module scope)

One row of the detection table — UA regex source plus its quirks.

### `BROWSERS`

Ordered UA patterns — first match wins.
