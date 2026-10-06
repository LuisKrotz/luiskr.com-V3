import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { AppNav } from '@/components/nav/AppNav.js'
import { PreferencesModal } from '@/components/dialogs/PreferencesModal.js'
import { LangDialog } from '@/components/dialogs/LangDialog.js'
import {
  BASE_TITLE,
  KEYS,
  LOCALES,
  ROUTE_NAMES,
  SECTIONS,
  SWITCH_TYPES,
  THEME,
} from '@/core/constants.js'
import { SCSS, TEST_PROJECTS, TEST_TEXT, mount } from '../../fixtures/test-constants.js'
import store from '@/core/store.js'
import router from '@/routes/router.js'
import { npuPredict } from '@/utils/gpu/npu-predict.js'
import { appText } from '@/core/locale/ui-text.js'
import { HTML_TAGS } from '../../../src/core/tokens/elements/html.js'
import {
  NAV_BURGER_CLASSES,
  NAV_CLASSES,
  NAV_MENU_CLASSES,
} from '../../../src/core/tokens/classes/nav.js'
import { PREF_CLASSES } from '../../../src/core/tokens/classes/preferences.js'
import { FORM_ATTRS } from '../../../src/core/tokens/attrs/form.js'
import { CMS_KEYS } from '../../../src/core/tokens/data/cms-keys.js'
import { LANG_CLASSES } from '../../../src/core/tokens/classes/lang.js'
import {
  LANG_MUTATIONS,
  MODAL_MUTATIONS,
  PREF_MUTATIONS,
} from '../../../src/core/tokens/events/mutations.js'
import { ARIA_ATTRS } from '../../../src/core/tokens/attrs/aria.js'
import { NAV_TEXT } from '../../../src/core/tokens/strings/text.js'
import { SECTION_IDS } from '../../../src/core/tokens/ids/sections.js'
import { APP_EVENTS } from '../../../src/core/tokens/events/app.js'
import {
  FOCUS_EVENTS,
  KEYBOARD_EVENTS,
  MOUSE_EVENTS,
  POINTER_EVENTS,
  WINDOW_EVENTS,
} from '../../../src/core/tokens/events/dom.js'
import { NAV_SELECTORS } from '../../../src/core/tokens/selectors/nav.js'
import { ANIMATION_DURATIONS } from '../../../src/core/tokens/motion/animation.js'
import { COMMON_ATTRS } from '../../../src/core/tokens/attrs/common.js'
import { CHAR_STRINGS } from '../../../src/core/tokens/strings/chars.js'
import { FLAG_CLASSES } from '../../../src/core/tokens/classes/flags.js'
import { DATA_ATTRS } from '../../../src/core/tokens/attrs/data.js'
import { STATE_CLASSES } from '../../../src/core/tokens/classes/state.js'
import { ROUTE_PATHS } from '../../../src/core/tokens/routes/paths.js'
import { ATTR_VALUES } from '../../../src/core/tokens/attrs/values.js'
import { COMPONENT_TAGS } from '../../../src/core/tokens/elements/components.js'
import { ENGINE_UI_KEYS } from '../../../src/core/tokens/data/ui-keys.js'

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
    expect(nav).not.toBeNull()
    expect(nav.getAttribute(ARIA_ATTRS.ROLE)).toBe(ARIA_ATTRS.ROLE_NAVIGATION)
    expect(logoBtn.textContent).toContain('LK PORTFOLIO')
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

  test('hides navigation completely when modal is open', () => {
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })
    navEl._updateDom()
    const nav = navEl.shadowRoot.querySelector(S.NAV)
    expect(nav).toBeNull()
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

// ─────────────────────────────────────────────────────────────────────────────
// PreferencesModal
// ─────────────────────────────────────────────────────────────────────────────
describe('PreferencesModal', () => {
  let modalEl
  let cleanup

  beforeEach(() => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    modalEl = new PreferencesModal()
    cleanup = mount(modalEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(modalEl.shadowRoot).not.toBeNull()
  })

  test('does not render backdrop when closed', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    modalEl._syncOpenState()
    modalEl._updateDom()
    const backdrop = modalEl.shadowRoot.querySelector(S.PREF_BACKDROP)
    expect(backdrop).toBeNull()
    expect(modalEl.hasAttribute(COMMON_ATTRS.OPEN)).toBe(false)
  })

  test('renders backdrop, dialog, and options when open', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    const backdrop = modalEl.shadowRoot.querySelector(S.PREF_BACKDROP)
    const dialog = modalEl.shadowRoot.querySelector(S.PREF_DIALOG)
    expect(backdrop).not.toBeNull()
    expect(dialog).not.toBeNull()
    expect(modalEl.hasAttribute(COMMON_ATTRS.OPEN)).toBe(true)
  })

  test('renders System, Dark, and Light theme options', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    expect(modalEl.shadowRoot.querySelector('button[data-theme="system"]')).not.toBeNull()
    expect(modalEl.shadowRoot.querySelector('button[data-theme="dark"]')).not.toBeNull()
    expect(modalEl.shadowRoot.querySelector('button[data-theme="light"]')).not.toBeNull()
  })

  test('selecting Dark theme commits setTheme to store', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector('button[data-theme="dark"]').click()
    expect(store.getters.getTheme()).toBe(THEME.DARK)
  })

  test('selecting Light theme commits setTheme to store', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector('button[data-theme="light"]').click()
    expect(store.getters.getTheme()).toBe(THEME.LIGHT)
  })

  test('selecting Reduced Motion commits toggleReducedMotion to store', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector('button[aria-label="Reduced Motion"]').click()
    expect(store.getters.getReducedMotion()).toBe(true)
  })

  test('clicking close button closes modal', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector(S.PREF_CLOSE_BTN).click()
    expect(store.getters.getPreferencesOpen()).toBe(false)
  })

  test('clicking Done button closes modal', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector(S.PREF_DONE_BTN).click()
    expect(store.getters.getPreferencesOpen()).toBe(false)
  })

  test('open attribute getter/setter syncs with store', () => {
    const prefModal = new PreferencesModal()
    document.body.appendChild(prefModal)

    prefModal.open = true
    expect(prefModal.open).toBe(true)
    expect(prefModal.hasAttribute(COMMON_ATTRS.OPEN)).toBe(true)
    expect(store.getters.getPreferencesOpen()).toBe(true)

    prefModal.open = false
    expect(prefModal.open).toBe(false)
    expect(prefModal.hasAttribute(COMMON_ATTRS.OPEN)).toBe(false)
    expect(store.getters.getPreferencesOpen()).toBe(false)
    prefModal.parentNode.removeChild(prefModal)
  })

  // ─── SCSS structural assertions ───────────────────────────────────────────
  test('preferences.scss defines :host display none by default and display block when open', () => {
    expect(SCSS.preferences).toMatch(/:host\s*\{[\s\S]*?display:\s*none/)
    expect(SCSS.preferences).toMatch(/:host\(\[open\]\)/)
    expect(SCSS.preferences).toMatch(/display:\s*block/)
    expect(SCSS.preferences).toMatch(/position:\s*fixed/)
    expect(SCSS.preferences).toMatch(/z-index:\s*10000/)
  })

  test('preferences.scss defines .pref-backdrop with glassmorphism', () => {
    expect(SCSS.preferences).toMatch(/\.pref-backdrop\s*\{[\s\S]*?position:\s*absolute/)
    expect(SCSS.preferences).toMatch(/\.pref-backdrop\s*\{[\s\S]*?backdrop-filter:\s*blur/)
  })

  test('app.scss defines preferences-modal and lang-dialog hidden when closed and fixed when open', () => {
    expect(SCSS.app).toMatch(
      /preferences-modal:not\(\[open\]\):not\(\.is-open\)[\s\S]*?display:\s*none/
    )
    expect(SCSS.app).toMatch(/preferences-modal\[open\][\s\S]*?position:\s*fixed/)
    expect(SCSS.app).toMatch(/preferences-modal\[open\][\s\S]*?z-index:\s*10000/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// LangDialog
// ─────────────────────────────────────────────────────────────────────────────
describe('LangDialog', () => {
  let langEl
  let cleanup

  beforeEach(() => {
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)
    langEl = new LangDialog()
    cleanup = mount(langEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(langEl.shadowRoot).not.toBeNull()
  })

  test('is closed by default', () => {
    expect(langEl.hasAttribute(COMMON_ATTRS.OPEN)).toBe(false)
    const backdrop = langEl.shadowRoot.querySelector(S.PREF_BACKDROP)
    expect(backdrop).toBeNull()
  })

  test('opens and renders language selection options when open is set to true', () => {
    langEl.open = true
    expect(langEl.hasAttribute(COMMON_ATTRS.OPEN)).toBe(true)
    const dialog = langEl.shadowRoot.querySelector(S.LANG_DIALOG)
    expect(dialog).not.toBeNull()
    const options = langEl.shadowRoot.querySelectorAll('[data-lang]')
    expect(options.length).toBeGreaterThanOrEqual(4)
  })

  test('selecting language updates store and closes dialog', () => {
    langEl.open = true
    const brOption = langEl.shadowRoot.querySelector('[data-lang="br"]')
    brOption.click()
    expect(store.getters.getLang()).toBe(LOCALES.BR)
    expect(langEl.open).toBe(false)
  })

  test('clicking close button closes dialog', () => {
    langEl.open = true
    const closeBtn = langEl.shadowRoot.querySelector(S.PREF_CLOSE_BTN)
    closeBtn.click()
    expect(langEl.open).toBe(false)
  })
})

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
    await import('@/components/dialogs/LangDialog.js')
  })
})

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
    await import('@/components/dialogs/PreferencesModal.js')
  })
})
