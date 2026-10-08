# `components/dialogs/lang-dialog/webgl.ts`

| | |
|---|---|
| **Source** | `website/components/dialogs/lang-dialog/webgl.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `mountCloseButton`

Mounts the header close button on its live canvas (rebuilds on swap).

### `mountFlags`

Mounts one FlagWebGL per `data-flag` canvas.

### `mountWebGLControls`

Mounts all WebGL widgets onto the freshly rendered canvases.

### `destroyWebGLControls`

Tears down the mounted flag/close GL widgets.
