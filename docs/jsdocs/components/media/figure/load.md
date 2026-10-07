# `components/media/figure/load.ts`

Media URL matrix + progressive loading for &lt;media-figure&gt;:

| | |
|---|---|
| **Source** | `src/components/media/figure/load.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `resolveMediaSources`

Builds the media's CDN URL matrix on init: [poster, mp4] per tier for
videos (full size + VIDEO_SCALE'd fallback — the browser picks the
first playable <source>), or the thumb URL for images.

### `mediaPlaceholder`

Inline SVG placeholder — a URL-encoded empty <svg> with the media's
real viewBox. Browsers stretch an empty SVG to its intrinsic ratio,
so the layout box reserves the exact aspect before any bytes arrive
(zero-CLS without shipping a real image).

### (module scope)

Thumb → high-res swap. A detached Image preloads the Q50 variant;
on load the visible element swaps src + gets the loaded class (the
CSS crossfade) and the thumb hides. The 4096²-pixel budget caps decode
memory without rejecting tall, narrow full-page screenshots solely because
one dimension exceeds 4096px. Errors mark loaded anyway — a broken image
must not pin the skeleton shimmer forever.
