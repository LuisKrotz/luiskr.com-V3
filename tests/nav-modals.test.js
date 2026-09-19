import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { AppNav } from '../src/components/AppNav.js'
import { PreferencesModal } from '../src/components/PreferencesModal.js'
import { LangDialog } from '../src/components/LangDialog.js'
import { THEME, MOTION, CLASSES, TAGS, TEXT } from '../src/core/constants.js'
import { SCSS, mount } from './fixtures/test-constants.js'
import store from '../src/core/store.js'
import router from '../src/core/router.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
  NAV:              `nav`,
  NAV_LOGO_BTN:     `.${CLASSES.NAV_LOGO_BTN}`,
  NAV_ABOUT_BTN:    `.${CLASSES.NAV_ABOUT_BTN}`,
  NAV_ACTION_BTN:   `.${CLASSES.NAV_ACTION_BTN}`,
  NAV_PREF_BTN:     `.${CLASSES.NAV_PREF_BTN}`,
  NAV_LANG_OPEN_BTN:`.${CLASSES.NAV_LANG_OPEN_BTN}`,
  PREF_BACKDROP:    `.${CLASSES.PREF_BACKDROP}`,
  PREF_DIALOG:      `.${CLASSES.PREF_DIALOG}`,
  PREF_CLOSE_BTN:   `.${CLASSES.PREF_CLOSE_BTN}`,
  PREF_DONE_BTN:    `.${CLASSES.PREF_DONE_BTN}`,
  LANG_DIALOG:      `.${CLASSES.LANG_DIALOG}`,
  NAV_DESKTOP:      `.${CLASSES.NAV_DESKTOP}`,
  NAV_MOBILE_STRIP: `.${CLASSES.NAV_MOBILE_STRIP}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// AppNav
// ─────────────────────────────────────────────────────────────────────────────
describe('AppNav', () => {
  let navEl
  let cleanup

  beforeEach(() => {
    store.commit('setModal', { open: false })
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
    expect(nav.getAttribute('role')).toBe('navigation')
    expect(logoBtn.textContent).toContain('LK PORTFOLIO')
  })

  test('renders default LK logo title when translations are null', () => {
    navEl.translations = null
    navEl._updateDom()
    const logoBtn = navEl.shadowRoot.querySelector(S.NAV_LOGO_BTN)
    expect(logoBtn.textContent).toContain('LK')
  })

  test('renders desktop nav and mobile strip on standard routes', () => {
    navEl._updateDom()
    const desktopNav = navEl.shadowRoot.querySelector(S.NAV_DESKTOP)
    const mobileStrip = navEl.shadowRoot.querySelector(S.NAV_MOBILE_STRIP)
    expect(desktopNav).not.toBeNull()
    expect(mobileStrip).not.toBeNull()
  })

  test('desktop nav renders About, Action, Preferences, and Language buttons', () => {
    navEl.translations = {
      about: { description: TEXT.ABOUT_ME },
      contact: TEXT.GET_IN_TOUCH,
      preferences: 'Settings',
    }
    navEl._updateDom()

    const aboutBtn = navEl.shadowRoot.querySelector(S.NAV_ABOUT_BTN)
    const actionBtn = navEl.shadowRoot.querySelector(S.NAV_ACTION_BTN)
    const prefBtn = navEl.shadowRoot.querySelector(S.NAV_PREF_BTN)
    const langBtn = navEl.shadowRoot.querySelector(S.NAV_LANG_OPEN_BTN)

    expect(aboutBtn.textContent).toContain(TEXT.ABOUT_ME)
    expect(actionBtn.textContent).toContain(TEXT.GET_IN_TOUCH)
    expect(prefBtn.textContent).toContain('Settings')
    expect(langBtn).not.toBeNull()
  })

  test('action button reflects scroll-up state when onBottom is true', () => {
    navEl.translations = { scrollup: TEXT.SCROLL_UP }
    navEl.updateScrollState('contact', true)
    const actionBtn = navEl.shadowRoot.querySelector(S.NAV_ACTION_BTN)
    expect(actionBtn.textContent).toContain(TEXT.SCROLL_UP)
    expect(actionBtn.classList.contains('scroll-up')).toBe(true)
  })

  test('updates activeSection class on logo when home is active', () => {
    navEl.updateScrollState('home', false)
    const logoBtn = navEl.shadowRoot.querySelector(S.NAV_LOGO_BTN)
    expect(logoBtn.classList.contains('active')).toBe(true)
  })

  test('updates activeSection class on about button when about section is active', () => {
    navEl.updateScrollState('about', false)
    const aboutBtn = navEl.shadowRoot.querySelector(S.NAV_ABOUT_BTN)
    expect(aboutBtn.classList.contains('active')).toBe(true)
  })

  test('clicking Preferences button triggers togglePreferencesModal and dispatches event', () => {
    let windowEventFired = false
    const listener = () => { windowEventFired = true }
    window.addEventListener('open-preferences-modal', listener)

    const prefBtn = navEl.shadowRoot.querySelector(S.NAV_PREF_BTN)
    prefBtn.click()

    expect(store.getters.getPreferencesOpen()).toBe(true)
    expect(windowEventFired).toBe(true)
    window.removeEventListener('open-preferences-modal', listener)
  })

  test('clicking Language button triggers toggleLangDialog and dispatches event', () => {
    let windowEventFired = false
    const listener = () => { windowEventFired = true }
    window.addEventListener('open-lang-dialog', listener)

    const langBtn = navEl.shadowRoot.querySelector(S.NAV_LANG_OPEN_BTN)
    langBtn.click()

    expect(store.getters.getLangDialogOpen()).toBe(true)
    expect(windowEventFired).toBe(true)
    window.removeEventListener('open-lang-dialog', listener)
  })

  test('hides navigation completely when modal is open', () => {
    store.commit('setModal', { open: true })
    navEl._updateDom()
    const nav = navEl.shadowRoot.querySelector(S.NAV)
    expect(nav).toBeNull()
  })

  test('handleLogo calls window.scrollTo with top 0 when on home page', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    navEl.handleLogo(new Event('click'))
    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
    scrollToSpy.mockRestore()
  })

  test('goToAbout calls window.scrollTo with calculated position', () => {
    const aboutDiv = document.createElement('div')
    aboutDiv.id = 'about'
    aboutDiv.getBoundingClientRect = () => ({ top: 800, bottom: 1200, height: 400, left: 0, right: 1000, width: 1000 })
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
    const aboutDiv = document.createElement('div')
    aboutDiv.id = 'about'
    aboutDiv.getBoundingClientRect = () => ({ top: 750, bottom: 1150, height: 400, left: 0, right: 1000, width: 1000 })
    document.body.appendChild(aboutDiv)

    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const aboutBtn = navEl.shadowRoot.querySelector(S.NAV_ABOUT_BTN)
    aboutBtn.click()
    expect(scrollToSpy).toHaveBeenCalled()
    scrollToSpy.mockRestore()
    document.body.removeChild(aboutDiv)
  })

  // ─── SCSS structural assertions ───────────────────────────────────────────
  test('app.scss defines .nav with fixed positioning and z-index', () => {
    expect(SCSS.app).toMatch(/\.nav\s*\{[\s\S]*?position:\s*fixed/)
    expect(SCSS.app).toMatch(/\.nav\s*\{[\s\S]*?z-index:\s*100/)
  })

  test('app.scss defines .nav-desktop flex on desktop', () => {
    expect(SCSS.app).toMatch(/\.nav-desktop\s*\{[\s\S]*?display:\s*flex/)
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
    store.commit('togglePreferencesModal', false)
    modalEl = new PreferencesModal()
    cleanup = mount(modalEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(modalEl.shadowRoot).not.toBeNull()
  })

  test('does not render backdrop when closed', () => {
    store.commit('togglePreferencesModal', false)
    modalEl._syncOpenState()
    modalEl._updateDom()
    const backdrop = modalEl.shadowRoot.querySelector(S.PREF_BACKDROP)
    expect(backdrop).toBeNull()
    expect(modalEl.hasAttribute('open')).toBe(false)
  })

  test('renders backdrop, dialog, and options when open', () => {
    store.commit('togglePreferencesModal', true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    const backdrop = modalEl.shadowRoot.querySelector(S.PREF_BACKDROP)
    const dialog = modalEl.shadowRoot.querySelector(S.PREF_DIALOG)
    expect(backdrop).not.toBeNull()
    expect(dialog).not.toBeNull()
    expect(modalEl.hasAttribute('open')).toBe(true)
  })

  test('renders System, Dark, and Light theme options', () => {
    store.commit('togglePreferencesModal', true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    expect(modalEl.shadowRoot.querySelector('button[data-theme="system"]')).not.toBeNull()
    expect(modalEl.shadowRoot.querySelector('button[data-theme="dark"]')).not.toBeNull()
    expect(modalEl.shadowRoot.querySelector('button[data-theme="light"]')).not.toBeNull()
  })

  test('selecting Dark theme commits setTheme to store', () => {
    store.commit('togglePreferencesModal', true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector('button[data-theme="dark"]').click()
    expect(store.getters.getTheme()).toBe(THEME.DARK)
  })

  test('selecting Light theme commits setTheme to store', () => {
    store.commit('togglePreferencesModal', true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector('button[data-theme="light"]').click()
    expect(store.getters.getTheme()).toBe(THEME.LIGHT)
  })

  test('selecting Reduced Motion commits setReducedMotion true to store', () => {
    store.commit('togglePreferencesModal', true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector('button[data-motion="reduced"]').click()
    expect(store.getters.getReducedMotion()).toBe(true)
  })

  test('clicking close button closes modal', () => {
    store.commit('togglePreferencesModal', true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector(S.PREF_CLOSE_BTN).click()
    expect(store.getters.getPreferencesOpen()).toBe(false)
  })

  test('clicking Done button closes modal', () => {
    store.commit('togglePreferencesModal', true)
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
    expect(prefModal.hasAttribute('open')).toBe(true)
    expect(store.getters.getPreferencesOpen()).toBe(true)

    prefModal.open = false
    expect(prefModal.open).toBe(false)
    expect(prefModal.hasAttribute('open')).toBe(false)
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
    expect(SCSS.app).toMatch(/preferences-modal:not\(\[open\]\):not\(\.is-open\)[\s\S]*?display:\s*none/)
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
    store.commit('toggleLangDialog', false)
    langEl = new LangDialog()
    cleanup = mount(langEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(langEl.shadowRoot).not.toBeNull()
  })

  test('is closed by default', () => {
    expect(langEl.hasAttribute('open')).toBe(false)
    const backdrop = langEl.shadowRoot.querySelector(S.PREF_BACKDROP)
    expect(backdrop).toBeNull()
  })

  test('opens and renders language selection options when open is set to true', () => {
    langEl.open = true
    expect(langEl.hasAttribute('open')).toBe(true)
    const dialog = langEl.shadowRoot.querySelector(S.LANG_DIALOG)
    expect(dialog).not.toBeNull()
    const options = langEl.shadowRoot.querySelectorAll('[data-lang]')
    expect(options.length).toBeGreaterThanOrEqual(4)
  })

  test('selecting language updates store and closes dialog', () => {
    langEl.open = true
    const brOption = langEl.shadowRoot.querySelector('[data-lang="br"]')
    brOption.click()
    expect(store.getters.getLang()).toBe('br')
    expect(langEl.open).toBe(false)
  })

  test('clicking close button closes dialog', () => {
    langEl.open = true
    const closeBtn = langEl.shadowRoot.querySelector(S.PREF_CLOSE_BTN)
    closeBtn.click()
    expect(langEl.open).toBe(false)
  })
})
