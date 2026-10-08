# `components/dialogs/preferences/sync.ts`

| | |
|---|---|
| **Source** | `website/components/dialogs/preferences/sync.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `syncOpenState`

Reflects the open flag into DOM/classes (widget teardown on close).

### `updateThemeUI`

Syncs the theme option buttons with the store's theme.

### `syncSwitchButton`

Syncs one switch button's DOM classes/ARIA with its state.

### `updateSwitchesUI`

Syncs each switch widget + its DOM twin with its pref value.
