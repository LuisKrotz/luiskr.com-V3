/**
 * @file awards-carousel/autoplay.ts — auto-advance RAF ticker.
 *
 * When accumulated dwell reaches `duration` it advances one slide and
 * rebases the clock — idx len+1 hits the clone path so the loop wraps
 * seamlessly. autoplayElapsed lets pause/resume continue mid-cycle
 * rather than restarting the dwell.
 */

import { APP_EVENTS } from '@/core/tokens/events/app.js'
import store from '@/core/store.js'
import type { AwardsCarousel } from '../AwardsCarousel.js'

/** Starts the auto-advance ticker. */
export function startAutoplay(host: AwardsCarousel): void {
  if (store.getters.getReducedMotion() || !host.isFullyVisible) {
    host._stopAutoplay()
    return
  }

  host.autoplayRunning = true
  host.autoplayStart = performance.now()
  host.autoplayElapsed = 0

  // Notify listeners (e.g. AwardsMentions progress bar) that autoplay is live
  host.dispatchEvent(new CustomEvent(APP_EVENTS.AUTOPLAY_START, { bubbles: false }))

  tickAutoplay(host)
}

/** Stops auto-advance (hover/pref/hidden). */
export function stopAutoplay(host: AwardsCarousel): void {
  host.autoplayRunning = false

  if (host.rafId) cancelAnimationFrame(host.rafId)
  host.rafId = null

  host.dispatchEvent(new CustomEvent(APP_EVENTS.AUTOPLAY_STOP, { bubbles: false }))
}

/** Autoplay RAF tick — advances once `duration` has elapsed. */
export function tickAutoplay(host: AwardsCarousel): void {
  if (!host.autoplayRunning) return

  const now = performance.now()
  const elapsed = now - (host.autoplayStart ?? 0) + host.autoplayElapsed

  if (elapsed >= host.duration) {
    host.goTo(host.currentIndex + 1)
    host.autoplayElapsed = 0
    host.autoplayStart = performance.now()
  }

  host.rafId = requestAnimationFrame(() => tickAutoplay(host))
}
