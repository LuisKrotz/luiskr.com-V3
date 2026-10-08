# `core/tokens/attrs/data.ts`

`data-*` attribute tokens — token group. Every name is

| | |
|---|---|
| **Source** | `src/core/tokens/attrs/data.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DATA_ATTRS`

Frozen data attribute-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `DATA_INDEX`

`data-index` — generic positional index (lists, slides).

### `DATA_LANG`

`data-lang` — locale marker stamped by language UI rows.

### `DATA_FLAG`

`data-flag` — marks flag-canvas nodes inside language rows.

### `DATA_SWITCH`

`data-switch` — marks toggle-switch rows in preferences.

### `DATA_TAB`

`data-tab` — tab identifier for tabbed surfaces (CMS panels).

### `DATA_IDX`

`data-idx` — compact index variant used where `index` would collide.

### `DATA_SEC`

`data-sec` — section index for nav/scroll bookkeeping.

### `DATA_TIDX`

`data-tidx` — tab index variant for nested tab groups.

### `DATA_COL`

`data-col` — column index for grid/mosaic cell bookkeeping.

### `DATA_MIDX`

`data-midx` — media index inside a figure's media list.

### `DATA_SIZE`

`data-size` — size variant marker on sized media items.

### `DATA_ACTION`

`data-action` — action name bound by CMS/editor buttons.

### `DATA_FIELD`

`data-field` — field binding name in CMS editor inputs.

### `DATA_DIM_IDX`

`data-dim-idx` — dimension index for multi-size media entries.

### `DATA_PROP`

`data-prop` — property binding name in CMS property editors.

### `DATA_THEME`

`data-theme` — theme value marker on theme picker buttons.

### `DATA_CONTENT`

`data-content` — marker stamped on BaseComponent's persistent shadow content wrapper; reused to find the wrapper across re-mounts.

### `DATA_CAROUSEL_IDX`

`data-carousel-idx` — slide index inside carousel tracks.

### `DATA_SEC_IDX`

`data-sec-idx` — section index variant for multi-section views.

### `DATA_PARAM`

`data-param` — parameter name bound by playground controls.

### `DATA_CHECK`

`data-check` — checkbox binding marker in preference editors.

### `DATA_APP_WRAPPER`

`data-app-wrapper` — marks the top-level app wrapper element.

### `DATA_PATH`

`data-path` — manifest path stamped on docs tree/grid buttons.

### `DATA_WIRED`

Marks a docs-content box whose delegated link handler is attached.
