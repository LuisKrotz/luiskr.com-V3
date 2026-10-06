/**
 * @file safari/patches/media-figure/image-load.ts
 * @description Safari image-loading overrides for MediaFigure: a
 * loadHighRes that requests the Q50 (medium) variant instead of the
 * uncompressed source — iOS Safari hard-fails canvas/decode on images
 * above ~4096px and the Q100 asset frequently exceeds texture memory —
 * and the lazy-thumbnail / img-observer wiring for non-hero images.
 */

import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { MEDIA_ATTRS } from '@/core/tokens/attrs/media.js'
import { MEDIA_CLASSES } from '@/core/tokens/classes/media.js'
import { MEDIA } from '@/core/tokens/media/suffixes.js'
import { QUERY_STRINGS } from '@/core/tokens/strings/queries.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import store from '@/core/store.js'
import type { SafariPatchableEl } from '../../types.js'

/**
 * Safari loadHighRes: requests the Q50 (medium) variant instead of the
 * uncompressed source — iOS Safari hard-fails canvas/decode on images
 * above ~4096px and the Q100 asset frequently exceeds texture memory.
 */
export function safariLoadHighRes(el: SafariPatchableEl): void {
  if (el.isVideo || el.isLoaded) return

  const height = el.mediaHeight || 0

  const width = el.mediaWidth || 0

  // 4096px is the practical WebKit image-decode ceiling; beyond it the
  // request is skipped entirely and the thumb stays visible.
  if (height > 4096 || width > 4096) {
    return
  }

  const storage = store.getters.getStorage()

  const targetUrl = storage + el.mediaSrc + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT

  el.highResSrc = targetUrl

  const highEl = el.$(`.${MEDIA_CLASSES.RENDER_MEDIA_HIGH}`) as HTMLImageElement | null

  if (highEl) {
    highEl.src = targetUrl

    const onFinish = () => {
      el.isLoaded = true

      highEl.classList.add(MEDIA_CLASSES.RENDER_MEDIA_LOADED)

      const thumbEl = el.$(`.${MEDIA_CLASSES.RENDER_MEDIA_THUMB}`)

      if (thumbEl) {
        thumbEl.style.display = ATTR_VALUES.NONE
      }
    }

    if (highEl.complete && highEl.naturalWidth > 0) {
      onFinish()
    } else {
      highEl.onload = () => {
        onFinish()
      }

      highEl.onerror = () => {
        el.isLoaded = true
      }
    }
  } else if (el._isMounted) {
    el.isLoaded = true

    el._updateDom()
  }
}

/**
 * Lazy-thumbnail + img-observer wiring for non-hero images: the thumb
 * defers via loading=lazy and the Q50 swap triggers once the figure
 * scrolls within ROOT_MARGIN_50 of the viewport.
 */
export function bindSafariImageLoad(
  el: SafariPatchableEl,
  fig: Element | null,
  isHero: boolean
): void {
  const thumb = el.$(`.${MEDIA_CLASSES.RENDER_MEDIA_THUMB}`) as HTMLImageElement | null

  if (thumb && !isHero) {
    thumb.setAttribute('loading', MEDIA_ATTRS.LOADING_LAZY)
  }

  if (isHero) {
    el.loadHighRes?.()
  }

  if (el.isVideo || el.isLoaded || isHero) return

  const target = (fig || el) as HTMLElement

  if (typeof IntersectionObserver === TYPE_STRINGS.UNDEFINED) return

  if (el.imgObserver) {
    el.imgObserver.disconnect()
  }

  el.imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !el.isLoaded) {
          el.loadHighRes?.()

          if (el.imgObserver) {
            el.imgObserver.disconnect()

            el.imgObserver = null
          }
        }
      })
    },
    { rootMargin: QUERY_STRINGS.ROOT_MARGIN_50, threshold: 0.01 }
  )

  el.imgObserver.observe(target)
}
