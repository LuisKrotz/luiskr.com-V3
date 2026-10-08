/**
 * @file app-shell-coverage-appnav-tails.test.js
 * @description Split from app-shell-coverage.test.js — covers the "AppNav tails" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import '@/App.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { mount, TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { LANG_SLUGS } from '@core/i18n.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { FLAG_CLASSES } from '@core/tokens/classes/flags.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { NAV_BURGER_CLASSES, NAV_CLASSES, NAV_MENU_CLASSES } from '@core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'

import { KEYS, LOCALES, ROUTE_NAMES, SECTIONS } from '@core/constants.js'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

let cleanups = []

beforeEach(() => {
  // Mounts read router.currentRoute.view — keep a complete descriptor.
  router.currentRoute = { name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} }
})

afterEach(() => {
  cleanups.forEach((c) => c())
  cleanups = []
})

const _stableFetch = () => {
  const orig = globalThis.fetch

  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))

  return orig
}

const BAD_LOCALE = 'xx'

const mountNav = () => {
  const el = document.createElement(COMPONENT_TAGS.APP_NAV)

  cleanups.push(mount(el))

  return el
}

const keydown = (key) =>
  window.dispatchEvent(new window.KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key }))

describe('AppNav tails', () => {
  test('isPlaygroundPage covers route-name, canonical segments, localized slugs and misses', () => {
    const el = mountNav()
    const prevRoute = router.currentRoute

    router.currentRoute = { name: ROUTE_NAMES.EARTH_PLAYGROUND }
    expect(el.isPlaygroundPage).toBe(true)

    router.currentRoute = { name: ROUTE_NAMES.HOME }

    window.history.replaceState(
      {},
      '',
      `${CHAR_STRINGS.SLASH}${ROUTE_PATHS.EARTH_PLAYGROUND_SEGMENT}`
    )
    expect(el.isPlaygroundPage).toBe(true)

    window.history.replaceState(
      {},
      '',
      `${CHAR_STRINGS.SLASH}${ROUTE_PATHS.SPACE_PLAYGROUND_SEGMENT}`
    )
    expect(el.isPlaygroundPage).toBe(true)

    window.history.replaceState({}, '', `${CHAR_STRINGS.SLASH}${LANG_SLUGS.br.earthPlayground}`)
    expect(el.isPlaygroundPage).toBe(true)

    window.history.replaceState({}, '', ROUTE_PATHS.ABOUT)
    expect(el.isPlaygroundPage).toBe(false)

    router.currentRoute = null
    window.history.replaceState({}, '', CHAR_STRINGS.SLASH)
    expect(el.isPlaygroundPage).toBe(false)

    router.currentRoute = prevRoute
  })

  test('isHomePage covers about/contact prefix and non-home arms', () => {
    const el = mountNav()
    const prevRoute = router.currentRoute

    router.currentRoute = { name: ROUTE_NAMES.ABOUT }
    expect(el.isHomePage).toBe(true)

    router.currentRoute = { name: ROUTE_NAMES.CONTACT }
    expect(el.isHomePage).toBe(true)

    router.currentRoute = { name: ROUTE_NAMES.NOT_FOUND }
    expect(el.isHomePage).toBe(false)

    router.currentRoute = null
    expect(el.isHomePage).toBe(true)

    router.currentRoute = prevRoute
  })

  test('locale getters and flag rendering cover option, null and split arms', async () => {
    const el = mountNav()
    const prevLocale = store.state.lang.locale

    try {
      store.state.lang.locale = BAD_LOCALE
      expect(el.currentLang).toBeNull()
      expect(el.currentLangLabel).toBe(BAD_LOCALE.toUpperCase())
      expect(el.renderLocaleFlag()).toBe(BAD_LOCALE.toUpperCase())

      store.state.lang.locale = LOCALES.HRK
      el._toggleMenu()

      await flush()

      expect(el.shadowRoot.querySelector(`.${FLAG_CLASSES.FLAG_SPLIT}`)).not.toBeNull()

      el._closeMenu()

      // The close path settles on a ~1.3s wall-clock timer — fake the clock
      // so a starved worker can't stall it past the test timeout, and so the
      // locale restore below always runs even if the advance throws.
      jest.useFakeTimers()
      await jest.advanceTimersByTimeAsync(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    } finally {
      jest.useRealTimers()
      store.state.lang.locale = prevLocale
    }
  })

  test('_mountNavFlag / _mountBurgerWebGL / _mountMenuWebGL guard arms', () => {
    const el = mountNav()

    const w = globalThis.window

    delete globalThis.window
    el._mountNavFlag()
    el._mountBurgerWebGL()
    el._mountMenuWebGL()
    globalThis.window = w

    el._menuFlagCanvasEl = null
    el._mountNavFlag()

    el._menuFlagCanvasEl = document.createElement(HTML_TAGS.CANVAS)
    el._mountNavFlag()

    el._burgerCanvasEl = null
    el._mountBurgerWebGL()
    expect(el._burgerBtn).toBeNull()

    el._burgerCanvasEl = document.createElement(HTML_TAGS.CANVAS)
    el._burgerBtn = { destroy: jest.fn() }
    el._mountBurgerWebGL()
    expect(el._burgerBtn).toBeNull()

    el._burgerCanvasEl = null
  })

  test('scrollTop covers home/non-home, reduced motion and scrollTo fallback', () => {
    const el = mountNav()
    const prevRoute = router.currentRoute
    const origScroll = window.scrollTo

    window.history.replaceState({}, '', ROUTE_PATHS.ABOUT)
    el.scrollToTop()
    expect(el.activeSection).toBe(SECTIONS.HOME)
    expect(window.location.pathname).toBe(`${CHAR_STRINGS.SLASH}`)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    el.scrollToTop()

    let calls = 0

    window.scrollTo = () => {
      if (calls++ === 0) throw new Error(TEST_TEXT.MISSING_KEY)
    }
    el.scrollToTop()
    window.scrollTo = origScroll

    router.currentRoute = { name: ROUTE_NAMES.NOT_FOUND, view: VIEW_TAGS.VIEW_NOT_FOUND, meta: {} }
    el.scrollToTop()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    router.currentRoute = prevRoute
  })

  test('goToAbout covers found/missing target, reduced and scrollTo fallback', () => {
    const el = mountNav()
    const origScroll = window.scrollTo
    const about = document.createElement(HTML_TAGS.DIV)

    about.id = SECTION_IDS.ABOUT
    document.body.appendChild(about)

    el.goToAbout()
    expect(el.activeSection).toBe(SECTIONS.ABOUT)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    let calls = 0

    window.scrollTo = () => {
      if (calls++ === 0) throw new Error(TEST_TEXT.MISSING_KEY)
    }
    el.goToAbout()
    window.scrollTo = origScroll
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    about.remove()

    window.history.replaceState({}, '', CHAR_STRINGS.SLASH)
    el.goToAbout()
    expect(window.location.pathname).toBe(ROUTE_PATHS.ABOUT)
  })

  test('scrollToContact covers home target, missing target and non-home scrollHeight arms', () => {
    const el = mountNav()
    const prevRoute = router.currentRoute
    const origScroll = window.scrollTo
    const contact = document.createElement(HTML_TAGS.DIV)

    contact.id = SECTION_IDS.CONTACT
    document.body.appendChild(contact)

    el.scrollToContact()
    expect(el.activeSection).toBe(SECTIONS.CONTACT)
    expect(window.location.pathname).toBe(ROUTE_PATHS.CONTACT)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    el.scrollToContact()

    let calls = 0

    window.scrollTo = () => {
      if (calls++ === 0) throw new Error(TEST_TEXT.MISSING_KEY)
    }
    el.scrollToContact()
    window.scrollTo = origScroll
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    contact.remove()

    window.history.replaceState({}, '', CHAR_STRINGS.SLASH)
    el.scrollToContact()

    router.currentRoute = { name: ROUTE_NAMES.NOT_FOUND, view: VIEW_TAGS.VIEW_NOT_FOUND, meta: {} }
    el.scrollToContact()

    router.currentRoute = prevRoute
  })

  test('logo/about/action handlers cover route-push and scroll arms', () => {
    const el = mountNav()
    const prevRoute = router.currentRoute
    const push = jest.spyOn(router, 'push').mockResolvedValue(undefined)

    router.currentRoute = { name: ROUTE_NAMES.NOT_FOUND, view: VIEW_TAGS.VIEW_NOT_FOUND, meta: {} }
    el.handleLogo(null)
    el.handleAbout({ preventDefault() {}, stopPropagation() {} })
    expect(push).toHaveBeenCalledTimes(2)

    router.currentRoute = { name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} }
    el.handleLogo({})
    el.handleAbout({})
    expect(push).toHaveBeenCalledTimes(2)

    el.onBottom = true
    el.handleAction({})

    el.onBottom = false
    el.handleAction({})

    push.mockRestore()
    router.currentRoute = prevRoute
  })

  test('_captureOrigin covers every target shape and both commit arms', () => {
    const el = mountNav()
    const btn = document.createElement(HTML_TAGS.BUTTON)
    const span = document.createElement(HTML_TAGS.SPAN)
    const noRect = document.createElement(HTML_TAGS.SPAN)

    btn.appendChild(span)

    el._captureOrigin(null)
    el._captureOrigin({ target: {} })
    el._captureOrigin({ target: document.body })
    el._captureOrigin({ currentTarget: btn })
    el._captureOrigin({ currentTarget: span })

    noRect.closest = () => ({})

    el._captureOrigin({ target: noRect })

    expect(
      store.state.modalOrigin === null || typeof store.state.modalOrigin === TYPE_STRINGS.OBJECT
    ).toBe(true)
  })

  test('handlePreferences / handleLang commit, dispatch and window-less arms', () => {
    const el = mountNav()
    const btn = document.createElement(HTML_TAGS.BUTTON)

    el.handlePreferences(null)
    expect(store.getters.getPreferencesOpen()).toBe(true)
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)

    el.handleLang({ currentTarget: btn, preventDefault() {}, stopPropagation() {} })
    expect(store.getters.getLangDialogOpen()).toBe(true)
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)

    const w = globalThis.window

    delete globalThis.window
    el.handlePreferences(null)
    globalThis.window = w
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
  })

  test('render covers modal-empty, not-found, project-route, onBottom and translation arms', async () => {
    const el = mountNav()
    const prevRoute = router.currentRoute

    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      transform: 0,
      class: ATTR_VALUES.EMPTY,
      open: true,
      media: {},
    })
    expect(el.render()).toBe(ATTR_VALUES.EMPTY)
    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      transform: 0,
      class: ATTR_VALUES.EMPTY,
      open: false,
      media: {},
    })

    el.translations = {
      title: TEST_TEXT.HEADING,
      about: { description: TEST_TEXT.BODY },
      contact: TEST_TEXT.BODY,
      scrollup: TEST_TEXT.BODY,
      related: TEST_TEXT.BODY,
      menu: TEST_TEXT.BODY,
      close: TEST_TEXT.BODY,
      earthPlayground: TEST_TEXT.BODY,
      preferences: TEST_TEXT.BODY,
    }

    router.currentRoute = {
      name: ROUTE_NAMES.PROJECT,
      view: VIEW_TAGS.VIEW_PROJECT,
      meta: { projectRoute: true },
    }
    el._updateDom()

    await flush()

    el.onBottom = true
    el.activeSection = SECTIONS.CONTACT
    el._updateDom()

    await flush()

    el._translationsLocale = BAD_LOCALE
    expect(el.translations).toBeNull()

    el.translations = null
    el.onBottom = false
    el.activeSection = SECTIONS.HOME

    router.currentRoute = { name: ROUTE_NAMES.NOT_FOUND, view: VIEW_TAGS.VIEW_NOT_FOUND, meta: {} }
    el._updateDom()

    await flush()

    router.currentRoute = prevRoute
    el._updateDom()
  })

  test('menu cycle mounts widgets, settles, handles keys and tears down', async () => {
    const el = mountNav()
    const shadow = el.shadowRoot

    el._mountMenuWebGL()

    el._toggleMenu()
    expect(el._menuOpen).toBe(true)

    await flush()

    el._openMenu()

    await flush(ANIMATION_DURATIONS.MENU_SETTLE_DURATION + 100)
    expect(el._menuSettled).toBe(true)

    el._menuCloseBtn?.destroy?.()
    el._menuCloseBtn = null
    el._mountMenuWebGL()
    expect(el._menuCloseBtn?.drawProgress).toBe(1)

    const burger = el._burgerBtn

    el._mountBurgerWebGL()
    expect(el._burgerBtn).toBe(burger)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    keydown(KEYS.ESCAPE)
    expect(el._menuOpen).toBe(true)
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)

    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, true)
    keydown(KEYS.ESCAPE)
    expect(el._menuOpen).toBe(true)
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)

    keydown(KEYS.ARROW_LEFT)
    expect(el._menuOpen).toBe(true)

    shadow.querySelector(`.${NAV_CLASSES.NAV_PREF_BTN}`).click()
    expect(store.getters.getPreferencesOpen()).toBe(true)
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)

    shadow.querySelector(`.${NAV_CLASSES.NAV_LANG_OPEN_BTN}`).click()
    expect(store.getters.getLangDialogOpen()).toBe(true)
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)

    keydown(KEYS.ESCAPE)

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    expect(el._menuOpen).toBe(false)

    keydown(KEYS.ESCAPE)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
  })

  test('menu content buttons close and dispatch their handlers', async () => {
    const el = mountNav()

    await flush()

    const shadow = el.shadowRoot

    shadow.querySelector(`.${NAV_BURGER_CLASSES.NAV_BURGER_FALLBACK}`).click()
    expect(el._menuOpen).toBe(true)

    await flush()

    shadow.querySelector(`.${NAV_CLASSES.NAV_ABOUT_BTN}`).click()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    expect(el._menuOpen).toBe(false)

    el._toggleMenu()

    await flush()

    shadow.querySelector(`.${NAV_CLASSES.NAV_ACTION_BTN}`).click()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)

    el._toggleMenu()

    await flush()

    const push = jest.spyOn(router, 'push').mockResolvedValue(undefined)

    shadow
      .querySelector(
        `.${NAV_MENU_CLASSES.NAV_MENU_MODAL_ITEM}:not(.${NAV_CLASSES.NAV_ABOUT_BTN}):not(.${NAV_CLASSES.NAV_ACTION_BTN}):not(.${NAV_CLASSES.NAV_PREF_BTN}):not(.${NAV_CLASSES.NAV_LANG_OPEN_BTN})`
      )
      .click()
    expect(push).toHaveBeenCalled()

    push.mockRestore()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)

    el._toggleMenu()

    await flush()

    shadow.querySelector(`.${PREF_CLASSES.PREF_CLOSE_BTN}`).click()
    el._closeMenu()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    expect(el._menuOpen).toBe(false)
  })

  test('close timer guards: not-closing early return and settle timer with closed menu', async () => {
    const el = mountNav()

    el._toggleMenu()

    await flush()

    el._closeMenu()
    el._menuClosing = false

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    expect(el._menuOpen).toBe(true)

    el._closeMenu()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    expect(el._menuOpen).toBe(false)

    el._toggleMenu()

    await flush()

    el._menuOpen = false

    await flush(ANIMATION_DURATIONS.MENU_SETTLE_DURATION + 100)
    expect(el._menuSettled).toBe(false)
  })

  test('updateScrollState identical/different arms and router subscription refresh', async () => {
    const el = mountNav()
    const updateSpy = jest.spyOn(el, '_updateDom')

    el.updateScrollState(el.activeSection, el.onBottom)
    expect(updateSpy).not.toHaveBeenCalled()

    el.updateScrollState(SECTIONS.CONTACT, true)
    expect(el.onBottom).toBe(true)
    expect(updateSpy).toHaveBeenCalled()

    await router.push(ROUTE_PATHS.CONTACT).catch(() => {})
    expect(updateSpy.mock.calls.length).toBeGreaterThan(1)
  })

  test('_flagCanvas rebuild on locale change and flag widget lifecycle', async () => {
    const el = mountNav()
    const prevLocale = store.state.lang.locale

    el._toggleMenu()

    await flush()

    const firstCanvas = el._menuFlagCanvasEl

    expect(firstCanvas).not.toBeNull()

    store.state.lang.locale = LOCALES.DE
    expect(el._flagCanvas()).not.toBe(firstCanvas)

    el._closeMenu()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    expect(el._navFlags).toHaveLength(0)

    store.state.lang.locale = prevLocale
  }, 120000)

  test('scrollToContact non-home reduced, catch and document-less arms', () => {
    const el = mountNav()
    const prevRoute = router.currentRoute
    const origScroll = window.scrollTo

    router.currentRoute = { name: ROUTE_NAMES.NOT_FOUND, view: VIEW_TAGS.VIEW_NOT_FOUND, meta: {} }

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    el.scrollToContact()

    let calls = 0

    window.scrollTo = () => {
      if (calls++ === 0) throw new Error(TEST_TEXT.MISSING_KEY)
    }
    el.scrollToContact()
    window.scrollTo = origScroll

    const d = globalThis.document

    delete globalThis.document
    try {
      el.scrollToContact()
    } finally {
      globalThis.document = d
    }

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    router.currentRoute = prevRoute
  })

  test('toggle-while-open, burger canvas click and window-less guards', async () => {
    const el = mountNav()

    await flush()

    el._toggleMenu()

    await flush()
    expect(el._menuOpen).toBe(true)

    el._toggleMenu()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    expect(el._menuOpen).toBe(false)

    el._burgerCanvasEl.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    expect(el._menuOpen).toBe(true)

    await flush()

    el._closeMenu()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)

    const prevRoute = router.currentRoute

    router.currentRoute = { name: ROUTE_NAMES.NOT_FOUND, view: VIEW_TAGS.VIEW_NOT_FOUND, meta: {} }

    const w = globalThis.window

    delete globalThis.window
    expect(el.isPlaygroundPage).toBe(false)
    el.handleLang(null)
    globalThis.window = w
    router.currentRoute = prevRoute
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)
  })

  test('close timer else-arms when widgets were already released', async () => {
    const el = mountNav()

    el._toggleMenu()

    await flush()

    el._menuBg = null
    el._menuCloseBtn = null
    el._closeMenu()

    await flush(ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 100)
    expect(el._menuOpen).toBe(false)
  })

  test('onDestroy clears timers and destroys live widgets', async () => {
    const el = mountNav()

    el._toggleMenu()

    await flush()

    expect(el._menuBg).not.toBeNull()

    el.onDestroy()

    expect(el._menuBg).toBeNull()
    expect(el._burgerBtn).toBeNull()
    expect(el._menuCloseBtn).toBeNull()
    expect(el._menuSettleTimer).toBeNull()

    el.onDestroy()
  })
})
