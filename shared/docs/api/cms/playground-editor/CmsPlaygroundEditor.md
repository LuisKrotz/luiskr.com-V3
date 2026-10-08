# `cms/playground-editor/CmsPlaygroundEditor.tsx`

&lt;cms-playground-editor&gt; — playground + slugs editor:

| | |
|---|---|
| **Source** | `src/cms/playground-editor/CmsPlaygroundEditor.tsx` |
| **UX surface** | Earth-playground labels, defaults and route slugs editor. |

## Members

### `CmsPlaygroundEditor`

The CmsPlaygroundEditor — playground editor class.

### (module scope)

Lifecycle: loads playground data.

### (module scope)

Lifecycle: re-binds after render.

### `loadAllData`

Reads the playground + slugs nodes for all locales.

### `saveAll`

Writes edits back to Firebase.

### `addEpKey`

Adds a new playground label key.

### `removeEpKey`

Removes a playground label key.

### `_notify`

Fires a cms-notification toast.

### `_bindEvents`

Wires all inputs/buttons.

### `_renderLabelRows`

JSX for the playground label key rows.

### `_renderDefaults`

JSX for the playground control defaults (typed per stored value).

### `_renderSlugRows`

JSX for the per-locale slug editor rows.

### (module scope)

JSX template.
