# `website/components/dialogs/preferences/webgl.ts`

| | |
|---|---|
| **Source** | `src/website/components/dialogs/preferences/webgl.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `commitSwitch`

Commits the pref mutation matching a switch type.

### `switchActive`

Current toggle state for a switch type.

### `mountThemeSlider`

Mounts the theme slider on its live canvas (rebuilding on canvas swap).

### `mountSwitches`

Mounts one SwitchWebGL per `data-switch` canvas.

### `mountCloseButton`

Mounts the header close button on its live canvas.

### `mountWebGLControls`

Mounts all WebGL widgets onto the freshly rendered canvases.

### `destroyWebGLControls`

Tears down the mounted GL widgets.
