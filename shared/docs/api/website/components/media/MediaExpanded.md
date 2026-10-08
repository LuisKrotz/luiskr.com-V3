# `website/components/media/MediaExpanded.tsx`

&lt;media-expanded&gt; — full-screen media viewer inside the

| | |
|---|---|
| **Source** | `src/website/components/media/MediaExpanded.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `MediaExpanded`

The MediaExpanded — expanded class.

### `source`

Full-res media URL (from the source attribute).

### `thumb`

Low-res thumbnail URL shown while the full asset loads.

### `alt`

Alt text for the media.

### `mediaWidth`

Natural media width attribute.

### `mediaHeight`

Natural media height attribute.

### `isVideo`

Whether the source is a video.

### `placeholder`

Placeholder box style while the full asset loads.

### `startClose`

Dismissal sequence — CSS zoom-out, then URL/dialog/scroll teardown (see expanded-close.ts).

### (module scope)

JSX template (see expanded-render.tsx).
