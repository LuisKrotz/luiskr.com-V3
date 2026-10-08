/**
 * @file app/input.ts
 * @description Global input listeners for AppRoot — keyboard shortcuts, pointer handlers, and preference-triggering events bound during mount.
 */

import { DRAG_EVENTS, MOUSE_EVENTS, POINTER_EVENTS, TOUCH_EVENTS } from '@core/tokens/events/dom.js'
import { UI_MUTATIONS } from '@core/tokens/events/mutations.js'
import { COMMON_SELECTORS } from '@core/tokens/selectors/common.js'
import { INPUT_STRINGS } from '@core/tokens/strings/input.js'
import store from '@core/store.js'
import type { AppRoot } from '../App.js'

/**
 * Initializes app input listeners.
 * @param c — the component
 */
export function initAppInputListeners(c: AppRoot): void {
  const setTouch = () => {
    if (store.getters.getInputMethod() !== INPUT_STRINGS.TOUCH)
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
  }
  const setPointer = () => {
    if (store.getters.getInputMethod() !== INPUT_STRINGS.POINTER)
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.POINTER)
  }

  if (window.PointerEvent) {
    c.addScopedListener(
      window,
      POINTER_EVENTS.POINTERDOWN,
      (e) => {
        const pointerType = (e as PointerEvent).pointerType

        if (pointerType === INPUT_STRINGS.TOUCH) setTouch()
        else if (pointerType === INPUT_STRINGS.MOUSE || pointerType === INPUT_STRINGS.PEN)
          setPointer()
      },
      { passive: true }
    )
  } else {
    c.addScopedListener(window, TOUCH_EVENTS.TOUCHSTART, setTouch, { passive: true })
    c.addScopedListener(window, MOUSE_EVENTS.MOUSEDOWN, setPointer, { passive: true })
  }

  c.addScopedListener(window, MOUSE_EVENTS.CONTEXTMENU, (e) => {
    if ((e.target as Element | null)?.closest?.(COMMON_SELECTORS.MEDIA_ELEMENTS)) {
      e.preventDefault()
    }
  })

  c.addScopedListener(window, DRAG_EVENTS.DRAGSTART, (e) => {
    if ((e.target as Element | null)?.closest?.(COMMON_SELECTORS.MEDIA_ELEMENTS)) {
      e.preventDefault()
    }
  })
}
