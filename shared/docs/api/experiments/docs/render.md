# `experiments/docs/render.tsx`

JSX template for &lt;view-docs&gt; — extracted from Docs.tsx.

| | |
|---|---|
| **Source** | `src/experiments/docs/render.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `treeNodes`

Recursive tree rows — each node renders a <li> with a button (dirs
toggle open AND navigate; files navigate). Children render inside a
nested <ul> only while the dir is in the host's open-set — per the
self-similar recursion rule the tree walks itself.

### `gridCards`

Grid cards — dirs and files get the generated folder SVG and navigate
into/open the node on click.

### `crumbBar`

Editable breadcrumb strip — each crumb is a jump-to link; the trailing
input carries the full relative path and commits on Enter (Escape
restores the current path).

### `renderDocs`

The docs template — assembled for ViewDocs.render().
