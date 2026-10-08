/**
 * @file preferences/webgl.ts — mounts/tears down the dialog's canvas widgets.
 *
 * Each block follows the same canvas-identity pattern: re-renders create new
 * canvas elements, so if the stored widget's canvas differs from the live DOM
 * one the widget is destroyed and rebuilt on the new element (GL contexts
 * can't migrate between canvases).
 */

import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { SWITCH_TYPES } from '@core/tokens/theme/switches.js'
import store from '@core/store.js'
import { ThemeSliderWebGL } from '@core/utils/canvas/widgets/theme-slider.js'
import { SwitchWebGL } from '@core/utils/canvas/widgets/switch-slider.js'
import { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import type { PreferencesModal } from '../PreferencesModal.js'

/** Commits the pref mutation matching a switch type. */
function commitSwitch(type: string): void {
  if (type === SWITCH_TYPES.STATS) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
  else if (type === SWITCH_TYPES.GRID) store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)
  else if (type === SWITCH_TYPES.MOTION) store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
}

/** Current toggle state for a switch type. */
function switchActive(host: PreferencesModal, type: string): boolean {
  if (type === SWITCH_TYPES.STATS) return store.getters.getStatsForNerds()
  if (type === SWITCH_TYPES.GRID) return store.getters.getShowGrid()
  if (type === SWITCH_TYPES.MOTION) return host.reducedMotion

  return false
}

/** Mounts the theme slider on its live canvas (rebuilding on canvas swap). */
function mountThemeSlider(host: PreferencesModal): void {
  const themeCanvas = host.$<HTMLCanvasElement>(`.${PREF_CLASSES.PREF_THEME_CANVAS}`)

  if (!themeCanvas) return

  if (host._themeSlider && host._themeSlider.canvas !== themeCanvas) {
    host._themeSlider.destroy()

    host._themeSlider = null
  }

  if (!host._themeSlider) {
    host._themeSlider = new ThemeSliderWebGL(themeCanvas, host.currentTheme, (newTheme) => {
      store.commit(PREF_MUTATIONS.SET_THEME, newTheme)
    })
  }
}

/** Mounts one SwitchWebGL per `data-switch` canvas. */
function mountSwitches(host: PreferencesModal): void {
  if (!host._switches) {
    host._switches = {}
  }

  const switches = host._switches

  const switchCanvases = host.$$<HTMLCanvasElement>(`.${PREF_CLASSES.PREF_SWITCH_CANVAS}`)

  switchCanvases.forEach((canvas) => {
    const type = canvas.getAttribute(DATA_ATTRS.DATA_SWITCH)

    if (!type) return

    const active = switchActive(host, type)

    const existing = switches[type]

    if (existing && existing.canvas !== canvas) {
      existing.destroy()

      delete switches[type]
    }

    if (!switches[type]) {
      switches[type] = new SwitchWebGL(canvas, type, active, () => commitSwitch(type))
    }
  })
}

/** Mounts the header close button on its live canvas. */
function mountCloseButton(host: PreferencesModal): void {
  const closeCanvas = host.$<HTMLCanvasElement>(`.${PREF_CLASSES.PREF_CLOSE_CANVAS}`)

  if (!closeCanvas) return

  if (host._closeBtn && host._closeBtn.canvas !== closeCanvas) {
    host._closeBtn.destroy()

    host._closeBtn = null
  }

  if (!host._closeBtn) {
    host._closeBtn = new CloseButtonWebGL(closeCanvas, () => host.close())
  }
}

/** Mounts all WebGL widgets onto the freshly rendered canvases. */
export function mountWebGLControls(host: PreferencesModal): void {
  if (!host.isOpen) return

  if (typeof window === TYPE_STRINGS.UNDEFINED) return

  mountThemeSlider(host)

  mountSwitches(host)

  mountCloseButton(host)
}

/** Tears down the mounted GL widgets. */
export function destroyWebGLControls(host: PreferencesModal): void {
  if (host._themeSlider) {
    host._themeSlider.destroy()

    host._themeSlider = null
  }

  if (host._switches) {
    Object.values(host._switches).forEach((sw) => sw.destroy())

    host._switches = null
  }

  if (host._closeBtn) {
    host._closeBtn.destroy()

    host._closeBtn = null
  }
}
