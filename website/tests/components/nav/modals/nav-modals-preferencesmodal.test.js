/**
 * @file nav-modals-preferencesmodal.test.js
 * @description Split from nav-modals.test.js — covers the "PreferencesModal" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { PreferencesModal } from '@website/components/dialogs/PreferencesModal.js'
import { THEME } from '@core/constants.js'
import { SCSS, mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NAV_CLASSES } from '@core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { LANG_CLASSES } from '@core/tokens/classes/lang.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'

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
