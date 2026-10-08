# `website/views/not-found/NotFound.tsx`

&lt;view-not-found&gt; — the 404 route: the "signal lost" page with

| | |
|---|---|
| **Source** | `src/website/views/not-found/NotFound.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `ViewNotFound`

The ViewNotFound — not found class.

### `translations`

Seeded with the build-time English snapshot so the 404 renders
meaningful copy instantly — and still renders when the Firebase fetch
fails or the locale node is missing. Replaced by the live translation
once `loadData()` resolves.

### `emojiLine`

The decorative emoji/symbol row above the message.

### `subtitle`

Localized 404 message.

### `homePath`

Localized home URL for the back link.

### (module scope)

Lifecycle: loads translations.

### (module scope)

Lifecycle: re-binds links after render.

### (module scope)

Wires the home link through the SPA router.

### `loadData`

Loads the not-found translation node via SWR.

### (module scope)

JSX template for the view's shadow DOM.
