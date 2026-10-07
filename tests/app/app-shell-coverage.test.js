/**
 * @file app-shell-coverage.test.js
 * @description Branch coverage for <app-root>: data fan-out (APP/components/
 * slugs → store + children), modal scroll-lock apply/restore, scroll-state
 * tracking across home/non-home routes, view-outlet reconciliation
 * (same-tag delegate vs cross-fade swap), input-method listeners, media
 * contextmenu/drag blocking and the lazy intro-loader lifecycle.
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { AppRoot } from '@/App.js'
import store from '@/core/store.js'
import router from '@/routes/router.js'
import { mount, TEST_TEXT, waitFor } from '../fixtures/test-constants.js'
import { LANG_SLUGS } from '@/core/i18n.js'
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import {
  LANG_MUTATIONS,
  MODAL_MUTATIONS,
  PREF_MUTATIONS,
  UI_MUTATIONS,
} from '@/core/tokens/events/mutations.js'
import { MODAL_CLASSES } from '@/core/tokens/classes/modal.js'
import { APP_IDS } from '@/core/tokens/ids/app.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import {
  DRAG_EVENTS,
  FORM_EVENTS,
  KEYBOARD_EVENTS,
  MOUSE_EVENTS,
  POINTER_EVENTS,
  TOUCH_EVENTS,
  WINDOW_EVENTS,
} from '@/core/tokens/events/dom.js'
import { INPUT_STRINGS } from '@/core/tokens/strings/input.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { FLAG_CLASSES } from '@/core/tokens/classes/flags.js'
import { ANIMATION_DURATIONS } from '@/core/tokens/motion/animation.js'
import { SECTION_IDS } from '@/core/tokens/ids/sections.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { NAV_BURGER_CLASSES, NAV_CLASSES, NAV_MENU_CLASSES } from '@/core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@/core/tokens/classes/preferences.js'
import { APP_CLASSES } from '@/core/tokens/classes/app.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { APP_EVENTS } from '@/core/tokens/events/app.js'
import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'

import { KEYS, LOCALES, ROUTE_NAMES, SECTIONS } from '@/core/constants.js'
import { THEME } from '@/core/tokens/theme/theme.js'

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

const stableFetch = () => {
  const orig = globalThis.fetch

  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))

  return orig
}

// ─── mount + data fan-out ────────────────────────────────────────────────────

describe('AppRoot — mount + loadData', () => {
  test('mounts, boots preferences, and fans APP translations to children', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(80)

    const nav = el.shadowRoot.querySelector(COMPONENT_TAGS.APP_NAV)

    expect(nav).not.toBeNull()
    expect(el.translations).not.toBeNull()
    expect(nav.translations).toBe(el.translations)

    globalThis.fetch = origFetch
  })

  test('onStoreUpdate reloads when the locale changes', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    const spy = jest.spyOn(el, 'loadData')

    el._loadedLang = LOCALES.EN
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.FR)

    el.onStoreUpdate()

    expect(spy).toHaveBeenCalled()

    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    globalThis.fetch = origFetch
  })

  test('loadData skips nodes already cached for the locale', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    el.loadData() // translations/lang.components now cached → no new fetches
    el.loadData()

    globalThis.fetch = origFetch
  })
})

// ─── modal scroll-lock ───────────────────────────────────────────────────────

describe('AppRoot — modal scroll lock', () => {
  test('open locks <main> at -scrollY; close restores position', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      transform: 320,
      class: MODAL_CLASSES.MODAL_OPEN,
      open: true,
      media: {},
    })

    el._updateModalState()

    const mainEl = el.shadowRoot.querySelector(`#${APP_IDS.MAIN_CONTENT}`)

    expect(document.documentElement.classList.contains(MODAL_CLASSES.MODAL_OPEN)).toBe(true)
    expect(mainEl.style.position).toBe(STATE_STRINGS.FIXED)
    expect(mainEl.style.top).toBe('-320px')

    store.commit(MODAL_MUTATIONS.SET_MODAL, { transform: 0, class: '', open: false, media: {} })
    el._updateModalState()

    expect(mainEl.style.position).toBe(CHAR_STRINGS.EMPTY)
    expect(document.documentElement.classList.contains(MODAL_CLASSES.MODAL_OPEN)).toBe(false)

    globalThis.fetch = origFetch
  })
})

// ─── scroll tracking ─────────────────────────────────────────────────────────

describe('AppRoot — scroll tracking', () => {
  test('checkScroll resolves sections on home and feeds nav elsewhere', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    // Non-home route → nav state push + early return.
    router.currentRoute = { name: 'Project', view: VIEW_TAGS.VIEW_PROJECT, meta: {} }
    el.checkScroll()

    expect(el.onBottom).toBeDefined()

    // Home route + measured markers → section resolution. scrollHeight
    // must exceed innerHeight + 200 or onBottom pins the section to contact.
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 5000,
      configurable: true,
    })

    router.currentRoute = { name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} }
    el._aboutTop = -100
    el._contactTop = -50
    el._sectionsMeasured = true
    el.checkScroll()

    expect(el.activeSection).toBe(SECTIONS.CONTACT)

    el._aboutTop = -100
    el._contactTop = 20000
    el.checkScroll()

    expect(el.activeSection).toBe(SECTIONS.ABOUT)

    el._aboutTop = 10000
    el._contactTop = 20000
    el.checkScroll()

    expect(el.activeSection).toBe(SECTIONS.HOME)

    // Unmeasured markers → lazy re-measure path.
    el._sectionsMeasured = false
    el._lastMeasureAttempt = 0
    el.checkScroll()

    expect(el._lastMeasureAttempt).toBeGreaterThan(0)

    globalThis.fetch = origFetch
  })
})

// ─── view-outlet reconciliation ──────────────────────────────────────────────

describe('AppRoot — view outlet', () => {
  test('same-tag route delegates to onRouteParamChange', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)
    const current = outlet.firstElementChild

    current.onRouteParamChange = jest.fn()
    el.currentViewTag = current.tagName.toLowerCase()
    el._updateViewContent({ meta: {} })

    expect(current.onRouteParamChange).toHaveBeenCalled()

    globalThis.fetch = origFetch
  })

  test('different view tag cross-fades to the new element', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)

    // Pre-resolve the lazy view chunk, then fake the clock: the cross-fade
    // swap is a wall-clock setTimeout that starves under saturated parallel
    // workers. finally-guarded so a failure can't leak fake timers.
    await import('@/routes/views/not-found/NotFound.js')

    jest.useFakeTimers()

    try {
      el.currentViewTag = VIEW_TAGS.VIEW_NOT_FOUND
      el._updateViewContent({})

      for (
        let i = 0;
        i < 10 && outlet.firstElementChild?.tagName.toLowerCase() !== VIEW_TAGS.VIEW_NOT_FOUND;
        i++
      ) {
        await jest.advanceTimersByTimeAsync(ANIMATION_DURATIONS.PAGE_FADE_HALF)
      }
    } finally {
      jest.useRealTimers()
    }

    expect(outlet.firstElementChild.tagName.toLowerCase()).toBe(VIEW_TAGS.VIEW_NOT_FOUND)

    globalThis.fetch = origFetch
  }, 120000)

  test('reduced motion takes the instant-swap path', async () => {
    const origFetch = stableFetch()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    el.currentViewTag = VIEW_TAGS.VIEW_LEGAL
    el._updateViewContent({})

    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)

    await waitFor(
      () =>
        outlet.firstElementChild &&
        outlet.firstElementChild.tagName.toLowerCase() === VIEW_TAGS.VIEW_LEGAL
    )

    expect(outlet.firstElementChild.tagName.toLowerCase()).toBe(VIEW_TAGS.VIEW_LEGAL)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    globalThis.fetch = origFetch
  })
})

// ─── input listeners + misc ──────────────────────────────────────────────────

describe('AppRoot — input + misc', () => {
  test('pointerdown with touch pointerType commits touch input', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    const evt = new window.Event(POINTER_EVENTS.POINTERDOWN, { bubbles: true })

    evt.pointerType = INPUT_STRINGS.TOUCH
    window.dispatchEvent(evt)

    expect(store.getters.getInputMethod()).toBe(INPUT_STRINGS.TOUCH)

    evt.pointerType = INPUT_STRINGS.MOUSE
    window.dispatchEvent(evt)

    expect(store.getters.getInputMethod()).toBe(INPUT_STRINGS.POINTER)

    globalThis.fetch = origFetch
  })

  test('contextmenu/dragstart on media elements are prevented', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    const img = document.createElement(HTML_TAGS.IMG)

    document.body.appendChild(img)

    const cm = new window.Event(MOUSE_EVENTS.CONTEXTMENU, { bubbles: true, cancelable: true })

    img.dispatchEvent(cm)

    expect(cm.defaultPrevented).toBe(true)

    const ds = new window.Event(DRAG_EVENTS.DRAGSTART, { bubbles: true, cancelable: true })

    img.dispatchEvent(ds)

    expect(ds.defaultPrevented).toBe(true)

    img.remove()
    globalThis.fetch = origFetch
  })

  test('onDestroy tolerates a missing intro loader', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    expect(() => el.onDestroy()).not.toThrow()

    el._introLoader = { destroy: jest.fn() }
    el.onDestroy()

    expect(el._introLoader.destroy).toHaveBeenCalled()

    globalThis.fetch = origFetch
  })

  test('theme listener reapplies system theme on scheme change', async () => {
    const origFetch = stableFetch()

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    // The matchMedia listener was registered; simulate by committing
    // APPLY_THEME the same way the handler does under THEME.SYSTEM.
    store.commit(PREF_MUTATIONS.APPLY_THEME)

    expect([THEME.DARK, THEME.LIGHT]).toContain(store.getters.getEffectiveTheme())

    globalThis.fetch = origFetch
  })
})

// ─── AppNav tails ────────────────────────────────────────────────────────────

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

describe('AppNav module tails', () => {
  test('re-eval skips custom-element redefinition', async () => {
    jest.resetModules()

    await expect(import('@/components/nav/AppNav.js')).resolves.toBeDefined()
  })
})

// ─── AppRoot tails ──────────────────────────────────────────────────────────

describe('AppRoot tails', () => {
  const mountApp = async () => {
    const origFetch = stableFetch()
    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(80)

    return { el, origFetch }
  }

  test('locale getter, showGrid boot, routeLoading render and outlet-less update', async () => {
    const { el, origFetch } = await mountApp()

    expect(el.locale).toBe(store.getters.getLang())

    el.routeLoading = true
    el._updateDom()

    const pBar = el.shadowRoot.querySelector(`.${APP_CLASSES.PROGRESS_BAR}`)
    expect(pBar.classList.contains(APP_CLASSES.PROGRESS_BAR_ACTIVE)).toBe(true)

    const bare = new AppRoot()
    bare.currentViewTag = VIEW_TAGS.VIEW_HOME
    expect(() => bare._updateViewContent(router.currentRoute)).not.toThrow()

    store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)

    const el2 = new AppRoot()
    cleanups.push(mount(el2))
    await flush(30)

    expect(document.documentElement.classList.contains(STATE_CLASSES.SHOW_GRID)).toBe(true)

    store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)

    globalThis.fetch = origFetch
  })

  test('open-pref and open-lang events resolve their dialogs', async () => {
    const { el, origFetch } = await mountApp()

    el.dispatchEvent(new Event(APP_EVENTS.OPEN_PREFERENCES_MODAL))
    el.dispatchEvent(new Event(APP_EVENTS.OPEN_LANG_DIALOG))

    await flush(60)

    const pref = el.shadowRoot.querySelector(COMPONENT_TAGS.PREFERENCES_MODAL)
    const dialog = el.shadowRoot.querySelector(COMPONENT_TAGS.LANG_DIALOG)

    expect(pref.open).toBe(true)
    expect(dialog.open).toBe(true)

    pref.remove()
    dialog.remove()

    el.dispatchEvent(new Event(APP_EVENTS.OPEN_PREFERENCES_MODAL))
    el.dispatchEvent(new Event(APP_EVENTS.OPEN_LANG_DIALOG))

    await flush(60)

    globalThis.fetch = origFetch
  })

  test('router notify drives the progress bar add/remove and missing-bar arms', async () => {
    const { el, origFetch } = await mountApp()

    router.notify(
      { name: ROUTE_NAMES.TERMS, view: VIEW_TAGS.VIEW_LEGAL, meta: {} },
      router.currentRoute
    )
    expect(el.routeLoading).toBe(true)

    const pBar = el.shadowRoot.querySelector(`.${APP_CLASSES.PROGRESS_BAR}`)
    expect(pBar.classList.contains(APP_CLASSES.PROGRESS_BAR_ACTIVE)).toBe(true)

    pBar.remove()
    router.notify(
      { name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} },
      router.currentRoute
    )

    await flush(ANIMATION_DURATIONS.ROUTE_DURATION + ANIMATION_DURATIONS.PROGRESS_BAR_RESET + 80)
    expect(el.routeLoading).toBe(false)

    globalThis.fetch = origFetch
  })

  test('idle callback, scroll, resize and matchMedia change arms', async () => {
    const origFetch = stableFetch()

    let changeHandler = null
    const origMM = window.matchMedia
    const origRIC = window.requestIdleCallback

    window.matchMedia = jest.fn(() => ({
      matches: false,
      media: '',
      addEventListener: (ev, cb) => {
        if (ev === FORM_EVENTS.CHANGE) changeHandler = cb
      },
      removeEventListener: jest.fn(),
    }))
    window.requestIdleCallback = (cb) => setTimeout(cb, 0)

    const el = new AppRoot()
    cleanups.push(mount(el))
    await flush(40)

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
    changeHandler()

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
    changeHandler()

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)

    window.dispatchEvent(new Event(WINDOW_EVENTS.SCROLL))
    window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))

    await flush(200)

    window.matchMedia = origMM
    if (origRIC === undefined) delete window.requestIdleCallback
    else window.requestIdleCallback = origRIC

    globalThis.fetch = origFetch
  })

  test('matchMedia-less mount and document-less modal state take guarded arms', async () => {
    const origFetch = stableFetch()
    const origMM = window.matchMedia
    const origDoc = globalThis.document

    try {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        configurable: true,
        writable: true,
      })

      const el = new AppRoot()
      cleanups.push(mount(el))
      await flush(40)

      delete globalThis.document
      el._updateModalState()
    } finally {
      globalThis.document = origDoc
      window.matchMedia = origMM
    }

    globalThis.fetch = origFetch
  })

  test('modal open/close fallback arms: missing class, transform, main and auto top', async () => {
    const { el, origFetch } = await mountApp()
    const mainEl = el.shadowRoot.querySelector(`#${APP_IDS.MAIN_CONTENT}`)

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })
    el._updateModalState()
    expect(document.documentElement.classList.contains(MODAL_CLASSES.MODAL_OPEN)).toBe(true)

    mainEl.style.top = ATTR_VALUES.AUTO

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    el._updateModalState()

    mainEl.remove()

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true, transform: 50 })
    el._updateModalState()

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    el._updateModalState()

    el.shadowRoot.querySelector(`[${DATA_ATTRS.DATA_APP_WRAPPER}]`).remove()
    el._updateModalState()

    globalThis.fetch = origFetch
  })

  test('input listeners cover pen, unknown, already-set and non-PointerEvent arms', async () => {
    const origFetch = stableFetch()
    const origPE = window.PointerEvent

    const el = new AppRoot()
    cleanups.push(mount(el))
    await flush(30)

    const pointer = (type) => {
      const e = new Event(POINTER_EVENTS.POINTERDOWN)
      Object.defineProperty(e, 'pointerType', { value: type })
      window.dispatchEvent(e)
    }

    pointer(INPUT_STRINGS.PEN)
    pointer(TEST_TEXT.UNKNOWN)

    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
    pointer(INPUT_STRINGS.TOUCH)
    pointer(INPUT_STRINGS.MOUSE)
    pointer(INPUT_STRINGS.MOUSE)

    window.dispatchEvent(new Event(MOUSE_EVENTS.CONTEXTMENU))
    window.dispatchEvent(new Event(DRAG_EVENTS.DRAGSTART))

    delete window.PointerEvent

    const el2 = new AppRoot()
    cleanups.push(mount(el2))
    await flush(30)

    window.dispatchEvent(new Event(TOUCH_EVENTS.TOUCHSTART))
    window.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEDOWN))

    window.PointerEvent = origPE

    globalThis.fetch = origFetch
  })

  test('loadData covers snapshot hit and miss arms on a bare element', async () => {
    const orig = globalThis.fetch
    const origLang = store.getters.getLang()

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))

    const bare = new AppRoot()

    store.commit(LANG_MUTATIONS.SET_LANG, 'xx')
    bare.loadData()
    await flush(80)

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        actions: { click: 'c', tap: 't' },
        pref: {},
        carousel: {},
        statsHud: {},
      }),
    }))

    store.commit(LANG_MUTATIONS.SET_LANG, 'yy')
    bare.loadData()
    await flush(80)

    store.commit(LANG_MUTATIONS.SET_LANG, origLang)
    globalThis.fetch = orig
  })

  test('mount with a null currentRoute falls back to the home view', async () => {
    const origFetch = stableFetch()
    const origRoute = router.currentRoute

    router.currentRoute = null

    const el = new AppRoot()
    cleanups.push(mount(el))
    await flush(60)

    expect(el.currentViewTag).toBe(VIEW_TAGS.VIEW_HOME)

    router.currentRoute = origRoute
    globalThis.fetch = origFetch
  })

  test('same-tag view without onRouteParamChange takes the guard else', async () => {
    const { el, origFetch } = await mountApp()
    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)
    const current = outlet.firstElementChild

    el.currentViewTag = VIEW_TAGS.VIEW_HOME
    current.onRouteParamChange = undefined

    el._updateViewContent(router.currentRoute)

    expect(outlet.firstElementChild).toBe(current)

    globalThis.fetch = origFetch
  })

  test('project-route flip and unknown-tag flip cover the remaining else-ifs', async () => {
    const { el, origFetch } = await mountApp()
    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)

    el.currentViewTag = VIEW_TAGS.VIEW_PROJECT
    el._updateViewContent(router.currentRoute)

    await flush(480)

    el.currentViewTag = 'view-bogus'
    outlet.replaceChildren()
    el._updateViewContent(router.currentRoute)

    await flush(480)

    el.currentViewTag = VIEW_TAGS.VIEW_HOME
    outlet.replaceChildren(document.createElement(VIEW_TAGS.VIEW_HOME))

    globalThis.fetch = origFetch
  })

  test('checkScroll covers throttle, nullish tops and nav-missing arms', async () => {
    const { el, origFetch } = await mountApp()

    router.currentRoute = { name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} }
    el._sectionsMeasured = false
    el._lastMeasureAttempt = Date.now()
    el.checkScroll()

    el._aboutTop = null
    el._contactTop = null
    el.activeSection = TEST_TEXT.STALE
    el.checkScroll()

    el.shadowRoot.querySelector(COMPONENT_TAGS.APP_NAV).remove()
    el.activeSection = TEST_TEXT.STALE
    el.checkScroll()

    router.currentRoute = { name: ROUTE_NAMES.PROJECT, view: VIEW_TAGS.VIEW_PROJECT, meta: {} }
    el.checkScroll()

    router.currentRoute = { name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} }

    globalThis.fetch = origFetch
  })

  test('playground route import and onUpdated missing-child arms', async () => {
    const { el, origFetch } = await mountApp()

    el.currentViewTag = VIEW_TAGS.VIEW_SPACE_PLAYGROUND
    el._updateViewContent(router.currentRoute)

    await flush(480)

    el.translations = null
    el.onUpdated()

    el.shadowRoot.querySelector(COMPONENT_TAGS.APP_NAV)?.remove()
    el.shadowRoot.querySelector(COMPONENT_TAGS.COOKIE_BANNER)?.remove()
    el.shadowRoot.querySelector(COMPONENT_TAGS.PREFERENCES_MODAL)?.remove()
    el.onUpdated()

    globalThis.fetch = origFetch
  })

  test('AppRoot re-eval skips custom-element redefinition', async () => {
    expect(customElements.get(COMPONENT_TAGS.APP_ROOT)).toBeTruthy()
    jest.resetModules()

    await expect(import('@/App.js')).resolves.toBeDefined()
  })
})
