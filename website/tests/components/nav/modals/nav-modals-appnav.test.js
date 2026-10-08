/**
 * @file nav-modals-appnav.test.js
 * @description Split from nav-modals.test.js — covers the "AppNav" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { AppNav } from '@website/components/nav/AppNav.js'
import { BASE_TITLE, ROUTE_NAMES, SECTIONS } from '@core/constants.js'
import { SCSS, mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { appText } from '@core/locale/ui-text.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NAV_BURGER_CLASSES, NAV_CLASSES, NAV_MENU_CLASSES } from '@core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { LANG_CLASSES } from '@core/tokens/classes/lang.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { NAV_TEXT } from '@core/tokens/strings/text.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { NAV_SELECTORS } from '@core/tokens/selectors/nav.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
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

// ─────────────────────────────────────────────────────────────────────────────
// AppNav
// ─────────────────────────────────────────────────────────────────────────────
describe('AppNav', () => {
  let navEl
  let cleanup

  beforeEach(() => {
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    navEl = new AppNav()
    cleanup = mount(navEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(navEl.shadowRoot).not.toBeNull()
  })

  test('renders navigation role and logo button with title', () => {
    navEl.translations = { title: 'LK PORTFOLIO' }
    navEl._updateDom()
    const nav = navEl.shadowRoot.querySelector(S.NAV)
    const logoBtn = navEl.shadowRoot.querySelector(S.NAV_LOGO_BTN)
    const logoDrawText = logoBtn.querySelector(COMPONENT_TAGS.DRAW_TEXT)

    expect(nav).not.toBeNull()
    expect(nav.getAttribute(ARIA_ATTRS.ROLE)).toBe(ARIA_ATTRS.ROLE_NAVIGATION)
    expect(logoBtn.textContent).toContain('LK PORTFOLIO')
    expect(logoBtn.getAttribute(ARIA_ATTRS.ARIA_LABEL)).toBe('LK PORTFOLIO')
    expect(logoDrawText).toBeTruthy()
    expect(logoDrawText.getAttribute(FORM_ATTRS.TEXT)).toBe('LK PORTFOLIO')
  })

  test('renders default Luis Krötz logo title when translations are null', () => {
    navEl.translations = null
    navEl._updateDom()
    const logoBtn = navEl.shadowRoot.querySelector(S.NAV_LOGO_BTN)
    expect(logoBtn.textContent).toContain(BASE_TITLE)
  })

  test('renders only logo and burger strip on standard routes (one menu for every breakpoint)', () => {
    navEl._updateDom()
    const desktopNav = navEl.shadowRoot.querySelector(S.NAV_DESKTOP)
    const mobileStrip = navEl.shadowRoot.querySelector(S.NAV_MOBILE_STRIP)
    expect(desktopNav).toBeNull()
    expect(mobileStrip).not.toBeNull()
    expect(navEl.shadowRoot.querySelector(S.NAV_PREF_BTN)).toBeNull()
  })

  test('open menu renders About, Action, Preferences, and Language items', () => {
    navEl.translations = {
      about: { description: NAV_TEXT.ABOUT_ME },
      contact: NAV_TEXT.GET_IN_TOUCH,
      preferences: 'Settings',
    }
    navEl._openMenu()

    const aboutBtn = navEl.shadowRoot.querySelector(S.NAV_ABOUT_BTN)
    const actionBtn = navEl.shadowRoot.querySelector(S.NAV_ACTION_BTN)
    const prefBtn = navEl.shadowRoot.querySelector(S.NAV_PREF_BTN)
    const langBtn = navEl.shadowRoot.querySelector(S.NAV_LANG_OPEN_BTN)

    expect(aboutBtn.textContent).toContain(NAV_TEXT.ABOUT_ME)
    expect(actionBtn.textContent).toContain(NAV_TEXT.GET_IN_TOUCH)
    expect(prefBtn.textContent).toContain('Settings')
    expect(langBtn).not.toBeNull()
  })

  test('action item reflects scroll-up state when onBottom is true', () => {
    navEl.translations = { scrollup: NAV_TEXT.SCROLL_UP }
    navEl._openMenu()
    navEl.updateScrollState(SECTION_IDS.CONTACT, true)
    const actionBtn = navEl.shadowRoot.querySelector(S.NAV_ACTION_BTN)
    expect(actionBtn.textContent).toContain(NAV_TEXT.SCROLL_UP)
    expect(actionBtn.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_ITEM_ACTIVE)).toBe(true)
  })

  test('updates activeSection class on logo when home is active', () => {
    navEl.updateScrollState(SECTIONS.HOME, false)
    const logoBtn = navEl.shadowRoot.querySelector(S.NAV_LOGO_BTN)
    expect(logoBtn.classList.contains(NAV_CLASSES.NAV_ACTIVE)).toBe(true)
  })

  test('updates active class on about item when about section is active', () => {
    navEl._openMenu()
    navEl.updateScrollState(SECTION_IDS.ABOUT, false)
    const aboutBtn = navEl.shadowRoot.querySelector(S.NAV_ABOUT_BTN)
    expect(aboutBtn.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_ITEM_ACTIVE)).toBe(true)
  })

  test('clicking Preferences button triggers togglePreferencesModal and dispatches event', () => {
    let windowEventFired = false
    const listener = () => {
      windowEventFired = true
    }
    window.addEventListener(APP_EVENTS.OPEN_PREFERENCES_MODAL, listener)

    navEl._openMenu()
    const prefBtn = navEl.shadowRoot.querySelector(S.NAV_PREF_BTN)
    prefBtn.click()

    expect(store.getters.getPreferencesOpen()).toBe(true)
    expect(store.getters.getModalOrigin()).toEqual({ x: expect.any(Number), y: expect.any(Number) })
    expect(windowEventFired).toBe(true)
    expect(navEl._menuOpen).toBe(true)
    window.removeEventListener(APP_EVENTS.OPEN_PREFERENCES_MODAL, listener)
  })

  test('clicking Language button triggers toggleLangDialog and dispatches event', () => {
    let windowEventFired = false
    const listener = () => {
      windowEventFired = true
    }
    window.addEventListener(APP_EVENTS.OPEN_LANG_DIALOG, listener)

    navEl._openMenu()
    const langBtn = navEl.shadowRoot.querySelector(S.NAV_LANG_OPEN_BTN)
    langBtn.click()

    expect(store.getters.getLangDialogOpen()).toBe(true)
    expect(windowEventFired).toBe(true)
    window.removeEventListener(APP_EVENTS.OPEN_LANG_DIALOG, listener)
  })

  test('not-found route omits the burger strip', () => {
    const prevRoute = router.currentRoute

    router.currentRoute = { name: ROUTE_NAMES.NOT_FOUND }
    navEl._updateDom()

    expect(navEl.shadowRoot.querySelector(S.NAV_MOBILE_STRIP)).toBeNull()

    router.currentRoute = prevRoute
    navEl._updateDom()
  })

  test('playground route omits the playground menu item', () => {
    const prevRoute = router.currentRoute

    router.currentRoute = { name: ROUTE_NAMES.EARTH_PLAYGROUND }
    navEl._openMenu()

    const labels = [...navEl.shadowRoot.querySelectorAll(COMPONENT_TAGS.DRAW_TEXT)].map((el) =>
      el.getAttribute(FORM_ATTRS.TEXT)
    )

    expect(labels).not.toContain(appText(CMS_KEYS.EARTH_PLAYGROUND))

    router.currentRoute = prevRoute
    navEl._closeMenu()
    navEl._updateDom()
  })

  test('docs route suppresses the language switcher; prefs/about/contact/playground remain', () => {
    const prevRoute = router.currentRoute

    router.currentRoute = { name: ROUTE_NAMES.DOCS, meta: { docsRoute: true } }
    navEl._openMenu()

    expect(navEl.shadowRoot.querySelector(S.NAV_LANG_OPEN_BTN)).toBeNull()
    expect(navEl.shadowRoot.querySelector(S.NAV_PREF_BTN)).not.toBeNull()
    expect(navEl.shadowRoot.querySelector(S.NAV_ABOUT_BTN)).not.toBeNull()

    const labels = [...navEl.shadowRoot.querySelectorAll(COMPONENT_TAGS.DRAW_TEXT)].map((el) =>
      el.getAttribute(FORM_ATTRS.TEXT)
    )

    expect(labels).toContain(appText(CMS_KEYS.CONTACT))
    expect(labels).toContain(appText(CMS_KEYS.EARTH_PLAYGROUND))

    router.currentRoute = prevRoute
    navEl._closeMenu()
    navEl._updateDom()
  })

  test('hides navigation completely when modal is open', () => {
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })
    navEl._updateDom()
    const nav = navEl.shadowRoot.querySelector(S.NAV)
    expect(nav).toBeNull()
  })

  test('store commits that change no render input skip the DOM wipe', () => {
    // First update seeds the render signature (the !prev arm renders once).
    navEl.onStoreUpdate()

    const spy = jest.spyOn(navEl, '_updateDom')

    // Dialog open/close + modal-origin commits don't feed the template —
    // the signature stays equal so the render is skipped entirely, which
    // keeps the menu's draw-text labels mounted (no letter replay).
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, true)
    store.commit(MODAL_MUTATIONS.SET_MODAL_ORIGIN, { x: 10, y: 10 })
    navEl.onStoreUpdate()

    expect(spy).not.toHaveBeenCalled()

    // A render-relevant change (modal open → nav empties) still renders.
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })

    expect(spy).toHaveBeenCalledTimes(1)

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)
    spy.mockRestore()
  })

  test('handleLogo calls window.scrollTo with top 0 when on home page', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    navEl.handleLogo(new Event(MOUSE_EVENTS.CLICK))
    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
    scrollToSpy.mockRestore()
  })

  test('goToAbout calls window.scrollTo with calculated position', () => {
    const aboutDiv = document.createElement(HTML_TAGS.DIV)
    aboutDiv.id = SECTION_IDS.ABOUT
    aboutDiv.getBoundingClientRect = () => ({
      top: 800,
      bottom: 1200,
      height: 400,
      left: 0,
      right: 1000,
      width: 1000,
    })
    document.body.appendChild(aboutDiv)

    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    navEl.goToAbout()
    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ top: expect.any(Number) }))
    scrollToSpy.mockRestore()
    document.body.removeChild(aboutDiv)
  })

  test('logo click dispatches handleLogo', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const logoBtn = navEl.shadowRoot.querySelector(S.NAV_LOGO_BTN)
    logoBtn.click()
    expect(scrollToSpy).toHaveBeenCalled()
    scrollToSpy.mockRestore()
  })

  test('about button click dispatches goToAbout', () => {
    const aboutDiv = document.createElement(HTML_TAGS.DIV)
    aboutDiv.id = SECTION_IDS.ABOUT
    aboutDiv.getBoundingClientRect = () => ({
      top: 750,
      bottom: 1150,
      height: 400,
      left: 0,
      right: 1000,
      width: 1000,
    })
    document.body.appendChild(aboutDiv)

    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    navEl._openMenu()
    const aboutBtn = navEl.shadowRoot.querySelector(S.NAV_ABOUT_BTN)
    aboutBtn.click()
    expect(scrollToSpy).toHaveBeenCalled()
    expect(navEl._menuClosing).toBe(true)
    scrollToSpy.mockRestore()
    document.body.removeChild(aboutDiv)
  })

  // ─── Fullscreen menu lifecycle ───────────────────────────────────────────
  test('_openMenu renders the modal with the open class and a fallback element', () => {
    navEl._openMenu()
    const modal = navEl.shadowRoot.querySelector(NAV_SELECTORS.NAV_MENU_MODAL)
    expect(modal).not.toBeNull()
    expect(modal.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_OPEN)).toBe(true)
    expect(modal.querySelector(NAV_SELECTORS.NAV_MENU_MODAL_FALLBACK)).not.toBeNull()
    expect(navEl._menuBg).not.toBeNull()
  })

  test('_closeMenu adds the closing class immediately and removes it after MENU_CLOSE_DURATION', () => {
    jest.useFakeTimers()
    navEl._openMenu()
    const modal = navEl.shadowRoot.querySelector(NAV_SELECTORS.NAV_MENU_MODAL)

    navEl._closeMenu()
    expect(modal.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_CLOSING)).toBe(true)
    expect(navEl._menuOpen).toBe(true)

    jest.advanceTimersByTime(ANIMATION_DURATIONS.MENU_CLOSE_DURATION)
    expect(navEl._menuOpen).toBe(false)
    const closed = navEl.shadowRoot.querySelector(NAV_SELECTORS.NAV_MENU_MODAL)
    expect(closed.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_OPEN)).toBe(false)
    expect(closed.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_CLOSING)).toBe(false)
    jest.useRealTimers()
  })

  test('re-render while open keeps the same menu canvas and WebGL instance (no context churn)', () => {
    navEl._openMenu()
    const canvas = navEl.shadowRoot.querySelector(`.${NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS}`)
    const bg = navEl._menuBg
    expect(bg.canvas).toBe(canvas)

    navEl._updateDom()
    const afterCanvas = navEl.shadowRoot.querySelector(`.${NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS}`)
    expect(afterCanvas).toBe(canvas)
    expect(navEl._menuBg).toBe(bg)
  })

  test('re-render keeps the same burger canvas and WebGL instance', () => {
    const canvas = navEl.shadowRoot.querySelector(`.${NAV_BURGER_CLASSES.NAV_BURGER_CANVAS}`)
    const burger = navEl._burgerBtn
    navEl._updateDom()
    navEl._updateDom()
    expect(navEl.shadowRoot.querySelector(`.${NAV_BURGER_CLASSES.NAV_BURGER_CANVAS}`)).toBe(canvas)
    expect(navEl._burgerBtn).toBe(burger)
  })

  test('preferences item keeps the menu open', () => {
    navEl._openMenu()
    const items = navEl.shadowRoot.querySelectorAll(`.${NAV_MENU_CLASSES.NAV_MENU_MODAL_ITEM}`)
    items[items.length - 2].click()
    expect(navEl._menuOpen).toBe(true)
    expect(navEl._menuClosing).toBe(false)
    const modal = navEl.shadowRoot.querySelector(NAV_SELECTORS.NAV_MENU_MODAL)
    expect(modal.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_OPEN)).toBe(true)
  })

  test('language item keeps the menu open', () => {
    navEl._openMenu()
    const items = navEl.shadowRoot.querySelectorAll(`.${NAV_MENU_CLASSES.NAV_MENU_MODAL_ITEM}`)
    items[items.length - 1].click()
    expect(navEl._menuOpen).toBe(true)
    expect(navEl._menuClosing).toBe(false)
    const modal = navEl.shadowRoot.querySelector(NAV_SELECTORS.NAV_MENU_MODAL)
    expect(modal.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_OPEN)).toBe(true)
  })

  test('earth playground item closes the menu', () => {
    navEl._openMenu()
    const items = navEl.shadowRoot.querySelectorAll(`.${NAV_MENU_CLASSES.NAV_MENU_MODAL_ITEM}`)
    if (items.length >= 3) {
      items[0].click()
      expect(navEl._menuClosing).toBe(true)
    } else {
      // Item is absent on playground routes
      expect(items.length).toBeLessThan(3)
    }
  })

  test('modal gains the settled class after MENU_SETTLE_DURATION and a re-render keeps it', () => {
    jest.useFakeTimers()
    navEl._openMenu()

    jest.advanceTimersByTime(ANIMATION_DURATIONS.MENU_SETTLE_DURATION)
    expect(navEl._menuSettled).toBe(true)

    navEl._updateDom()
    const modal = navEl.shadowRoot.querySelector(NAV_SELECTORS.NAV_MENU_MODAL)
    expect(modal.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_SETTLED)).toBe(true)
    jest.useRealTimers()
  })

  test('re-render while open carries shader reveal over', () => {
    navEl._openMenu()
    navEl._menuBg._reveal = 0.7

    navEl._updateDom()
    expect(navEl._menuBg._reveal).toBe(0.7)
  })

  // ─── SCSS structural assertions ───────────────────────────────────────────
  test('app.scss defines .nav with fixed positioning and z-index', () => {
    expect(SCSS.app).toMatch(/\.nav\s*\{[\s\S]*?position:\s*fixed/)
    expect(SCSS.app).toMatch(/\.nav\s*\{[\s\S]*?z-index:\s*100/)
  })

  test('app.scss defines .nav as a flex container', () => {
    expect(SCSS.app).toMatch(/\.nav\s*\{[\s\S]*?display:\s*flex/)
  })

  test('app.scss defines app-nav host element as position: fixed', () => {
    expect(SCSS.app).toMatch(/app-nav\s*\{[\s\S]*?position:\s*fixed/)
    expect(SCSS.app).toMatch(/app-nav\s*\{[\s\S]*?z-index:\s*1000/)
    expect(SCSS.app).toMatch(/app-nav\s*\{[\s\S]*?pointer-events:\s*none/)
  })

  test('app.scss defines .nav with pointer-events: auto', () => {
    expect(SCSS.app).toMatch(/\.nav\s*\{[\s\S]*?pointer-events:\s*auto/)
  })
})
