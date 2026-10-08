# `website/components/dialogs/LangDialog.tsx`

&lt;lang-dialog&gt; — locale picker: a grid of language options

| | |
|---|---|
| **Source** | `src/website/components/dialogs/LangDialog.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `LangDialog`

The LangDialog — dialog class.

### `open`

Setter/getter — controls the dialog's open state.

### `isOpen`

Whether the dialog is currently shown.

### `_syncOpenState`

Reflects the open flag into DOM state (classes, genie enter/leave).

### `_mountWebGLControls`

Mounts FlagWebGL widgets onto each language option + the close control.

### `_destroyWebGLControls`

Tears down the mounted flag/close GL widgets.

### `_bindEvents`

Binds option clicks, backdrop click and keyboard dismissal.

### `close`

Closes the dialog through the genie-leave animation, then runs done().

### `selectLang`

Applies the chosen locale. Same-locale selection just dismisses; a
real switch defers _applyLang to the genie-leave callback so the
dialog closes INTO the flag trigger before the locale swap re-renders.

### `_applyLang`

Locale URL rewrite + store commit (delegate — ./lang-dialog/locale.ts).

### (module scope)

JSX template (delegate — ./lang-dialog/render.tsx).
