# `experiments/docs/coverage-nav.ts`

Istanbul coverage-report interactivity for the docs viewer.

| | |
|---|---|
| **Source** | `src/experiments/docs/coverage-nav.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `NEXT_KEYS`

istanbul "next uncovered block" keys.

### `PREV_KEYS`

istanbul "previous uncovered block" keys.

### `wireFileSearch`

Clones istanbul's `filterTemplate` into the report header and wires its
`fileSearch` input: valid regex input filters rows by regex, otherwise
a case-insensitive substring match — mirroring `sorter.js`'s
`onFilterInput`. Scoped to `box` because the report lives in a shadow
root (document.getElementById can't reach it).
- `@param` box Painted `.docs-content` element.
- `@param` body The summary table body whose rows get filtered.
- `@returns` The created input, or null when no template/table exists.

### `wireSorting`

Re-implements istanbul's `sorter.js`: reads `th[data-col]` columns,
makes the sortable ones clickable (a `span.sorter` marker plus
sorted/sorted-desc header classes), and reorders `tbody tr` rows by
their `td[data-value]` cells — numeric compare for `data-type="number"`
columns, which default to descending like the stock report.
- `@param` box Painted `.docs-content` element.
- `@returns` Disposer for the column click listeners, or null without a table.

### `attachCoverageNav`

Wires the istanbul report contract when `box` holds a coverage report.
- `@param` box The `.docs-content` element whose innerHTML was just painted.
- `@returns` Disposer removing all listeners, or null when the payload
