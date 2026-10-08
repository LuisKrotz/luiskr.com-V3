/**
 * @file awards-carousel/events.ts — dot clicks, swipe gestures, resize.
 */

import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { MOUSE_EVENTS, TOUCH_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { CAROUSEL_LAYOUT } from '@core/tokens/motion/carousel.js'
import type { AwardsCarousel } from '../AwardsCarousel.js'

/** Wires dot clicks, slide clicks and autoplay controls. */
export function bindEvents(host: AwardsCarousel): void {
  const track = host.$(`.${AWC_CLASSES.AWC_TRACK}`)

  const dots = host.$$(`.${AWC_CLASSES.AWC_DOT}`)
  dots.forEach((dot, idx) => {
    host.addScopedListener(dot, MOUSE_EVENTS.CLICK, () => host.onDotClick(idx))
  })

  if (track) {
    host.addScopedListener(
      track,
      TOUCH_EVENTS.TOUCHSTART,
      (e) => {
        host.touchStartX = (e as TouchEvent).touches[0].clientX
      },
      { passive: true }
    )
    // Swipe: the px threshold separates intentional swipes from scroll
    // jitter; sign picks direction (negative = dragged left → next).
    host.addScopedListener(
      track,
      TOUCH_EVENTS.TOUCHEND,
      (e) => {
        const delta = (e as TouchEvent).changedTouches[0].clientX - host.touchStartX
        if (Math.abs(delta) > CAROUSEL_LAYOUT.SWIPE_THRESHOLD) {
          host._stopAutoplay()
          if (delta < 0) host.goTo(host.currentIndex + 1)
          else host.goTo(host.currentIndex - 1)
        }
      },
      { passive: true }
    )
  }

  host.addScopedListener(window, WINDOW_EVENTS.RESIZE, () => host._onResize(), { passive: true })
}
