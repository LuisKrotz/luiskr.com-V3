# `website/views/project/Project.tsx`

&lt;view-project&gt; — the portfolio detail route: hero cover,

| | |
|---|---|
| **Source** | `src/website/views/project/Project.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

View-local type re-exports — canonical definitions + docs live in ./types.js.

### `ViewProject`

The ViewProject — project class.

### `modal`

The store's modal descriptor.

### (module scope)

Lifecycle: loads project data and binds observers.

### (module scope)

Lifecycle: tears down listeners + WebGL close widget.

### `updateRobotsMeta`

Toggles the noindex meta for draft/hidden projects.

### `sectionItemHeight`

Reserves a section's media height BEFORE the carousel mounts: the
same formula the carousel uses — first item's aspect ratio × 100vw,
capped at the skeleton height — emitted as a CSS `min()` into
--carousel-item-height, so the description text below never shifts
when the real carousel takes over.

### `onRouteParamChange`

Router hook — project→project navigations reload data without remounting.

### (module scope)

Re-syncs modal DOM + reloads on locale change.

### `_updateModalDOM`

Syncs the expand dialog imperatively (store → DOM, no re-render —
re-rendering would destroy every mounted carousel). See
project/modal-dom.tsx.

### `initProject`

Initializes the resolved project record for the current route.

### `loadData`

Fetches the project node for the route's slug via SWR (optionally deferred).

### `textDelay`

Per-character delay that makes the whole text block land in a fixed
1500ms budget: delay = 1500ms ÷ totalChars (via calcDrawTextDelay),
so a 3-word heading and a 300-char paragraph animate in the same
window — long copy gets fast chars, short copy gets deliberate ones.

### `textOffset`

Cumulative start offset for the idx-th paragraph: sums the character
count of every preceding paragraph × the shared per-char delay, so
paragraph N starts exactly when N−1 finishes — the block reads as
one continuous type-in across <h3>/<p> boundaries.

### `isLandscapeGroup`

Whether a media group renders in landscape layout.

### `checkAutoOpenModal`

Deep-link opener: /portfolio/<project>/<media-slug> URLs (written by
MediaFigure.openModal) resolve the slug against every media item's
label and open that item in the expand modal — refresh/share of an
expanded image lands back on the expanded view.

### `_bindCarousels`

Initializes the section carousels after render.

### (module scope)

JSX template for the view's shadow DOM.

### (module scope)

Lifecycle: re-binds carousels/modal after re-render.
