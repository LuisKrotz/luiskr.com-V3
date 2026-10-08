# `website/components/dialogs/lang-dialog/webgl.ts`

| | |
|---|---|
| **Source** | `src/website/components/dialogs/lang-dialog/webgl.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `mountCloseButton`

Mounts the header close button on its live canvas (rebuilds on swap).

### `mountFlags`

Mounts one FlagWebGL per `data-flag` canvas.

### `mountWebGLControls`

Mounts all WebGL widgets onto the freshly rendered canvases.

### `destroyWebGLControls`

Tears down the mounted flag/close GL widgets.
