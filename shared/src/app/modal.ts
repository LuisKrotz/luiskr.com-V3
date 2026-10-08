/**
 * @file app/modal.ts
 * @description Modal-state DOM sync for AppRoot — toggles modal-open on html/body, copies the modifier class onto the wrapper, and applies/restores the iOS fixed-position scroll lock.
 */

import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import type { AppRoot } from '../App.js'

/**
 * Updates app modal state.
 * @param c — the component
 */
export function updateAppModalState(c: AppRoot): void {
  const wrapper = c.$(`[${DATA_ATTRS.DATA_APP_WRAPPER}]`)
  const mainEl = c.$(`#${APP_IDS.MAIN_CONTENT}`)
  const modal = store.getters.getModal()
  const isOpen = !!modal?.open

  if (typeof document !== TYPE_STRINGS.UNDEFINED) {
    document.documentElement.classList.toggle(MODAL_CLASSES.MODAL_OPEN, isOpen)
    document.body.classList.toggle(MODAL_CLASSES.MODAL_OPEN, isOpen)
  }

  if (wrapper) {
    wrapper.className = modal?.class || ATTR_VALUES.EMPTY
  }
  if (modal?.open) {
    // Apply iOS Safari scroll lock: position:fixed on main prevents rubber-band scroll
    const scrollY = modal.transform || 0
    document.documentElement.style.setProperty('--modal-top', `-${scrollY}${CHAR_STRINGS.PX}`)
    if (mainEl) {
      mainEl.style.position = STATE_STRINGS.FIXED
      mainEl.style.top = `-${scrollY}${CHAR_STRINGS.PX}`
      mainEl.style.width = CHAR_STRINGS.PERCENT_100
      mainEl.style.left = CHAR_STRINGS.ZERO
    }
  } else {
    // Restore scroll position when modal closes
    if (mainEl) {
      const top = mainEl.style.top
      mainEl.style.position = CHAR_STRINGS.EMPTY
      mainEl.style.top = CHAR_STRINGS.EMPTY
      mainEl.style.width = CHAR_STRINGS.EMPTY
      mainEl.style.left = CHAR_STRINGS.EMPTY
      if (top) {
        const scrollY = Math.abs(parseInt(top, 10)) || 0
        window.scrollTo(0, scrollY)
      }
    }
  }
}
