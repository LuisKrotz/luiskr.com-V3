/**
 * @file carousel-lifecycle.ts — mount/update/teardown for
 * <custom-carousel>: initial relayout, the resize listener, store
 * subscription side-effects (reduced-motion + modal open → autoplay
 * gating), and widget/observer teardown.
 */

import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import store from '@core/store.js'
import type { CustomCarousel } from '../CustomCarousel.js'
import { CAROUSEL_LAYOUT } from '@core/tokens/motion/carousel.js'

/**
 * Mount: first render pass, resize binding, fit observer, store sub.
 * `_markAdjacentLoaded(0)` pre-flags the first neighborhood before the
 * observer's first callback so slide media starts loading immediately.
 */
export function onMounted(host: CustomCarousel): void {
  if (host.items && host.items.length) {
    host._updateDom()
  }

  host._markAdjacentLoaded(0)

  host._setupAfterRender()

  host.addScopedListener(window, WINDOW_EVENTS.RESIZE, () => {
    host.isMobile = window.innerWidth < CAROUSEL_LAYOUT.MOBILE_BREAKPOINT
  })

  host._startFitObserver()

  host.subscribe(store)
}

/** Disconnects the ResizeObserver tracking the host width. */
export function onUnmounted(host: CustomCarousel): void {
  if (host._fitObserver) {
    host._fitObserver.disconnect()

    host._fitObserver = null
  }
}

/**
 * Store change → propagate reduced-motion to both arrows and gate
 * autoplay on reduced-motion / open-modal. The resume arm requires BOTH
 * `isActive` (carousel mode, not side-by-side) and `isFullyVisible` —
 * a modal closing must not revive a carousel that's offscreen.
 */
export function onStoreUpdate(host: CustomCarousel): void {
  const isReduced = store.getters.getReducedMotion()

  const isModal = Boolean(store.getters.getModal()?.open)

  host._prevArrow?.setReducedMotion(isReduced)

  host._nextArrow?.setReducedMotion(isReduced)

  if (isReduced || isModal) {
    host._stopAutoplay()
  } else if (host.isActive && host.isFullyVisible) {
    host._startAutoplay()
  }
}

/** Teardown: autoplay clock, WebGL arrows, observers, timers — every async handle released so nothing fires after disconnect. */
export function onDestroy(host: CustomCarousel): void {
  host._stopAutoplay()

  if (host._prevArrow) {
    host._prevArrow.destroy()

    host._prevArrow = null
  }

  if (host._nextArrow) {
    host._nextArrow.destroy()

    host._nextArrow = null
  }

  if (host.observer) {
    host.observer.disconnect()

    host.observer = null
  }

  if (host.teleportTimer) clearTimeout(host.teleportTimer)
}
