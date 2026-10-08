# `experiments/docs/gl-strip.ts`

WebGL thread-field backdrop for the docs navigation region.

| | |
|---|---|
| **Source** | `src/experiments/docs/gl-strip.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Live GL resources for the mounted strip.

### `destroy`

Frees program/buffer/context and stops the rAF loop.

### `VS`

Vertex shader — fullscreen quad passthrough.

### `FS`

Fragment shader — threads: distance from `fract` of a warped sine field
gives evenly spaced iso-contours; two field octaves + slow time drift
keep the line pattern organic. Output alpha stays low so the strip
never competes with the crumb labels.

### `mountDocsGlStrip`

Mounts the animated strip on `canvas`.
- `@param` canvas Target canvas (already sized by CSS; backing store syncs
- `@param` host   Element receiving the `docs-gl-fallback` class on loss.
- `@returns` Handle with destroy(), or null when WebGL is unavailable.
