# `website/components/media/figure/video.ts`

Video playback plumbing for &lt;media-figure&gt;: lazy &lt;source&gt;

| | |
|---|---|
| **Source** | `src/website/components/media/figure/video.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `ensureVideoSource`

Sets the <source> src on a video element when it becomes playable.

### `playVideo`

Starts muted playback honoring reduced-motion/autoplay prefs.

### `pauseVideo`

Pauses playback (offscreen or pref change).

### `syncVideoPlayback`

Store change → start/stop playback to match autoplay + visibility.
