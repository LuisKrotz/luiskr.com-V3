/**
 * @file mosaic-events.ts — scoped listener bindings for <home-mosaic>:
 * card click/activation, hover expand/collapse (with re-enter guard via
 * relatedTarget), and debounced relayout on window resize.
 */

import { FOCUS_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { MOSAIC_SELECTORS } from '@core/tokens/selectors/mosaic.js'
import { predictiveLoader } from '@core/predictive-loader.js'
import { cardIdxFromEvent } from './interactions.js'
import type { HomeMosaic } from '../HomeMosaic.js'

/** Binds click/hover/leave/resize handlers inside the shadow root. */
export function bindEvents(host: HomeMosaic): void {
  host.addScopedListener(host.shadowRoot, MOUSE_EVENTS.CLICK, (e) => {
    const card = cardIdxFromEvent(e)

    if (!card) return

    const item = host.processedItems[card.idx]

    if (!item) return

    const mouse = e as MouseEvent
    const modified = mouse.metaKey || mouse.ctrlKey || mouse.shiftKey || mouse.altKey

    // Preserve native anchor behavior for new-tab/window gestures. Plain
    // activation stays in the SPA/two-tap flow.
    if (modified) return

    e.preventDefault()
    host.onClick(item, card.idx)
  })

  host.addScopedListener(host.shadowRoot, MOUSE_EVENTS.MOUSEOVER, (e) => {
    const card = cardIdxFromEvent(e)

    if (!card) return

    if (host.hoveredIdx !== card.idx) {
      host.onHover(card.idx)
    }
  })

  host.addScopedListener(host.shadowRoot, MOUSE_EVENTS.MOUSEOUT, (e) => {
    const card = cardIdxFromEvent(e)

    if (!card) return

    const relatedTarget = (e as MouseEvent).relatedTarget as Element | null

    const related = relatedTarget
      ? relatedTarget.closest?.(MOSAIC_SELECTORS.HOME_MOSAIC_ITEM)
      : null

    if (related === card.itemEl) return

    host.onLeave()
  })

  // Keyboard parity: tabbing onto a card's control expands its details
  // exactly like hover does (focusin/focusout bubble — focus/blur don't).
  host.addScopedListener(host.shadowRoot, FOCUS_EVENTS.FOCUSIN, (e) => {
    const card = cardIdxFromEvent(e)

    if (card && host.hoveredIdx !== card.idx) host.onHover(card.idx)
  })

  host.addScopedListener(host.shadowRoot, FOCUS_EVENTS.FOCUSOUT, (e) => {
    const card = cardIdxFromEvent(e)

    if (!card) return

    const relatedTarget = (e as FocusEvent).relatedTarget as Element | null

    // Focus moving inside the same card (e.g. button → link) keeps it open.
    if (relatedTarget?.closest?.(MOSAIC_SELECTORS.HOME_MOSAIC_ITEM) === card.itemEl) return

    host.onLeave()
  })

  if (host.processedItems.length) {
    host._updateDom()
  }

  host.quickLayout()

  host.scheduleLayout()

  predictiveLoader.scanAndObserve(host.shadowRoot)

  host.addScopedListener(window, WINDOW_EVENTS.RESIZE, () => {
    host.quickLayout()

    host.scheduleLayout()
  })
}
