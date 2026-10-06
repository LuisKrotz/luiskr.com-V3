/**
 * @file safari/patches/media-figure/video.ts
 * @description Safari video block of the MediaFigure onMounted patch:
 * force-muted autoplay attributes, the half-resolution scaledown variant
 * on mobile/narrow WebKit (iOS memory + cellular data), a first-touch
 * unlock retry for rejected autoplay, and the IntersectionObserver that
 * plays in view / pauses off view.
 */

import { MEDIA_ATTRS } from '@/core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { TOUCH_EVENTS } from '@/core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import store from '@/core/store.js'
import type { SafariPatchableEl } from '../../types.js'

/** Wires the Safari video autoplay + visibility observer for a video figure. */
export function patchSafariVideo(
  el: SafariPatchableEl,
  vid: HTMLVideoElement,
  fig: Element | null,
  isHero: boolean
): void {
  vid.defaultMuted = true

  vid.muted = true

  vid.setAttribute(MEDIA_ATTRS.MUTED, ATTR_VALUES.EMPTY)

  vid.setAttribute(MEDIA_ATTRS.PLAYSINLINE, ATTR_VALUES.EMPTY)

  vid.setAttribute(MEDIA_ATTRS.WEBKIT_PLAYSINLINE, ATTR_VALUES.EMPTY)

  vid.setAttribute(MEDIA_ATTRS.AUTOPLAY, ATTR_VALUES.EMPTY)

  vid.autoplay = true

  // Mobile Safari (or a narrow viewport on any WebKit) prefers the
  // half-resolution scaledown variant — video[1] in the DB's
  // [full, scaled] pair — to keep decode+playback inside iOS memory
  // limits and reduce data over cellular.
  const isMobileSafari =
    typeof window !== TYPE_STRINGS.UNDEFINED &&
    (window.innerWidth <= 960 || /iPhone|iPad|iPod/i.test(navigator.userAgent))

  if (isMobileSafari && el.video && el.video.length >= 2) {
    const scaledSrc = el.video[1]

    if (scaledSrc) {
      const srcEl = vid.querySelector(MEDIA_ATTRS.SOURCE) as HTMLSourceElement | null

      if (srcEl && srcEl.src !== scaledSrc) {
        srcEl.src = scaledSrc
      }
    }
  }

  const startPlay = () => {
    if (store.getters.getReducedMotion() || !store.getters.getVideoAutoplay()) return

    vid.defaultMuted = true

    vid.muted = true

    vid.setAttribute(MEDIA_ATTRS.AUTOPLAY, ATTR_VALUES.EMPTY)

    vid.autoplay = true

    const doPlay = () => {
      if (store.getters.getReducedMotion() || !store.getters.getVideoAutoplay()) return

      const p = vid.play()

      // iOS may still reject autoplay (Low Power Mode, data saver);
      // the fallback re-attempts play() on the user's first touch —
      // a gesture unlocks media playback.
      if (p && typeof p.catch === TYPE_STRINGS.FUNCTION) {
        p.catch(() => {
          const onFirstTouch = () => {
            if (store.getters.getVideoAutoplay()) {
              vid.play().catch(() => {})
            }
          }

          window.addEventListener(TOUCH_EVENTS.TOUCHSTART, onFirstTouch, {
            once: true,
            passive: true,
          })
        })
      }
    }

    // readyState ≥ 2 (HAVE_CURRENT_DATA) means a frame is buffered
    // and play() can resolve; otherwise wait for 'canplay' once —
    // and kick load() if the element hasn't even started (0).
    if (vid.readyState >= 2) {
      doPlay()
    } else {
      const onCanPlay = () => {
        vid.removeEventListener('canplay', onCanPlay)

        doPlay()
      }

      vid.addEventListener('canplay', onCanPlay, { once: true })

      if (vid.readyState === 0) {
        vid.load()
      }
    }
  }

  if (isHero) {
    startPlay()
  }

  if (el.observer) {
    el.observer.disconnect()

    el.observer = null
  }

  if (typeof IntersectionObserver !== TYPE_STRINGS.UNDEFINED) {
    el.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          el.isIntersecting = entry.isIntersecting

          if (entry.isIntersecting) {
            if (vid.paused) {
              startPlay()
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

    el.observer.observe(fig || vid)
  }
}
