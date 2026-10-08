/**
 * @file media-video.ts
 * @description Video playback plumbing for <media-figure>: lazy <source>
 * injection when a video first becomes playable, pref-aware play/pause,
 * GPU post-process handoff, and the store-update sync that starts/stops
 * playback on autoplay/reduced-motion changes.
 */

import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import store from '@core/store.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import type { MediaFigure } from '../MediaFigure.js'
import { VIDEO_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/** Sets the <source> src on a video element when it becomes playable. */
export function ensureVideoSource(fig: MediaFigure, vid: HTMLVideoElement | null): void {
  if (!vid || vid.querySelector(MEDIA_ATTRS.SOURCE)) return

  const src1 = document.createElement(MEDIA_ATTRS.SOURCE) as HTMLSourceElement

  src1.src = fig.videoSrcMain

  src1.type = MEDIA_ATTRS.VIDEO_MP4

  vid.appendChild(src1)

  if (fig.videoSrcFallback) {
    const src2 = document.createElement(MEDIA_ATTRS.SOURCE) as HTMLSourceElement

    src2.src = fig.videoSrcFallback

    src2.type = MEDIA_ATTRS.VIDEO_MP4

    vid.appendChild(src2)
  }

  vid.load()
}

/** Starts muted playback honoring reduced-motion/autoplay prefs. */
export function playVideo(fig: MediaFigure, target: HTMLVideoElement | null): void {
  if (!store.getters.getReducedMotion() && store.getters.getVideoAutoplay() && target?.play) {
    fig._ensureVideoSource(target)

    target
      .play()
      .then(() => {
        gpuAccel.processVideoGPU(
          target,
          fig.displayWidth || VIDEO_DIMENSIONS.VIDEO_DEFAULT_WIDTH,
          fig.displayHeight || VIDEO_DIMENSIONS.VIDEO_DEFAULT_HEIGHT
        )
      })
      .catch(() => {})
  }
}

/** Pauses playback (offscreen or pref change). */
export function pauseVideo(fig: MediaFigure, target: HTMLVideoElement | null): void {
  if (!store.getters.getReducedMotion() && target?.pause) {
    target.pause()
  }
}

/** Store change → start/stop playback to match autoplay + visibility. */
export function syncVideoPlayback(fig: MediaFigure): void {
  if (!fig.isVideo) return

  const vid = fig.$<HTMLVideoElement>(HTML_TAGS.VIDEO)

  if (!vid) return

  if (!store.getters.getVideoAutoplay()) {
    if (!vid.paused) {
      vid.pause()
    }
  } else if (fig.isIntersecting && vid.paused && !store.getters.getReducedMotion()) {
    fig._ensureVideoSource(vid)

    vid.play().catch(() => {})
  }
}
