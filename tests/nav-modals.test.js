import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { AppNav } from '../src/components/AppNav.js'
import { PreferencesModal } from '../src/components/PreferencesModal.js'
import { LangDialog } from '../src/components/LangDialog.js'
import { THEME, MOTION, CLASSES, TAGS } from '../src/core/constants.js'
import { SCSS, mount } from './fixtures/test-constants.js'
import store from '../src/core/store.js'
import router from '../src/core/router.js'

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
    const nav = navEl.shadowRoot.querySelector('nav')
    const logoBtn = navEl.shadowRoot.querySelector('.nav-logo-btn')
    expect(nav).not.toBeNull()
    expect(nav.getAttribute('role')).toBe('navigation')
    expect(logoBtn.textContent).toContain('LK PORTFOLIO')
  })

  test('renders default LK logo title when translations are null', () => {
    navEl.translations = null
    navEl._updateDom()
    const logoBtn = navEl.shadowRoot.querySelector('.nav-logo-btn')
    expect(logoBtn.textContent).toContain('LK')
  })

  test('renders desktop nav and mobile strip on standard routes', () => {
    navEl._updateDom()
    const desktopNav = navEl.shadowRoot.querySelector(`.${CLASSES.NAV_DESKTOP}`)
    const mobileStrip = navEl.shadowRoot.querySelector(`.${CLASSES.NAV_MOBILE_STRIP}`)
    expect(desktopNav).not.toBeNull()
    expect(mobileStrip).not.toBeNull()
  })

  test('desktop nav renders About, Action, Preferences, and Language buttons', () => {
    navEl.translations = {
      about: { description: 'About Me' },
      contact: 'Get in Touch',
      preferences: 'Settings',
    }
    navEl._updateDom()

    const aboutBtn = navEl.shadowRoot.querySelector('.nav-about-btn')
    const actionBtn = navEl.shadowRoot.querySelector('.nav-action-btn')
    const prefBtn = navEl.shadowRoot.querySelector('.nav-pref-btn')
    const langBtn = navEl.shadowRoot.querySelector('.nav-lang-open-btn')

    expect(aboutBtn.textContent).toContain('About Me')
    expect(actionBtn.textContent).toContain('Get in Touch')
    expect(prefBtn.textContent).toContain('Settings')
    expect(langBtn).not.toBeNull()
  })

  test('action button reflects scroll-up state when onBottom is true', () => {
    navEl.translations = { scrollup: 'Back to Top' }
    navEl.updateScrollState('contact', true)
    const actionBtn = navEl.shadowRoot.querySelector('.nav-action-btn')
    expect(actionBtn.textContent).toContain('Back to Top')
    expect(actionBtn.classList.contains('scroll-up')).toBe(true)
  })

  test('updates activeSection class on logo when home is active', () => {
    navEl.updateScrollState('home', false)
    const logoBtn = navEl.shadowRoot.querySelector('.nav-logo-btn')
    expect(logoBtn.classList.contains('active')).toBe(true)
  })

  test('updates activeSection class on about button when about section is active', () => {
    navEl.updateScrollState('about', false)
    const aboutBtn = navEl.shadowRoot.querySelector('.nav-about-btn')
    expect(aboutBtn.classList.contains('active')).toBe(true)
  })

  test('clicking Preferences button triggers togglePreferencesModal and dispatches event', () => {
    let windowEventFired = false
    const listener = () => { windowEventFired = true }
    window.addEventListener('open-preferences-modal', listener)

    const prefBtn = navEl.shadowRoot.querySelector('.nav-pref-btn')
    prefBtn.click()

    expect(store.getters.getPreferencesOpen()).toBe(true)
    expect(windowEventFired).toBe(true)
    window.removeEventListener('open-preferences-modal', listener)
  })

  test('clicking Language button triggers toggleLangDialog and dispatches event', () => {
    let windowEventFired = false
    const listener = () => { windowEventFired = true }
    window.addEventListener('open-lang-dialog', listener)

    const langBtn = navEl.shadowRoot.querySelector('.nav-lang-open-btn')
    langBtn.click()

    expect(store.getters.getLangDialogOpen()).toBe(true)
    expect(windowEventFired).toBe(true)
    window.removeEventListener('open-lang-dialog', listener)
  })

  test('hides navigation completely when modal is open', () => {
    store.commit('setModal', { open: true })
    navEl._updateDom()
    const nav = navEl.shadowRoot.querySelector('nav')
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
    const logoBtn = navEl.shadowRoot.querySelector('.nav-logo-btn')
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
    const aboutBtn = navEl.shadowRoot.querySelector('.nav-about-btn')
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
    const backdrop = modalEl.shadowRoot.querySelector('.pref-backdrop')
    expect(backdrop).toBeNull()
    expect(modalEl.hasAttribute('open')).toBe(false)
  })

  test('renders backdrop, dialog, and options when open', () => {
    store.commit('togglePreferencesModal', true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    const backdrop = modalEl.shadowRoot.querySelector('.pref-backdrop')
    const dialog = modalEl.shadowRoot.querySelector('.pref-dialog')
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
    modalEl.shadowRoot.querySelector('.pref-close-btn').click()
    expect(store.getters.getPreferencesOpen()).toBe(false)
  })

  test('clicking Done button closes modal', () => {
    store.commit('togglePreferencesModal', true)
    modalEl._syncOpenState()
    modalEl._updateDom()
    modalEl.shadowRoot.querySelector('.pref-done-btn').click()
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
    const backdrop = langEl.shadowRoot.querySelector('.pref-backdrop')
    expect(backdrop).toBeNull()
  })

  test('opens and renders language selection options when open is set to true', () => {
    langEl.open = true
    expect(langEl.hasAttribute('open')).toBe(true)
    const dialog = langEl.shadowRoot.querySelector('.lang-dialog')
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
    const closeBtn = langEl.shadowRoot.querySelector('.pref-close-btn')
    closeBtn.click()
    expect(langEl.open).toBe(false)
  })
})
