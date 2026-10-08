/**
 * @file nav-modals-langdialog-tails.test.js
 * @description Split from nav-modals.test.js — covers the "LangDialog tails" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { LangDialog } from '@website/components/dialogs/LangDialog.js'
import { KEYS, LOCALES, ROUTE_NAMES } from '@core/constants.js'
import { TEST_PROJECTS, mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NAV_CLASSES } from '@core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { LANG_CLASSES } from '@core/tokens/classes/lang.js'
import { LANG_MUTATIONS, MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import {
  FOCUS_EVENTS,
  KEYBOARD_EVENTS,
  MOUSE_EVENTS,
  POINTER_EVENTS,
  WINDOW_EVENTS,
} from '@core/tokens/events/dom.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { FLAG_CLASSES } from '@core/tokens/classes/flags.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

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

// ─── LangDialog tails ───────────────────────────────────────────────────
describe('LangDialog tails', () => {
  let langEl
  let cleanup

  beforeEach(() => {
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    langEl = new LangDialog()
    cleanup = mount(langEl)
  })

  afterEach(() => cleanup())

  test('open setter drives onStoreUpdate when mounted but not yet subscribed', () => {
    langEl._subscribedToStore = false
    langEl.open = true
    expect(langEl.isOpen).toBe(true)
  })

  test('OPEN_LANG_DIALOG window event opens the dialog and isOpen falls back to _isOpen', () => {
    window.dispatchEvent(new Event(APP_EVENTS.OPEN_LANG_DIALOG))
    expect(store.getters.getLangDialogOpen()).toBe(true)
    const getter = store.getters.getLangDialogOpen
    store.getters.getLangDialogOpen = CHAR_STRINGS.EMPTY
    expect(langEl.isOpen).toBe(langEl._isOpen)
    store.getters.getLangDialogOpen = getter
  })

  test('mountWebGLControls guards: closed, window-less, missing canvas, unknown flags', () => {
    langEl._mountWebGLControls()
    langEl.open = true
    const w = globalThis.window
    delete globalThis.window
    langEl._mountWebGLControls()
    globalThis.window = w
    langEl._flags = null
    langEl._mountWebGLControls()
    const bare = document.createElement(HTML_TAGS.CANVAS)
    bare.className = FLAG_CLASSES.FLAG_CANVAS
    const bogus = document.createElement(HTML_TAGS.CANVAS)
    bogus.className = FLAG_CLASSES.FLAG_CANVAS
    bogus.setAttribute(DATA_ATTRS.DATA_FLAG, TEST_PROJECTS.CICB)
    langEl.shadowRoot.appendChild(bare)
    langEl.shadowRoot.appendChild(bogus)
    langEl._mountWebGLControls()
    const firstReal = langEl.shadowRoot.querySelector(
      `.${FLAG_CLASSES.FLAG_CANVAS}[${DATA_ATTRS.DATA_FLAG}]`
    )
    const code = firstReal.getAttribute(DATA_ATTRS.DATA_FLAG)
    const stale = { canvas: document.createElement(HTML_TAGS.CANVAS), destroy: jest.fn() }
    langEl._flags[code] = stale
    langEl._mountWebGLControls()
    expect(stale.destroy).toHaveBeenCalled()
    langEl._mountWebGLControls()
    const staleBtn = { canvas: document.createElement(HTML_TAGS.CANVAS), destroy: jest.fn() }
    langEl._closeBtn = staleBtn
    langEl._mountWebGLControls()
    expect(staleBtn.destroy).toHaveBeenCalled()
    langEl._mountWebGLControls()
    const spy = jest.spyOn(langEl, '$').mockReturnValue(null)
    langEl._flags = null
    langEl._mountWebGLControls()
    spy.mockRestore()
    langEl._flags = null
    langEl._destroyWebGLControls()
  })

  test('onStoreUpdate guard arms: closing, already-open, closed sync with null flags', () => {
    langEl._closing = true
    langEl.onStoreUpdate()
    langEl._closing = false
    langEl._flags = null
    langEl.onStoreUpdate()
    langEl.open = true
    langEl._flags = { en: null, [TEST_PROJECTS.CICB]: null }
    langEl._wasOpen = false
    langEl.onStoreUpdate()
    langEl._flags = {}
    langEl.onStoreUpdate()
  })

  test('$-null render paths skip mount, bind and the RAF backdrop focus', async () => {
    const spy = jest.spyOn(langEl, '$').mockReturnValue(null)
    langEl._flags = null
    langEl.open = true
    await new Promise((r) => setTimeout(r, 60))
    spy.mockRestore()
  })

  test('bound interactions: backdrop clicks, keys, follower glide, resize, leave', async () => {
    langEl.open = true
    const grid = langEl.shadowRoot.querySelector(`.${PREF_CLASSES.PREF_OPTIONS}`)
    const follower = langEl.shadowRoot.querySelector(`.${LANG_CLASSES.LANG_GLASS_FOLLOWER}`)
    const btn = langEl.shadowRoot.querySelector(`[${DATA_ATTRS.DATA_LANG}]`)
    for (const [k, v] of [
      ['offsetLeft', 10],
      ['offsetTop', 20],
      ['offsetWidth', 100],
      ['offsetHeight', 40],
    ])
      Object.defineProperty(btn, k, { value: v, configurable: true })
    btn.dispatchEvent(new Event(POINTER_EVENTS.POINTERENTER))
    btn.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEENTER))
    btn.dispatchEvent(new Event(FOCUS_EVENTS.FOCUS))
    expect(follower.style.transform).toContain('translate3d')
    const activeBtn = langEl.shadowRoot.querySelector(
      `.${PREF_CLASSES.PREF_OPTION_BTN}.${STATE_CLASSES.ACTIVE}`
    )
    if (activeBtn) {
      for (const [k, v] of [
        ['offsetLeft', 5],
        ['offsetTop', 5],
        ['offsetWidth', 80],
        ['offsetHeight', 30],
      ])
        Object.defineProperty(activeBtn, k, { value: v, configurable: true })
    }
    await new Promise((r) => setTimeout(r, 60))
    grid.dispatchEvent(new Event(POINTER_EVENTS.POINTERLEAVE))
    activeBtn?.classList.remove(STATE_CLASSES.ACTIVE)
    grid.dispatchEvent(new Event(POINTER_EVENTS.POINTERLEAVE))
    expect(follower.style.opacity).toBe('0')
    window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))
    activeBtn?.classList.add(STATE_CLASSES.ACTIVE)
    window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))
    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: 'a' }))
    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE }))
    langEl.open = true
    const bd2 = langEl.shadowRoot.querySelector(`.${PREF_CLASSES.PREF_BACKDROP}`)
    const child = bd2.querySelector(`.${LANG_CLASSES.LANG_DIALOG}`)
    child.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    bd2.dispatchEvent(new Event(MOUSE_EVENTS.CLICK))
    await new Promise((r) => setTimeout(r, 50))
    expect(langEl.isOpen).toBe(false)
  })

  test('selectLang applies locale and _applyLang maps each known route', () => {
    langEl.open = true
    const current = store.getters.getLang()
    langEl.selectLang(current)
    langEl.open = true
    const push = jest.spyOn(router, 'push').mockImplementation(() => {})
    for (const name of [
      ROUTE_NAMES.HOME,
      ROUTE_NAMES.ABOUT,
      ROUTE_NAMES.CONTACT,
      ROUTE_NAMES.PRIVACY,
      ROUTE_NAMES.GDPR,
      ROUTE_NAMES.TERMS,
      ROUTE_NAMES.EARTH_PLAYGROUND,
    ]) {
      router.currentRoute = { name }
      langEl._applyLang(LOCALES.PT)
      expect(push).toHaveBeenLastCalledWith(
        expect.stringContaining(`${ROUTE_PATHS.ROOT}${LOCALES.PT}`)
      )
    }
    store.commit(LANG_MUTATIONS.SET_SLUGS_LANG, { earthPlayground: ATTR_VALUES.EMPTY })
    router.currentRoute = { name: ROUTE_NAMES.EARTH_PLAYGROUND }
    langEl._applyLang(LOCALES.PT)
    expect(push).toHaveBeenLastCalledWith(
      `${ROUTE_PATHS.ROOT}${LOCALES.PT}${ROUTE_PATHS.EARTH_PLAYGROUND}`
    )
    store.commit(LANG_MUTATIONS.SET_SLUGS_LANG, null)
    router.currentRoute = { name: ROUTE_NAMES.PROJECT }
    window.history.pushState(
      {},
      ATTR_VALUES.EMPTY,
      `${ROUTE_PATHS.ROOT}${LOCALES.PT}${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.CICB}`
    )
    langEl._applyLang(LOCALES.EN)
    expect(push).toHaveBeenLastCalledWith(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.CICB}`)
    const loc = window.location
    const prevPathname = loc.pathname
    Object.defineProperty(loc, 'pathname', { value: TEST_PROJECTS.CICB, configurable: true })
    langEl._applyLang(LOCALES.EN)
    expect(push).toHaveBeenLastCalledWith(`${ROUTE_PATHS.ROOT}${TEST_PROJECTS.CICB}`)
    Object.defineProperty(loc, 'pathname', { value: prevPathname, configurable: true })
    push.mockRestore()
    langEl.open = true
    const btn = langEl.shadowRoot.querySelector(`[${DATA_ATTRS.DATA_LANG}]`)
    btn.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
  })

  test('already-open sync without the open attr, and unmounted flag sync hits the ?? fallback', () => {
    langEl.open = true
    langEl.removeAttribute(COMMON_ATTRS.OPEN)
    langEl.onStoreUpdate()
    const spy = jest.spyOn(langEl, '_mountWebGLControls').mockImplementation(() => {})
    langEl._flags = null
    langEl._wasOpen = false
    langEl.removeAttribute(COMMON_ATTRS.OPEN)
    langEl.onStoreUpdate()
    spy.mockRestore()
    langEl._flags = {}
  })

  test('customElements re-evaluation skips re-registration', async () => {
    expect(customElements.get(COMPONENT_TAGS.LANG_DIALOG)).toBeTruthy()
    jest.resetModules()
    await import('@website/components/dialogs/LangDialog.js')
  })
})
