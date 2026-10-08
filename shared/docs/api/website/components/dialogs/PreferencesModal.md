# `website/components/dialogs/PreferencesModal.tsx`

&lt;preferences-modal&gt; — settings dialog: theme slider

| | |
|---|---|
| **Source** | `src/website/components/dialogs/PreferencesModal.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `PreferencesModal`

The PreferencesModal — modal class.

### `pref`

Setter/getter — the pref.* translation node for labels.

### `open`

Setter/getter — controls the modal's open state.

### `t`

Convenience getter — pref translations shorthand used in render.

### `isOpen`

Whether the modal is shown.

### `currentTheme`

The store's theme value (light/dark/system).

### `reducedMotion`

Whether reduced motion is enabled.

### `npuAnalytics`

Live analytics from the NPU predictor for the dev-tools readout.

### `npuStatus`

Human-readable acceleration tier for the dev-tools readout. Ordered
best→fallback: NPU (neural inference available) → GPU → WASM — the
same precedence the predictive loader uses for its math backend.

### `_syncOpenState`

Reflects the open flag into DOM/classes and runs the genie enter/leave.

### `_mountWebGLControls`

Mounts the WebGL widgets onto the freshly rendered canvases.

### `_destroyWebGLControls`

Tears down the mounted GL widgets.

### (module scope)

Store-driven sync. Two paths:
  open-state flipped → full re-render + mount widgets + genie-enter
    (the zoom-from-trigger animation) + focus the backdrop for
    Escape-dismiss and screen-reader context
  already open → in-place sync: propagate reduced-motion to the
    widgets and re-derive switch/theme states without a re-render
    (avoids destroying canvases mid-interaction)

### `_updateThemeUI`

Syncs the theme slider widget with the store's theme.

### `_updateSwitchesUI`

Syncs each switch widget with its pref value.

### `_bindBackdropEvents`

Wires backdrop-dismiss: Escape only — everything else is JSX onClick.

### `close`

Close flow: play the genie-leave shrink-back-to-trigger animation
first, THEN commit the closed state — committing early would unmount
the dialog before the animation completes (a hard vanish instead of
the zoom-out).

### (module scope)

JSX template (delegate — ./preferences/render.tsx).
