/**
 * @file preferences/sync.ts — DOM/widget state sync for the open dialog.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { SWITCH_TYPES } from '@core/tokens/theme/switches.js'
import store from '@core/store.js'
import type { PreferencesModal } from '../PreferencesModal.js'
import { destroyWebGLControls } from './webgl.js'

/** Reflects the open flag into DOM/classes (widget teardown on close). */
export function syncOpenState(host: PreferencesModal): void {
  if (host.isOpen) {
    host.setAttribute(COMMON_ATTRS.OPEN, ATTR_VALUES.EMPTY)

    host.classList.add(STATE_CLASSES.IS_OPEN)
  } else {
    host.removeAttribute(COMMON_ATTRS.OPEN)

    host.classList.remove(STATE_CLASSES.IS_OPEN)

    destroyWebGLControls(host)
  }
}

/** Syncs the theme option buttons with the store's theme. */
export function updateThemeUI(host: PreferencesModal): void {
  const theme = host.currentTheme

  const buttons = host.$$(`.${PREF_CLASSES.PREF_THEME_BTN}`)

  buttons.forEach((btn) => {
    const btnTheme = btn.getAttribute(DATA_ATTRS.DATA_THEME)

    const isActive = btnTheme === theme

    btn.classList.toggle(PREF_CLASSES.PREF_THEME_BTN_ACTIVE, isActive)

    btn.classList.toggle(STATE_CLASSES.ACTIVE, isActive)
  })
}

/** Syncs one switch button's DOM classes/ARIA with its state. */
function syncSwitchButton(host: PreferencesModal, label: string, active: boolean): void {
  const btn = host.$(`${HTML_TAGS.BUTTON}[${ARIA_ATTRS.ARIA_LABEL}="${label}"]`)

  if (btn) {
    btn.className = active ? PREF_CLASSES.PREF_SWITCH_ON : PREF_CLASSES.PREF_SWITCH

    btn.setAttribute(ARIA_ATTRS.ARIA_CHECKED, String(active))
  }
}

/** Syncs each switch widget + its DOM twin with its pref value. */
export function updateSwitchesUI(host: PreferencesModal): void {
  const statsForNerds = store.getters.getStatsForNerds()

  const showGrid = store.getters.getShowGrid()

  const reduced = host.reducedMotion

  host._switches?.[SWITCH_TYPES.STATS]?.setActive(statsForNerds)

  host._switches?.[SWITCH_TYPES.GRID]?.setActive(showGrid)

  host._switches?.[SWITCH_TYPES.MOTION]?.setActive(reduced)

  const t = host.t

  syncSwitchButton(host, t.devTools.statsForNerds, statsForNerds)

  syncSwitchButton(host, t.devTools.showGrid, showGrid)

  syncSwitchButton(host, t.devTools.reducedMotion, reduced)
}
