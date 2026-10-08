# `website/components/media/expanded/mount.ts`

Mount wiring for &lt;media-expanded&gt;: scroll reset, Escape /

| | |
|---|---|
| **Source** | `src/website/components/media/expanded/mount.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `loadFullRes`

Full-res pipeline: thumb paints instantly → the disk-cached blob is
fetched → WASM threads attempt a decode (pre-warms the frame) → a
detached Image confirms load → the visible <img> swaps to the blob
URL (no second network trip, instant paint). GPU upload only runs when
the WASM decode produced no bitmap. Error path still swaps the src —
the browser shows the broken-image state rather than pinning the thumb.

### `mountMediaExpanded`

Mount lifecycle: listeners, close button, telemetry, media pipeline.
