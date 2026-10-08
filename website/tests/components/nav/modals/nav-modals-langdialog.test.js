/**
 * @file nav-modals-langdialog.test.js
 * @description Split from nav-modals.test.js — covers the "LangDialog" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { LangDialog } from '@website/components/dialogs/LangDialog.js'
import { LOCALES } from '@core/constants.js'
import { mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NAV_CLASSES } from '@core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { LANG_CLASSES } from '@core/tokens/classes/lang.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
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
// LangDialog
// ─────────────────────────────────────────────────────────────────────────────
describe('LangDialog', () => {
  let langEl
  let cleanup

  beforeEach(() => {
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)
    // Reduced motion makes genie-leave synchronous — click assertions must not
    // race the ~1.3s animation (the sibling tails describe does the same).
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
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
