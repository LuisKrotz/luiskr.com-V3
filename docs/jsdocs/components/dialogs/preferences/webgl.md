# `components/dialogs/preferences/webgl.ts`

| | |
|---|---|
| **Source** | `src/components/dialogs/preferences/webgl.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

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
