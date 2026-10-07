/**
 * @file media-load.ts
 * @description Media URL matrix + progressive loading for <media-figure>:
 * CDN variant resolution (poster/mp4 tiers, thumb vs Q50 high-res), the
 * zero-CLS SVG placeholder data-URI, and the detached-preload swap that
 * fades the high-res image in over the thumb.
 */

import { MEDIA_CLASSES } from '@/core/tokens/classes/media.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { IMAGE_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import { MEDIA } from '@/core/tokens/media/suffixes.js'
import { SVG_STRINGS } from '@/core/tokens/strings/svg.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import store from '@/core/store.js'
import { gpuAccel } from '@/utils/gpu/gpu-accel.js'
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
 * Inline SVG placeholder — a URL-encoded empty <svg> with the media's
 * real viewBox. Browsers stretch an empty SVG to its intrinsic ratio,
 * so the layout box reserves the exact aspect before any bytes arrive
 * (zero-CLS without shipping a real image).
 */
export function mediaPlaceholder(w: number, h: number): string {
  return `${SVG_STRINGS.SVG_DATA_URI_PREFIX}%3Csvg xmlns="${SVG_STRINGS.SVG_XMLNS}" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`
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
    return
  }

  const storage = store.getters.getStorage()

  const targetUrl = storage + fig.mediaSrc + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT

  fig.highResSrc = targetUrl

  const highEl = fig.$<HTMLImageElement>(`.${MEDIA_CLASSES.RENDER_MEDIA_HIGH}`)

  const finish = () => {
    fig.isLoaded = true

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
  }
}
