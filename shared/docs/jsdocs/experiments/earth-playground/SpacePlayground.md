# `experiments/earth-playground/SpacePlayground.tsx`

&lt;view-space-playground&gt; — the space/earth playground route:

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/SpacePlayground.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `SpacePlayground`

The SpacePlayground — playground class.

### `_getCanvasEl`

The WebGL canvas the EarthBackground engine renders into.

### (module scope)

Lifecycle: loads translations, binds controls, boots the Earth engine.

### (module scope)

Lifecycle: re-mounts checkbox canvases after re-render.

### (module scope)

Lifecycle: destroys the Earth engine + checkbox widgets.

### (module scope)

Re-syncs settings on store changes.

### `_loadTranslations`

Loads the playground label translations via SWR.

### `_applyTranslations`

Stores the fetched playground node, merges the CMS-managed `defaults`
into the slider definitions (user-saved settings still win), and
re-renders. `defaults` is a `{ labelKey: number|boolean }` map published
from translations/<loc>/pages/earth-playground/defaults.
`@private`

### `_applyDbDefaults`

Merges CMS default values into the control definitions. Keys are the
control `label` tokens (bloomStr, fov, …); booleans land on checkbox
`checked`, numbers on range `def`. The live engine + already-rendered
inputs are updated unless the user has an overriding saved setting.
`@private`

### `_updateLoader`

Mirrors engine bootstrap progress into the loader overlay — each node is
optional because the loader can already be dismissed or re-rendered away.
- `@param` {string} msg - progress label
- `@param` {number} pct - 0-100 progress percent

### `_initEarth`

Creates the EarthBackground engine with ready/progress callbacks.

### `_dismissLoader`

Hides the loading overlay after the first usable frame.

### `_applyPersistedSettings`

Replays saved localStorage settings onto the panel + engine.

### `_bindControls`

Wires sliders, checkboxes and action buttons.

### `_startPositionLoop`

Periodically reports camera position for the HUD/persistence.

### `_handleAction`

Runs a button action (screenshot, reset, music toggle).

### `_handleInput`

Applies a slider/checkbox input to the engine and persists it.

### `_persistParam`

Writes one param value into the persisted settings.

### `_syncPanel`

Pushes engine state back into the panel controls.

### `_mountCheckboxCanvases`

Mounts CheckboxWebGL widgets onto the panel checkboxes.

### `_destroyCheckboxCanvases`

Tears down the checkbox widgets.
