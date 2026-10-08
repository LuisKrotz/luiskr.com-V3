/**
 * @file nav-modals-preferencesmodal-tails.test.js
 * @description Split from nav-modals.test.js — covers the "PreferencesModal tails" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { PreferencesModal } from '@website/components/dialogs/PreferencesModal.js'
import { KEYS, SWITCH_TYPES, THEME } from '@core/constants.js'
import { TEST_PROJECTS, TEST_TEXT, mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import { appText } from '@core/locale/ui-text.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NAV_CLASSES } from '@core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { LANG_CLASSES } from '@core/tokens/classes/lang.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { ENGINE_UI_KEYS } from '@core/tokens/data/ui-keys.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const _S = {
  NAV: HTML_TAGS.NAV,
  NAV_LOGO_BTN: `.${NAV_CLASSES.NAV_LOGO_BTN}`,
  NAV_ABOUT_BTN: `.${NAV_CLASSES.NAV_ABOUT_BTN}`,
  NAV_ACTION_BTN: `.${NAV_CLASSES.NAV_ACTION_BTN}`,
  NAV_PREF_BTN: `.${NAV_CLASSES.NAV_PREF_BTN}`,
  NAV_LANG_OPEN_BTN: `.${NAV_CLASSES.NAV_LANG_OPEN_BTN}`,
  PREF_BACKDROP: `.${PREF_CLASSES.PREF_BACKDROP}`,
  PREF_DIALOG: `.${PREF_CLASSES.PREF_DIALOG}`,
  PREF_CLOSE_BTN: `.${PREF_CLASSES.PREF_CLOSE_BTN}`,
  PREF_DONE_BTN: `.${PREF_CLASSES.PREF_DONE_BTN}`,
  LANG_DIALOG: `.${LANG_CLASSES.LANG_DIALOG}`,
  NAV_DESKTOP: `.${NAV_CLASSES.NAV_DESKTOP}`,
  NAV_MOBILE_STRIP: `.${NAV_CLASSES.NAV_MOBILE_STRIP}`,
}

// ─── PreferencesModal tails ─────────────────────────────────────────────
describe('PreferencesModal tails', () => {
  let modalEl
  let cleanup

  const openModal = () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    modalEl._syncOpenState()
    modalEl._updateDom()
  }

  beforeEach(() => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    modalEl = new PreferencesModal()
    cleanup = mount(modalEl)
  })

  afterEach(() => cleanup())

  test('npuAnalytics and npuStatus resolve the best available engine tier', () => {
    const spy = jest.spyOn(npuPredict, 'getNpuAnalytics')
    spy.mockReturnValue({ hasNPU: true })
    expect(modalEl.npuAnalytics.hasNPU).toBe(true)
    expect(modalEl.npuStatus).toBe(appText(ENGINE_UI_KEYS.ENGINE_NPU))
    spy.mockReturnValue({ hasNPU: false, hasGPU: true })
    expect(modalEl.npuStatus).toBe(appText(ENGINE_UI_KEYS.ENGINE_GPU))
    spy.mockReturnValue({ hasNPU: false, hasGPU: false })
    expect(modalEl.npuStatus).toBe(appText(ENGINE_UI_KEYS.ENGINE_WASM))
    spy.mockRestore()
  })

  test('OPEN_PREFERENCES_MODAL window event opens the modal', () => {
    window.dispatchEvent(new Event(APP_EVENTS.OPEN_PREFERENCES_MODAL))
    expect(store.getters.getPreferencesOpen()).toBe(true)
  })

  test('pref setter re-renders when mounted and t falls back to defaults', () => {
    modalEl.pref = { title: TEST_TEXT.HEADING }
    expect(modalEl.t.title).toBe(TEST_TEXT.HEADING)
    expect(modalEl.t.done).toBeTruthy()
    modalEl.pref = null
    expect(modalEl.t.title).toBeTruthy()
    const bare = new PreferencesModal()
    bare.pref = { done: TEST_TEXT.SECOND }
    expect(bare.t.done).toBe(TEST_TEXT.SECOND)
  })

  test('widget callbacks commit theme and switch mutations', () => {
    openModal()
    modalEl._mountWebGLControls()
    const theme0 = store.getters.getTheme()
    const other = theme0 === THEME.DARK ? THEME.LIGHT : THEME.DARK
    modalEl._themeSlider.onThemeChange(other)
    expect(store.getters.getTheme()).toBe(other)
    const stats0 = store.getters.getStatsForNerds()
    modalEl._switches[SWITCH_TYPES.STATS].onToggle(!stats0)
    expect(store.getters.getStatsForNerds()).toBe(!stats0)
    const grid0 = store.getters.getShowGrid()
    modalEl._switches[SWITCH_TYPES.GRID].onToggle(!grid0)
    expect(store.getters.getShowGrid()).toBe(!grid0)
    const motion0 = store.getters.getReducedMotion()
    modalEl._switches[SWITCH_TYPES.MOTION].onToggle(!motion0)
    expect(store.getters.getReducedMotion()).toBe(!motion0)
  })

  test('JSX handlers: system theme, switch rows, buttons and backdrop', async () => {
    openModal()
    modalEl.shadowRoot
      .querySelector(`button[${DATA_ATTRS.DATA_THEME}="${THEME.SYSTEM}"]`)
      .dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(store.getters.getTheme()).toBe(THEME.SYSTEM)
    const rows = modalEl.shadowRoot.querySelectorAll(`.${PREF_CLASSES.PREF_SWITCH_ROW}`)
    const stats0 = store.getters.getStatsForNerds()
    rows[0].dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(store.getters.getStatsForNerds()).toBe(!stats0)
    const grid0 = store.getters.getShowGrid()
    rows[1].dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(store.getters.getShowGrid()).toBe(!grid0)
    const motion0 = store.getters.getReducedMotion()
    rows[2].dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(store.getters.getReducedMotion()).toBe(!motion0)
    for (const row of rows) {
      const bare = document.createElement(HTML_TAGS.BUTTON)
      row.appendChild(bare)
      bare.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
      row.removeChild(bare)
    }
    const swBtns = modalEl.shadowRoot.querySelectorAll(`button[role="${ARIA_ATTRS.ROLE_SWITCH}"]`)
    const stats1 = store.getters.getStatsForNerds()
    swBtns[0].dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(store.getters.getStatsForNerds()).toBe(!stats1)
    const grid1 = store.getters.getShowGrid()
    swBtns[1].dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(store.getters.getShowGrid()).toBe(!grid1)
    const motion1 = store.getters.getReducedMotion()
    swBtns[2].dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(store.getters.getReducedMotion()).toBe(!motion1)
    const backdrop = modalEl.shadowRoot.querySelector(`.${PREF_CLASSES.PREF_BACKDROP}`)
    backdrop
      .querySelector(`.${PREF_CLASSES.PREF_DIALOG}`)
      .dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(store.getters.getPreferencesOpen()).toBe(true)
    backdrop.dispatchEvent(new Event(MOUSE_EVENTS.CLICK))
    await new Promise((r) => setTimeout(r, 50))
    expect(store.getters.getPreferencesOpen()).toBe(false)
  })

  test('mountWebGLControls guards, switch scan edges and stale-canvas rebuilds', () => {
    modalEl._mountWebGLControls()
    openModal()
    const w = globalThis.window
    try {
      delete globalThis.window
      modalEl._mountWebGLControls()
    } finally {
      globalThis.window = w
    }
    modalEl._switches = null
    modalEl._mountWebGLControls()
    const bare = document.createElement(HTML_TAGS.CANVAS)
    bare.className = PREF_CLASSES.PREF_SWITCH_CANVAS
    const bogus = document.createElement(HTML_TAGS.CANVAS)
    bogus.className = PREF_CLASSES.PREF_SWITCH_CANVAS
    bogus.setAttribute(DATA_ATTRS.DATA_SWITCH, TEST_PROJECTS.CICB)
    modalEl.shadowRoot.appendChild(bare)
    modalEl.shadowRoot.appendChild(bogus)
    modalEl._mountWebGLControls()
    modalEl._switches[TEST_PROJECTS.CICB].onToggle(true)
    const stale = { canvas: document.createElement(HTML_TAGS.CANVAS), destroy: jest.fn() }
    modalEl._switches[SWITCH_TYPES.STATS] = stale
    modalEl._mountWebGLControls()
    expect(stale.destroy).toHaveBeenCalled()
    const slider = modalEl._themeSlider
    modalEl._mountWebGLControls()
    expect(modalEl._themeSlider).toBe(slider)
    const staleSlider = { canvas: document.createElement(HTML_TAGS.CANVAS), destroy: jest.fn() }
    modalEl._themeSlider = staleSlider
    modalEl._mountWebGLControls()
    expect(staleSlider.destroy).toHaveBeenCalled()
    const staleBtn = { canvas: document.createElement(HTML_TAGS.CANVAS), destroy: jest.fn() }
    modalEl._closeBtn = staleBtn
    modalEl._mountWebGLControls()
    expect(staleBtn.destroy).toHaveBeenCalled()
    const spy = jest.spyOn(modalEl, '$').mockReturnValue(null)
    modalEl._themeSlider = null
    modalEl._closeBtn = null
    modalEl._mountWebGLControls()
    spy.mockRestore()
    modalEl._themeSlider = null
    modalEl._switches = null
    modalEl._closeBtn = null
    modalEl._destroyWebGLControls()
  })

  test('already-open onStoreUpdate syncs widgets, theme UI and switch UI', () => {
    openModal()
    modalEl.onStoreUpdate()
    modalEl._themeSlider = null
    modalEl._closeBtn = null
    modalEl._switches = null
    modalEl.onStoreUpdate()
    const $spy = jest.spyOn(modalEl, '$').mockReturnValue(null)
    const $$spy = jest.spyOn(modalEl, '$$').mockReturnValue([])
    modalEl._switches = {}
    modalEl.onStoreUpdate()
    $spy.mockRestore()
    $$spy.mockRestore()
  })

  test('close guards, Escape dismissal and destroy with live widgets', async () => {
    modalEl.close()
    openModal()
    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: 'a' }))
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE }))
    openModal()
    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE }))
    await new Promise((r) => setTimeout(r, 50))
    expect(store.getters.getPreferencesOpen()).toBe(false)
    openModal()
    modalEl._closing = true
    modalEl.close()
    modalEl._closing = false
    modalEl._mountWebGLControls()
    modalEl._destroyWebGLControls()
  })

  test('customElements re-evaluation skips re-registration', async () => {
    expect(customElements.get(COMPONENT_TAGS.PREFERENCES_MODAL)).toBeTruthy()
    jest.resetModules()
    await import('@website/components/dialogs/PreferencesModal.js')
  })
})
