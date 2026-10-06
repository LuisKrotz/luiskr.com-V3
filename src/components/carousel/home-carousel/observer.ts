/**
 * @file home-carousel/observer.ts — visibility gate for autoplay +
 * in-view styling, resize refits, and keyboard/AT exclusion for clones.
 */

import { ARIA_ATTRS } from '@/core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { HC_CLASSES } from '@/core/tokens/classes/home-carousel.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import store from '@/core/store.js'
import type { HomeCarousel } from '../HomeCarousel.js'

/**
 * Autoplay only runs while ≥50% of the carousel is on screen
 * (threshold [0, 0.5] gives a clean two-state signal); below that or
 * under reduced-motion it pauses — offscreen animation would burn
 * frames the user can't see.
 */
export function setupObserver(host: HomeCarousel): void {
  const root = host.$(`.${HC_CLASSES.HC}`)
  if (!root) return

  if (typeof IntersectionObserver === TYPE_STRINGS.UNDEFINED) {
    host.isFullyVisible = true
    host.isEnteredViewport = true
    root.classList.add(HC_CLASSES.HC_IN_VIEW)
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
          root.classList.add(HC_CLASSES.HC_IN_VIEW)
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

/** Refits on container resize. */
export function onResize(host: HomeCarousel): void {
  host._jumpToSlide(host.currentIndex, false)
}

/**
 * Keyboard/AT exclusion for clone slides: they're visual duplicates
 * that exist only for the loop illusion, so every focusable inside
 * them is tabindex−1 + aria-hidden — tab order and screen readers
 * traverse the real slides exactly once.
 */
export function disableClonesFocus(host: HomeCarousel): void {
  const clones = host.$$(`.${HC_CLASSES.HC_SLIDE_CLONE}`)
  clones.forEach((clone) => {
    clone.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
      el.setAttribute(ARIA_ATTRS.TABINDEX, ATTR_VALUES.NEGATIVE_TABINDEX)
      el.setAttribute(ARIA_ATTRS.ARIA_HIDDEN, ATTR_VALUES.TRUE)
    })
  })
}
