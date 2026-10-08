# `experiments/docs/folder-svg.tsx`

Deterministic animated folder glyphs for the docs grid.

| | |
|---|---|
| **Source** | `src/experiments/docs/folder-svg.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `VIEW_BOX`

SVG viewport box shared by every generated glyph (unit-agnostic).

### `hashName`

Deterministic 32-bit-ish name hash — walks the string with a rolling
multiply-add; the modulus lives in DOCS_UNITS so the spread stays tuned.

### `ranged`

Maps a hash slice to a bounded float in [min, max].

### `thread`

Builds one animated thread path — a shallow cubic arc across the folder
body whose phase/amplitude come from the name hash. Two SMIL animations
run on it: `d` morphs the control points between the resting shape and
a mirrored wave (the "lines wave" contract — valid because both paths
share the same command structure), and `stroke-dashoffset` keeps the
dash pattern drifting slowly for an organic "breathing" feel.

### `folderSvg`

Deterministic animated folder SVG for a manifest node name.
- `@param` name Folder/file display name — hashed for the artwork.
- `@param` isDir Directory glyphs show threads; files show a folded corner.
- `@returns` The SVG subtree (JSX-created, namespaced).
