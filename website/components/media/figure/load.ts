/**
 * @file media-load.ts
 * @description Media URL matrix + progressive loading for <media-figure>:
 * CDN variant resolution (poster/mp4 tiers, thumb vs Q50 high-res), the
 * zero-CLS SVG placeholder data-URI, and the detached-preload swap that
 * fades the high-res image in over the thumb.
 */

import { MEDIA_CLASSES } from '@core/tokens/classes/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { IMAGE_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { MEDIA } from '@core/tokens/media/suffixes.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import { svgPlaceholder } from '@core/utils/dom.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import type { MediaFigure } from '../MediaFigure.js'

/**
 * Builds the media's CDN URL matrix on init: [poster, mp4] per tier for
 * videos (full size + VIDEO_SCALE'd fallback — the browser picks the
 * first playable <source>), or the thumb URL for images.
 */
export function resolveMediaSources(fig: MediaFigure): void {
  if (fig.classes) {
    fig.classes.split(/\s+/).forEach((cls) => {
      if (cls) fig.classList.add(cls)
    })
  }

  const storage = store.getters.getStorage()

  if (fig.isVideo) {
    const base = storage + fig.mediaSrc

    const urls = [
      [base + MEDIA.VIDEO_THUMB_EXT, base + MEDIA.VIDEO_EXT],
      [
        base + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_THUMB_EXT,
        base + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_EXT,
      ],
    ]

    fig.poster = urls.map((a) => a[0])

    fig.video = urls.map((a) => a[1])
  } else {
    fig.thumbSrc = storage + fig.mediaSrc + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT
  }
}

/**
 * Inline SVG placeholder — a URL-encoded empty <svg> carrying the media's
 * real width/height (definite intrinsic size) plus the viewBox aspect.
 * The width/height attrs matter: a viewBox-only SVG is intrinsic-ratio-only
 * and the <img> would collapse to the ~300×150 default replaced size under
 * `width:auto`, so carousel placeholders keep their natural box before any
 * bytes arrive (zero-CLS without shipping a real image).
 */
export function mediaPlaceholder(w: number, h: number): string {
  return svgPlaceholder(w, h)
}

/**
 * Thumb → high-res swap. A detached Image preloads the Q50 variant;
 * on load the visible element swaps src + gets the loaded class (the
 * CSS crossfade) and the thumb hides. The 4096²-pixel budget caps decode
 * memory without rejecting tall, narrow full-page screenshots solely because
 * one dimension exceeds 4096px. Errors mark loaded anyway — a broken image
 * must not pin the skeleton shimmer forever.
 */
export async function loadHighRes(fig: MediaFigure): Promise<void> {
  if (fig.isVideo || fig.isLoaded) return

  const height = fig.mediaHeight || 0

  const width = fig.mediaWidth || 0

  if (height * width > IMAGE_DIMENSIONS.MAX_DECODE_PIXELS) {
    // Decode budget exceeded — terminal state, the loading shimmer releases.
    fig.isLoaded = true
    fig.classList.add(MEDIA_CLASSES.MEDIA_FIGURE_LOADED)

    return
  }

  const storage = store.getters.getStorage()

  const targetUrl = storage + fig.mediaSrc + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT

  fig.highResSrc = targetUrl

  const highEl = fig.$<HTMLImageElement>(`.${MEDIA_CLASSES.RENDER_MEDIA_HIGH}`)

  const finish = () => {
    fig.isLoaded = true
    fig.classList.add(MEDIA_CLASSES.MEDIA_FIGURE_LOADED)

    if (highEl) {
      highEl.src = targetUrl

      highEl.classList.add(MEDIA_CLASSES.RENDER_MEDIA_LOADED)

      const thumbEl = fig.$<HTMLElement>(`.${MEDIA_CLASSES.RENDER_MEDIA_THUMB}`)

      if (thumbEl) {
        thumbEl.style.display = ATTR_VALUES.NONE
      }
    } else if (fig._isMounted) {
      fig._updateDom()
    }
  }

  const ImageClass: typeof Image | null =
    typeof window !== TYPE_STRINGS.UNDEFINED && window.Image
      ? window.Image
      : typeof Image !== TYPE_STRINGS.UNDEFINED
        ? Image
        : null

  if (!ImageClass) {
    finish()

    return
  }

  const img = new ImageClass()

  img.src = targetUrl

  img.onload = () => {
    gpuAccel.processTextureGPU(img, fig.displayWidth, fig.displayHeight)

    finish()
  }

  img.onerror = () => {
    fig.isLoaded = true
    fig.classList.add(MEDIA_CLASSES.MEDIA_FIGURE_LOADED)
  }
}
