/**
 * @file safari/patches/media-figure/tap-expand.ts
 * @description Tap-vs-scroll disambiguation for the expand gesture on
 * Safari: iOS click synthesis is unreliable inside transformed/shadow
 * contexts, so a manual touchend fires openModal() — but only when the
 * finger moved ≤10px (a tap), not when the user was scrolling the page.
 */

import { MOUSE_EVENTS, TOUCH_EVENTS } from '@core/tokens/events/dom.js'
import type { SafariPatchableEl } from '../../types.js'

/** Binds tap-vs-scroll expand handlers onto the figure's touch targets. */
export function bindSafariTapExpand(el: SafariPatchableEl, targets: HTMLElement[]): void {
  let touchMoved = false

  let startX = 0

  let startY = 0

  const onTouchStart = (e: Event) => {
    touchMoved = false

    const t = (e as TouchEvent).touches?.[0]

    if (t) {
      startX = t.clientX

      startY = t.clientY
    }
  }

  const onTouchMove = (e: Event) => {
    if (touchMoved) return

    const t = (e as TouchEvent).touches?.[0]

    if (t) {
      const dx = Math.abs(t.clientX - startX)

      const dy = Math.abs(t.clientY - startY)

      if (dx > 10 || dy > 10) {
        touchMoved = true
      }
    }
  }

  const onTouchEnd = (e: Event) => {
    if (!touchMoved) {
      if (e.cancelable) e.preventDefault()

      e.stopPropagation()

      el.openModal?.()
    }
  }

  targets.forEach((target) => {
    el.addScopedListener(target, TOUCH_EVENTS.TOUCHSTART, onTouchStart, { passive: true })

    el.addScopedListener(target, TOUCH_EVENTS.TOUCHMOVE, onTouchMove, { passive: true })

    el.addScopedListener(target, TOUCH_EVENTS.TOUCHEND, onTouchEnd, { passive: false })

    el.addScopedListener(target, MOUSE_EVENTS.CLICK, (e) => {
      e.stopPropagation()

      el.openModal?.()
    })
  })
}
