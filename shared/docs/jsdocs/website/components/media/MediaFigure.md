# `website/components/media/MediaFigure.tsx`

&lt;media-figure&gt; — the site's core media card: renders a

| | |
|---|---|
| **Source** | `src/website/components/media/MediaFigure.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `MediaFigure`

The MediaFigure — figure class.

### `canExpand`

Whether the figure may open the expand modal.

### `isVideo`

Whether the media is a video.

### `autoPlay`

Whether the video should autoplay.

### `mediaWidth`

Declared media width attribute.

### `mediaHeight`

Declared media height attribute.

### `label`

Caption label.

### `mediaSrc`

Base media path on the CDN.

### `classes`

Extra host classes passed through the attribute.

### `displayWidth`

Rendered display width. Videos are capped at FHD_WIDTH (1920): the
player can't visually exceed 1080p, so decode/GPU budgets stay
bounded even when the source is 4K. Images pass through untouched —
the CDN serves the right variant instead.

### `displayHeight`

Rendered display height — pairs with displayWidth's FHD cap:
aspect-preserving downscale via calcAspectScaled (h·(MAX/w)) so the
layout box never stretches when the video is >1080p.

### `videoSrcMain`

Primary video source URL.

### `videoSrcFallback`

Fallback (scaled) video source for constrained devices.

### `_ensureVideoSource`

Sets the <source> src on a video element when it becomes playable.

### `playVideo`

Starts muted playback honoring reduced-motion/autoplay prefs.

### `pauseVideo`

Pauses playback (offscreen or pref change).

### `placeholder`

Zero-CLS SVG placeholder data-URI at the media's aspect (see media-load.ts).

### `loadHighRes`

Thumb → high-res preload swap (see media-load.ts).

### `slugify`

Slugifies a caption for the alt/ARIA text.

### `openModal`

Opens the expand modal with this media's descriptor via the store.

### (module scope)

JSX template — a layered stack the CSS crossfades:
  1. placeholder <img>  SVG data-URI at exact aspect (zero-CLS)
  2. thumb <img>        instant low-res paint
  3. high-res <img>     fades in over the thumb once decoded
  video path replaces 2+3 with a muted looping <video>
Expand affordance renders as two buttons: a visible labelled one and
a full-cover aria-hidden layer that catches clicks anywhere on media.
