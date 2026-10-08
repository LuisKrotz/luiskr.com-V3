# `experiments/docs/manifest.ts`

Build-time docs manifest access + path resolution.

| | |
|---|---|
| **Source** | `src/experiments/docs/manifest.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

One manifest node — dir carries children, file carries format/size/id.

### (module scope)

A publishable root bucket (docs / reports / coverage / src).

### (module scope)

Manifest object emitted by the vite plugin.

### (module scope)

Rendered payload returned by /docs-content/<id>.json.

### `getDocsManifest`

The scanned manifest — the vite plugin + jest stub always emit one.

### `docsGeneratedAt`

ISO timestamp of the newest doc file — shown as "last docs update".

### `resolveDocsPath`

Resolves a docs sub-path ('docs/a/b.md' or bare 'a/b' against roots) to
the manifest node. Case-sensitive — the tree mirrors the real fs layout.
- `@param` docsPath Route param from /docs/<path>.
- `@returns` The node, or null when the path doesn't resolve.

### `crumbsForPath`

Breadcrumb segments for a resolved docs path — [{label, path}] from the
portal root down to the node.
- `@param` docsPath Route param from /docs/<path>.
- `@returns` Ordered crumb trail.

### `fetchDocsFile`

Lazily fetches one rendered file payload. Ids come straight from the
manifest, so the URL is encoded segment-wise — never user-derived.
- `@param` id Manifest file id ('<root>:<relpath>').
- `@returns` Parsed payload, or null on 404/network failure.
