# `website/components/nav/handlers.ts`

| | |
|---|---|
| **Source** | `src/website/components/nav/handlers.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `swallow`

Shared click preamble: kill the default anchor navigation and bubbling —
nav links are `<a href>` for SEO/right-click but click interception
routes through the SPA router, and stopPropagation prevents parent
gesture handlers (menu swipe, card taps) from double-firing.
- `@param` e DOM event to neutralize.

### `captureOrigin`

Records the clicked button's center point in store.modalOrigin — the
preferences/lang dialogs read it to zoom their "genie" open animation
out from the trigger instead of from screen center. Falls back to
`closest('button,a')` because the click may land on an inner span —
the origin should be the control's center, not the text node's.
- `@param` e Click event on (or inside) the trigger control.

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
