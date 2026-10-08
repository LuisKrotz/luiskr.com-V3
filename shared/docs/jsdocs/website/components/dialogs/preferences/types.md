# `website/components/dialogs/preferences/types.ts`

| | |
|---|---|
| **Source** | `src/website/components/dialogs/preferences/types.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

One theme option's translated label (dark / system / light).

### `label`

Translated option label rendered next to the radio.

### (module scope)

`pref.*` translation node consumed by the preferences dialog.

### `title`

Dialog heading.

### `done`

Confirmation text after the apply action.

### `closeLabel`

aria-label for the close button.

### `appearance`

Appearance section — theme picker copy.

### `title`

Section heading.

### `desc`

Section description under the heading.

### `dark`

Dark-theme radio option.

### `system`

Follow-OS radio option.

### `light`

Light-theme radio option.

### `devTools`

Developer-tools section — diagnostic toggles copy.

### `title`

Section heading.

### `statsForNerds`

Label for the stats-for-nerds toggle.

### `statsForNerdsDesc`

Description under the stats toggle.

### `showGrid`

Label for the layout-grid overlay toggle.

### `showGridDesc`

Description under the grid toggle.

### `reducedMotion`

Label for the reduced-motion override toggle.

### `reducedMotionDesc`

Description under the reduced-motion toggle.

### `PREF_DEFAULTS`

Build-time English copy for the dialog — used until the locale node
resolves so the UI never renders empty labels.
