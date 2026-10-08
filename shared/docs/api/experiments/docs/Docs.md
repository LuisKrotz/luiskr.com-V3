# `experiments/docs/Docs.tsx`

&lt;view-docs&gt; — the English-only docs portal route.

| | |
|---|---|
| **Source** | `src/experiments/docs/Docs.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `ViewDocs`

The ViewDocs — docs portal route element.

### `docsPath`

Current '/docs/<path>' suffix from the route param.

### `node`

Resolved manifest node for docsPath (null at the portal root).

### `filePayload`

Open file payload state.

### `fileLoading`

File fetch in flight.

### (module scope)

Dirs the treeview shows expanded.

### `navOpen`

Mobile nav-panel open state (the tree collapses under a toggle <1024).

### (module scope)

Path whose tree/grid button regains focus after the next re-render —
arrow-key expand/collapse re-creates the DOM, so focus would
otherwise drop to the body.

### (module scope)

Document-level istanbul key-nav disposer while a report is open.

### `rootsAsNodes`

Manifest roots reshaped as dir-nodes for the treeview.

### `generatedAt`

ISO generated stamp shown under the title.

### `isDirOpen`

Whether a dir path is expanded in the treeview.

### `isProtectedView`

Whether the open file sits under a protected source-module root.

### (module scope)

Localized toast copy for the copy guard — componentText already English-falls-back.

### `navigateDocs`

Navigates within the portal — a bare path resolves against /docs.
- `@param` subPath Manifest-relative path ('' → portal root).

### `pickNode`

Grid/tree click — dirs toggle expansion AND navigate so the grid lands
on the folder; files navigate straight to their file route.

### `pickTreeNode`

Tree-row click — clicking an already-expanded dir collapses it (and,
when the viewer sits inside that folder, navigates back to its parent
so the page state matches the collapsed tree); a closed dir expands
and navigates; files navigate.

### `closeFile`

Back button — navigates to the file's parent folder (or the root).

### `toggleNav`

Mobile "browse" toggle — shows/hides the tree panel on small screens.

### `toggleDir`

Expands or collapses a dir in place (keyboard left/right) without navigating.

### (module scope)

Visible tree buttons in DOM order — the arrow-key cursor space for
the treeview pattern (only rendered rows exist, so collapsed
subtrees are naturally skipped).

### `onTreeKey`

ARIA treeview keys on the nav: ↑/↓ move between visible rows, → opens
a closed dir (or descends into an open one), ← closes an open dir (or
focuses the parent). Enter/Space stay native button activation.

### `onGridKey`

Arrow-key roving on the folder grid — ←/→/↑/↓ step between cards in
DOM order (the grid's column count is layout-derived, so linear
traversal is the robust choice on every breakpoint).

### `onViewKey`

Host-level keys — Escape backs out of the open file (or closes the
mobile nav panel) without leaving the portal.

### `onCrumbKey`

Editable-breadcrumb commit — Enter navigates to the typed path,
Escape restores the input to the live path.

### `onRouteParamChange`

Same-tag navigation (file → sibling): resolves the new path without
tearing down GL/observability state.

### (module scope)

Lifecycle: store sub + path resolution + guards.

### (module scope)

Lifecycle: (re)mounts the GL strip, scene and viewer content.

### (module scope)

Mounts/remounts the 3D scene on the given canvas. `onLost` marks the
canvas with the scene-off class and clears the handle so a later
`webglcontextrestored` can rebuild it — the portal stays usable the
whole time.

### (module scope)

`webglcontextrestored` handler — rebuilds the scene on the fresh context.

### (module scope)

Lifecycle: disposes guard + GL surfaces.

### (module scope)

Applies a docsPath: resolves the manifest node, auto-expands the
ancestor dirs in the treeview, syncs the page title + JSON-LD graph
(BreadcrumbList + TechArticle/CollectionPage) so every /docs/* route
is crawlable, and kicks the lazy file fetch.

### (module scope)

Lazy file payload fetch → state → innerHTML paint in onUpdated.

### (module scope)

Paints the open payload — media data-URL for images, rendered HTML
for everything else (markdown, JSON trees, sanitized html reports,
code blocks). innerHTML (not the JSX sanitizer) because payloads are
build-time generated markup that needs <pre>/<table>/<style> intact.

### (module scope)

Intercepts anchor clicks inside painted payload HTML — relative links
inside reports (istanbul `../index.html`, sibling file pages) resolve
against the current /docs route and stay inside the SPA; hash and
external links pass through untouched.

### (module scope)

JSX template — lives in render.tsx.
