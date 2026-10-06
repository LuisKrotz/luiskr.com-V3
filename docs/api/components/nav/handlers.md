# `components/nav/handlers.ts`

| | |
|---|---|
| **Source** | `src/components/nav/handlers.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `swallow`

Shared click preamble: kill the default navigation + bubbling.

### `captureOrigin`

Records the clicked button's center point in store.modalOrigin — the
preferences/lang dialogs read it to zoom their "genie" open animation
out from the trigger instead of from screen center.

### `handleLogo`

Logo click: navigates home, or scrolls top when already on home.

### `handleAbout`

About link click: routes to the localized about slug.

### `handleAction`

Contact/CTA click: routes to the localized contact slug.

### `handlePreferences`

Opens the preferences modal (fires open-preferences-modal after capturing origin).

### `handleLang`

Opens the language dialog (fires open-lang-dialog after capturing origin).
