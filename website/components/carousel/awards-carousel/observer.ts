/**
 * @file awards-carousel/observer.ts — visibility gate for autoplay +
 * in-view styling, resize refits, and keyboard/AT exclusion for clones.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import type { AwardsCarousel } from '../AwardsCarousel.js'

/**
 * Autoplay only runs while ≥50% of the carousel is on screen
 * (threshold [0, 0.5] gives a clean two-state signal); below that or
 * under reduced-motion it pauses — offscreen animation would burn
 * frames the user can't see. When IntersectionObserver itself is
 * absent (very old engines, some test DOMs) the carousel degrades to
 * always-visible so content still shows.
 * @param host The AwardsCarousel element.
 */
export function setupObserver(host: AwardsCarousel): void {
  const root = host.$(`.${AWC_CLASSES.AWC}`)
  if (!root) return

  if (typeof IntersectionObserver === TYPE_STRINGS.UNDEFINED) {
    host.isFullyVisible = true
    host.isEnteredViewport = true
    root.classList.add(AWC_CLASSES.AWC_IN_VIEW)
    if (!store.getters.getReducedMotion()) host._startAutoplay()
    return
  }

  if (host.observer) {
    host.observer.disconnect()
    host.observer = null
  }

  host.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          host.isEnteredViewport = true
          root.classList.add(AWC_CLASSES.AWC_IN_VIEW)
        }
        const isFullyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5
        host.isFullyVisible = isFullyVisible

        if (isFullyVisible) {
          if (!store.getters.getReducedMotion() && !store.getters.getModal()?.open) {
            host._startAutoplay()
          }
        } else {
          host._stopAutoplay()
        }
      })
    },
    { threshold: [0, 0.5] }
  )
  host.observer.observe(host)
}

/**
 * Refits on container resize — instant re-jump to the current index since
 * slide geometry changed; smooth scroll would animate to a stale offset.
 * @param host The AwardsCarousel element.
 */
export function onResize(host: AwardsCarousel): void {
  host._jumpToSlide(host.currentIndex, false)
}

/**
 * Keyboard/AT exclusion for clone slides: they're visual duplicates
 * that exist only for the loop illusion, so every focusable inside
 * them is tabindex−1 + aria-hidden — tab order and screen readers
 * traverse the real slides exactly once. Re-run after every render since
 * clones are re-created with the DOM.
 * @param host The AwardsCarousel element.
 */
export function disableClonesFocus(host: AwardsCarousel): void {
  const clones = host.$$(`.${AWC_CLASSES.AWC_SLIDE_CLONE}`)
  clones.forEach((clone) => {
    clone.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
      el.setAttribute(ARIA_ATTRS.TABINDEX, ATTR_VALUES.NEGATIVE_TABINDEX)
      el.setAttribute(ARIA_ATTRS.ARIA_HIDDEN, ATTR_VALUES.TRUE)
    })
  })
}
