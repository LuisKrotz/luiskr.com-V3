# `cms/media-convert/CmsMediaConverter.tsx`

&lt;cms-media-converter&gt; — localhost-only batch media

| | |
|---|---|
| **Source** | `src/cms/media-convert/CmsMediaConverter.tsx` |
| **UX surface** | Batch image→WebP conversion pipeline UI. |

## Members

### (module scope)

Lifecycle: binds drop-zone + input events.

### (module scope)

Lifecycle: stops polling + revokes object URLs.

### `_stopPolling`

Clears the job-status poll interval.

### `_notify`

Fires a cms-notification toast.

### (module scope)

JSX template for the current phase (delegate — media-convert/render.tsx).
