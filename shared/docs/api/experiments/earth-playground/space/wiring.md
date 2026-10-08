# `experiments/earth-playground/space/wiring.ts`

Control wiring for SpacePlayground — panel event binding,

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/space/wiring.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `setGroupCollapsed`

Synchronizes one group's collapsed class, accessibility state, and
focusability — aria-expanded on the header, `inert` on the content so a
collapsed group's controls leave the tab order entirely.
- `@param` group The .sp-group element.
- `@param` collapsed Whether to collapse.

### `bindSpaceControls`

Binds the whole panel via four delegated scoped listeners on the shadow
root: click (panel toggle, reopen, collapsible headers, data-action
buttons), focusin/focusout (keyboard traversal temporarily expands a
collapsed group while focus is inside), input (sliders), and change
(checkboxes) — the last two both route to _handleInput. Delegation means
a re-render doesn't lose handlers.
- `@param` c The SpacePlayground element.

### `startSpacePositionLoop`

Starts the rAF loop mirroring camera position/target into the panel
readout each frame — cheap textContent writes, skipped entirely while
the engine handle is absent. Cancels any previous loop first so remount
can't double-arm the RAF chain.
- `@param` c The SpacePlayground element.

### `handleSpaceAction`

Dispatches a data-action button: panel-open is engine-free; the rest
need a live _earthBg — reset (view + saved settings + inputs back to
defaults), toggle-rotate (flips autoRotate and mirrors aria-pressed),
screenshot, and copy-constants (serializes the GUI settings to the
clipboard for pasting into source).
- `@param` c The SpacePlayground element.
- `@param` action The data-action token, or null.
- `@param` btn The clicked button (aria-pressed target for toggles).

### `handleSpaceInput`

Routes one param input to the engine: reads checked (checkbox) or
Number(value) (slider), repaints the slider's track-fill % + row label,
syncs the WebGL checkbox twin, dispatches the PARAM_HANDLERS setter,
then persists the param so a reload restores it.
- `@param` c The SpacePlayground element.
- `@param` input The changed input carrying a data-param attribute.

### `persistSpaceParam`

Writes one param into the saved-settings map and persists the whole map
to localStorage — the single write point for panel state.
- `@param` c The SpacePlayground element.
- `@param` param Engine param name (key into PARAM_HANDLERS).
- `@param` val New value (number or boolean).

### `syncSpacePanel`

Reflects `_panelOpen` into the DOM — the collapsed class on the panel
and the reopen button's display (hidden while the panel is open).
- `@param` c The SpacePlayground element.

### `mountSpaceCheckboxCanvases`

Mounts one CheckboxWebGL twin per checkbox canvas: destroys a stale
twin when the canvas element changed identity across a re-render,
creates missing ones, and re-syncs checked state on existing ones.
- `@param` c The SpacePlayground element.

### `destroySpaceCheckboxCanvases`

Tears down every CheckboxWebGL twin — frees their GL contexts via the
shared release path and clears the registry so a remount starts clean.
- `@param` c The SpacePlayground element.
