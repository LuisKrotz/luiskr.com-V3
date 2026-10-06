# `routes/NotFound.tsx`

&lt;view-not-found&gt; — the 404 route: the "signal lost" page with

| | |
|---|---|
| **Source** | `src/routes/NotFound.tsx` |
| **UX surface** | One page of the site per file — the URL the visitor lands on. |

## Members

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
