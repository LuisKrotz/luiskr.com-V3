/**
 * @file awards-carousel/autoplay.ts — auto-advance RAF ticker.
 *
 * When accumulated dwell reaches `duration` it advances one slide and
 * rebases the clock — idx len+1 hits the clone path so the loop wraps
 * seamlessly. autoplayElapsed lets pause/resume continue mid-cycle
 * rather than restarting the dwell.
 */

import { APP_EVENTS } from '@core/tokens/events/app.js'
import store from '@core/store.js'
import type { AwardsCarousel } from '../AwardsCarousel.js'

/**
 * Starts the auto-advance ticker. Bails (and actively stops any running
 * cycle) under reduced-motion or before ≥50% visibility — autoplay must
 * never run on an unseen or motion-sensitive carousel. Re-bases the clock
 * on each start so a fresh cycle always gets a full dwell.
 * @param host The AwardsCarousel element.
 */
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

/**
 * Stops auto-advance (hover, reduced-motion, offscreen). Cancels the
 * pending RAF so no stray tick survives, then emits `autoplaystop` for
 * progress-bar listeners.
 * @param host The AwardsCarousel element.
 */
export function stopAutoplay(host: AwardsCarousel): void {
  host.autoplayRunning = false

  if (host.rafId) cancelAnimationFrame(host.rafId)
  host.rafId = null

  host.dispatchEvent(new CustomEvent(APP_EVENTS.AUTOPLAY_STOP, { bubbles: false }))
}

/**
 * Autoplay RAF tick — advances once `duration` has elapsed. The elapsed
 * calculation `now - start + accumulated` lets pause/resume continue a
 * partially-spent dwell instead of restarting it. `currentIndex + 1`
 * landing past the last real slide routes through the clone — nav.ts's
 * teleport then jumps back to index 0 invisibly.
 * @param host The AwardsCarousel element.
 */
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
