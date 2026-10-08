# `core/tokens/selectors/docs.ts`

Docs-portal query-selector tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/selectors/docs.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DOCS_SELECTORS`

Frozen docs selector map — sole declaration site for these tokens;
consumers read members and never re-declare the strings
(zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.

### `UNCOVERED`

Istanbul uncovered-block markers — the coverage-report key nav.

### `COV_TABLE`

Istanbul report table — sortable coverage-summary on index pages.

### `COV_TEMPLATE`

Istanbul filter-input template cloned into the report header.

### `COV_SEARCH`

Istanbul file-search input created from the filter template.

### `COV_SORTER`

Istanbul sort-arrow span appended to sortable column headers.

### `COV_HIGHLIGHT`

Istanbul "block under cursor" class toggled by the key nav.

### `COV_SORTED`

Istanbul sorted-column indicator classes.

### `COV_DATA_COL`

Istanbul th/td data attributes driving the sort wiring.

### `CONTENT_LINK`

Anchors inside painted payload HTML — internal links reroute.
