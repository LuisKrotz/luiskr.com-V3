/**
 * @file media/media-mount.ts
 * @description Mount lifecycle for MediaFigure — GPU-layer promotion, store subscription, expand-click binding, hover-to-play video wiring with IntersectionObserver gating, and the img-observer that triggers lazy loadHighRes.
 */

import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { MEDIA_CLASSES } from '@core/tokens/classes/media.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MEDIA_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { QUERY_STRINGS } from '@core/tokens/strings/queries.js'
import store from '@core/store.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import type { MediaFigure } from '../MediaFigure.js'
import { VIDEO_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/**
 * Mounts media figure.
 * @param c — the component
 */
export function mountMediaFigure(c: MediaFigure): void {
  gpuAccel.accelerateElementGPU(c)

  c.subscribe(store)

  if (c.classes) {
    c.classes.split(/\s+/).forEach((cls) => {
      if (cls) c.classList.add(cls)
    })
  }

  const fig = c.$<HTMLElement>(HTML_TAGS.FIGURE)

  if (fig && c.canExpand) {
    c.addScopedListener(fig, MOUSE_EVENTS.CLICK, () => c.openModal())
  }

  if (c.isVideo) {
    const isReduced = store.getters.getReducedMotion()

    const vid = c.$<HTMLVideoElement>(HTML_TAGS.VIDEO)

    if (vid) {
      const videoPlayEvents = [
        MOUSE_EVENTS.MOUSEENTER,
        MOUSE_EVENTS.MOUSEOVER,
        MOUSE_EVENTS.MOUSEDOWN,
      ]
      const videoPauseEvents = [MOUSE_EVENTS.MOUSELEAVE, MOUSE_EVENTS.MOUSEOUT]

      for (const evt of videoPlayEvents) {
        c.addScopedListener(vid, evt, (e) =>
          c.playVideo((e as Event).target as HTMLVideoElement | null)
        )
      }

      for (const evt of videoPauseEvents) {
        c.addScopedListener(vid, evt, (e) =>
          c.pauseVideo((e as Event).target as HTMLVideoElement | null)
        )
      }

      c.addScopedListener(vid, MEDIA_EVENTS.LOADEDDATA, (e) => {
        // First frame decoded — terminal state, the loading shimmer releases.
        c.classList.add(MEDIA_CLASSES.MEDIA_FIGURE_LOADED)

        gpuAccel.processVideoGPU(
          (e as Event).target as HTMLVideoElement | null,
          c.displayWidth || VIDEO_DIMENSIONS.VIDEO_DEFAULT_WIDTH,
          c.displayHeight || VIDEO_DIMENSIONS.VIDEO_DEFAULT_HEIGHT
        )
      })

      c.addScopedListener(vid, WINDOW_EVENTS.ERROR, (e) => {
        // Video failed — terminal state, the loading shimmer releases.
        c.classList.add(MEDIA_CLASSES.MEDIA_FIGURE_LOADED)

        const el = (e as Event).target as HTMLElement | null

        if (el?.hasAttribute(MEDIA_ATTRS.POSTER)) {
          el.removeAttribute(MEDIA_ATTRS.POSTER)
        }
      })

      if (!isReduced) {
        // Viewport-gated playback: sources are only attached once the
        // video is ≥15% visible (saves bandwidth on below-fold media),
        // and leaving the viewport pauses it — no offscreen decode.
        c.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              c.isIntersecting = entry.isIntersecting

              if (entry.isIntersecting) {
                c._ensureVideoSource(vid)

                if (store.getters.getVideoAutoplay() && vid.paused) {
                  vid.play().catch(() => {})
                }
              } else {
                if (!vid.paused) {
                  vid.pause()
                }
              }
            })
          },
          { threshold: 0.15 }
        )

        c.observer.observe(vid)
      }
    }
  } else {
    const highImg = c.$(`.${MEDIA_CLASSES.RENDER_MEDIA_HIGH}`) || c.$(HTML_TAGS.FIGURE)

    if (highImg) {
      // Progressive enhancement: 100px rootMargin starts the high-res
      // fetch just before the card scrolls into view — by the time the
      // user sees it, the thumb→high-res swap has usually completed.
      // One-shot: disconnects after the first load.
      c.imgObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !c.isLoaded) {
              c.loadHighRes()

              if (c.imgObserver) {
                c.imgObserver.disconnect()

                c.imgObserver = null
              }
            }
          })
        },
        { rootMargin: QUERY_STRINGS.ROOT_MARGIN_100, threshold: 0.01 }
      )

      c.imgObserver.observe(highImg)
    }
  }
}
