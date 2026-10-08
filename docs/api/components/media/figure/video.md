# `components/media/figure/video.ts`

Video playback plumbing for &lt;media-figure&gt;: lazy &lt;source&gt;

| | |
|---|---|
| **Source** | `website/components/media/figure/video.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `ensureVideoSource`

Sets the <source> src on a video element when it becomes playable.

### `playVideo`

Starts muted playback honoring reduced-motion/autoplay prefs.

### `pauseVideo`

Pauses playback (offscreen or pref change).

### `syncVideoPlayback`

Store change → start/stop playback to match autoplay + visibility.
