/**
 * @file draw-text/trigger.ts — trigger wiring (viewport observer / prop /
 * immediate) and the reveal sequence.
 *
 * The reveal mounts char spans in the visible state; the CSS staggers
 * each span via `--i · --char-delay + --offset`, and a done-timer
 * collapses them back to word nodes once the last character has landed:
 *   lastCharDelay = offset + (chars−1)·delay — when the final char starts
 *   totalMs       = lastCharDelay + EXTRA_MS (one transition duration
 *                   of slack), clamped to MAX_MS for pathological texts
 * The rootMargin on the observer starts the animation just before the
 * element is visible — text appears to be mid-reveal as it scrolls in.
 */

import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import { DRAW_TEXT_CLASSES } from '@/core/tokens/classes/draw-text.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { QUERY_STRINGS } from '@/core/tokens/strings/queries.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { stripHtml } from '@/core/utils/string.js'
import type { DrawText } from '../DrawText.js'
import { DRAW_TIMINGS } from '@/core/tokens/media/dimensions.js'

/**
 * Reduced-motion gate — true when the OS/site prefers-reduced-motion flag
 * is on; draw-text skips its per-character animation in that case.
 * @returns {boolean} whether reduced motion is active
 */
function isReducedMotion(): boolean {
  return (
    typeof document !== TYPE_STRINGS.UNDEFINED &&
    document.documentElement.classList.contains(STATE_CLASSES.REDUCED_MOTION)
  )
}

/** Wires the active trigger mode (observer, hover, manual). */
export function setupTrigger(host: DrawText): void {
  const trigger = host.triggerMode

  const text = host.text

  if (!text) return

  if (isReducedMotion()) {
    host._hasAnimated = true

    host._isVisible = true

    host._updateDom()

    return
  }

  if (trigger === COMMON_ATTRS.TRIGGER_VIEWPORT) {
    if (host._observer) host._observer.disconnect()

    host._observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !entry.isIntersecting) return

        if (host._observer) {
          host._observer.disconnect()

          host._observer = null
        }

        requestAnimationFrame(() => {
          host._startAnimation()
        })
      },
      {
        threshold: DRAW_TIMINGS.DRAW_OBSERVER_THRESHOLD,
        rootMargin: QUERY_STRINGS.ROOT_MARGIN_50,
      }
    )

    host._observer.observe(host)
  } else if (trigger === COMMON_ATTRS.PROP) {
    if (host.visible) {
      host._startAnimation()
    }
  } else {
    host._startAnimation()
  }
}

/** Runs the reveal sequence (see file header for the timing math). */
export function startAnimation(host: DrawText): void {
  if (host._isVisible) return

  host._isVisible = true

  if (isReducedMotion()) {
    host._hasAnimated = true

    host._updateDom()

    return
  }

  // Mount the per-character spans only now, in the visible state
  host._updateDom()

  const rootEl = host._rootEl

  const chars = stripHtml(host.text).length

  const lastCharDelay = host.offset + Math.max(0, chars - 1) * host.delay

  const totalMs = Math.min(
    lastCharDelay + DRAW_TIMINGS.DRAW_ANIM_EXTRA_MS,
    DRAW_TIMINGS.DRAW_ANIM_MAX_MS
  )

  if (host._animTimer) clearTimeout(host._animTimer)

  host._animTimer = setTimeout(() => {
    host._hasAnimated = true

    if (rootEl) {
      rootEl.classList.add(DRAW_TEXT_CLASSES.DRAW_TEXT_DONE)

      rootEl.classList.remove(DRAW_TEXT_CLASSES.DRAW_TEXT_VISIBLE)
    }

    // Animation finished: collapse the char spans back into words
    host._updateDom()
  }, totalMs)

  host._animTimer?.unref?.()
}
