# `cms/media-convert/files.ts`

| | |
|---|---|
| **Source** | `src/cms/media-convert/files.ts` |
| **UX surface** | Batch image→WebP conversion pipeline UI. |

## Members

### (module scope)

Recursive async generator over a dropped FileSystemEntry — a folder
drop yields one {file, rel} per descendant, preserving the relative
path so the server rebuilds the same tree inside the ZIP. Directory
readers return entries in batches of ≤100, so the do/while drains
until an empty batch signals the end.

### `fmtBytes`

Humanizes a byte count — MB above 1MB (1 decimal), KB below (min 1KB so 0-byte files don't print "0 KB").

### (module scope)

collects drop.

### `collectInput`

collects input.
- `@param` host — the host component
- `@param` input — the value
