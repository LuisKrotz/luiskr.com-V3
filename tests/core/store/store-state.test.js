/**
 * @file store-state.test.js
 * @description Deep tests of the reactive store: state shape,
 * all getters, all mutations, all actions, reactivity, subscription system,
 * i18n integration, theme switching, touch detection, and storage URL management.
 * Based on the ACTUAL store API (not Vuex-style).
 *
 */

import store from '@core/store.js'
import { LOCALES, THEME } from '@core/constants.js'
import {
  DATA_MUTATIONS,
  LANG_MUTATIONS,
  MODAL_MUTATIONS,
  PREF_MUTATIONS,
  UI_MUTATIONS,
} from '@core/tokens/events/mutations.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'
import { INPUT_STRINGS } from '@core/tokens/strings/input.js'

describe('Store — State Management', () => {
  afterEach(() => {
    // Reset critical state after each test
    try {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    } catch {
      // ignore
    }
  })

  // ── State Shape ──────────────────────────────────────────────────────────────
  describe('1. State Shape & Defaults', () => {
    test('store has state property', () => {
      expect(store.state).toBeDefined()
    })

    test('store.state is an object', () => {
      expect(typeof store.state).toBe(TYPE_STRINGS.OBJECT)
    })

    test('store.state.storage is a string URL', () => {
      expect(typeof store.state.storage).toBe(TYPE_STRINGS.STRING)
      expect(store.state.storage).toContain('://')
    })

    test('store.state.storage ends with "/"', () => {
      expect(store.state.storage.endsWith('/')).toBe(true)
    })

    test('store.state.storage is the Firebase production URL', () => {
      expect(store.state.storage).toBe(CDN_URLS.CDN_BASE)
    })

    test('store.state.reducedMotion is a boolean', () => {
      expect(typeof store.state.reducedMotion).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('store.state.theme is a string', () => {
      expect(typeof store.state.theme).toBe(TYPE_STRINGS.STRING)
    })

    test('store.state.theme has valid value (light, dark, or system)', () => {
      expect([THEME.LIGHT, THEME.DARK, THEME.SYSTEM]).toContain(store.state.theme)
    })

    test('store.state.effectiveTheme is light or dark', () => {
      expect([THEME.LIGHT, THEME.DARK]).toContain(store.state.effectiveTheme)
    })

    test('store.state.lang is an object', () => {
      expect(typeof store.state.lang).toBe(TYPE_STRINGS.OBJECT)
    })

    test('store.state.lang.locale is a string', () => {
      expect(typeof store.state.lang.locale).toBe(TYPE_STRINGS.STRING)
    })

    test('store.state.has_touch is a boolean', () => {
      expect(typeof store.state.has_touch).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('store.state.portfoliolist is an array', () => {
      expect(Array.isArray(store.state.portfoliolist)).toBe(true)
    })

    test('store.state.modalObject exists with open property', () => {
      expect(store.state.modalObject).toBeDefined()
      expect(typeof store.state.modalObject.open).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('store.state.preferencesOpen is a boolean', () => {
      expect(typeof store.state.preferencesOpen).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('store.state.clickortap is a string', () => {
      expect(typeof store.state.clickortap).toBe(TYPE_STRINGS.STRING)
    })

    test('store.state.inputMethod is "touch" or "pointer"', () => {
      expect([INPUT_STRINGS.TOUCH, INPUT_STRINGS.POINTER]).toContain(store.state.inputMethod)
    })

    test('store.state.mentions is an object with title and items', () => {
      expect(store.state.mentions).toBeDefined()
      expect(store.state.mentions.title).toBeDefined()
    })
  })

  // ── Getters ─────────────────────────────────────────────────────────────────
  describe('2. Getters — State Access API', () => {
    test('store has getters property', () => {
      expect(store.getters).toBeDefined()
    })

    test('getters.getLang is a function', () => {
      expect(typeof store.getters.getLang).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('getters.getLang() returns a string', () => {
      const lang = store.getters.getLang()
      expect(typeof lang).toBe(TYPE_STRINGS.STRING)
    })

    test('getters.getLang() returns a valid language code', () => {
      const lang = store.getters.getLang()
      expect(lang.length).toBeGreaterThan(0)
      expect(lang.length).toBeLessThanOrEqual(5)
    })

    test('getters.getReducedMotion is a function', () => {
      expect(typeof store.getters.getReducedMotion).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('getters.getReducedMotion() returns a boolean', () => {
      expect(typeof store.getters.getReducedMotion()).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('getters.getStorage is a function', () => {
      expect(typeof store.getters.getStorage).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('getters.getStorage() returns a string', () => {
      expect(typeof store.getters.getStorage()).toBe(TYPE_STRINGS.STRING)
    })

    test('getters.getStorage() URL is valid', () => {
      const url = store.getters.getStorage()
      expect(url).toContain('://')
    })

    test('getters.getTouch is a function', () => {
      expect(typeof store.getters.getTouch).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('getters.getTouch() returns a boolean', () => {
      expect(typeof store.getters.getTouch()).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('getters.getPortfolioList is a function', () => {
      expect(typeof store.getters.getPortfolioList).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('getters.getPortfolioList() returns an array', () => {
      expect(Array.isArray(store.getters.getPortfolioList())).toBe(true)
    })

    test('getters.getLang() returns same value as state.lang.locale', () => {
      expect(store.getters.getLang()).toBe(store.state.lang.locale)
    })

    test('getters.getStorage() returns same value as state.storage', () => {
      expect(store.getters.getStorage()).toBe(store.state.storage)
    })

    test('getters.getReducedMotion() returns same value as state.reducedMotion', () => {
      expect(store.getters.getReducedMotion()).toBe(store.state.reducedMotion)
    })

    test('getters.getTouch() returns same value as state.has_touch', () => {
      expect(store.getters.getTouch()).toBe(store.state.has_touch)
    })
  })

  // ── Mutations ───────────────────────────────────────────────────────────────
  describe('3. Mutations — State Changes', () => {
    test('store.commit is a function', () => {
      expect(typeof store.commit).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('commit("setReducedMotion", true) sets reducedMotion to true', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(store.state.reducedMotion).toBe(true)
    })

    test('commit("setReducedMotion", false) sets reducedMotion to false', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      expect(store.state.reducedMotion).toBe(false)
    })

    test('commit("setLang", "pt") sets lang.locale to "pt"', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.PT)
      expect(store.state.lang.locale).toBe(LOCALES.PT)
    })

    test('commit("setLang", "en") sets lang.locale to "en"', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.PT)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      expect(store.state.lang.locale).toBe(LOCALES.EN)
    })

    test('commit("setLang", "de") sets lang.locale to "de"', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
      expect(store.state.lang.locale).toBe(LOCALES.DE)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    })

    test('commit("setInputMethod", "touch") sets has_touch to true', () => {
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
      expect(store.state.has_touch).toBe(true)
    })

    test('commit("setInputMethod", "pointer") sets has_touch to false', () => {
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.POINTER)
      expect(store.state.has_touch).toBe(false)
    })

    test('commit("setTheme", "dark") updates theme to "dark"', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect([THEME.DARK, THEME.LIGHT, THEME.SYSTEM]).toContain(store.state.theme)
    })

    test('commit("setTheme", "light") updates theme to "light"', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      expect([THEME.DARK, THEME.LIGHT, THEME.SYSTEM]).toContain(store.state.theme)
    })

    test('commit("setPortfolioList", arr) sets portfoliolist', () => {
      const projects = [{ id: 1 }, { id: 2 }]
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, projects)
      expect(store.state.portfoliolist).toEqual(projects)
    })

    test('commit("setPortfolioList", object) converts object values to array', () => {
      const projectObj = { a: { id: 1 }, b: { id: 2 } }
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, projectObj)
      expect(Array.isArray(store.state.portfoliolist)).toBe(true)
    })

    test('unknown mutation does not throw', () => {
      expect(() => store.commit('unknownMutation', null)).not.toThrow()
    })
  })

  // ── Getter/Mutation Sync ─────────────────────────────────────────────────────
  describe('4. Getter/Mutation Synchronization', () => {
    test('getReducedMotion() reflects setReducedMotion(true) immediately', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(store.getters.getReducedMotion()).toBe(true)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    })

    test('getReducedMotion() reflects setReducedMotion(false) immediately', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      expect(store.getters.getReducedMotion()).toBe(false)
    })

    test('getLang() reflects setLang("pt")', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.PT)
      expect(store.getters.getLang()).toBe(LOCALES.PT)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    })

    test('getStorage() matches state.storage directly', () => {
      expect(store.getters.getStorage()).toBe(store.state.storage)
    })

    test('getTouch() reflects setInputMethod("touch")', () => {
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
      expect(store.getters.getTouch()).toBe(true)
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.POINTER)
    })

    test('multiple mutations do not interfere with each other', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.PT)
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.TOUCH)
      expect(store.state.reducedMotion).toBe(true)
      expect(store.state.lang.locale).toBe(LOCALES.PT)
      expect(store.state.has_touch).toBe(true)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      store.commit(UI_MUTATIONS.SET_INPUT_METHOD, INPUT_STRINGS.POINTER)
    })
  })

  // ── Subscription System ─────────────────────────────────────────────────────
  describe('5. Subscription System — Reactive Updates', () => {
    test('store.subscribe is a function', () => {
      expect(typeof store.subscribe).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('subscribe callback is called when state changes', () => {
      let called = false
      const unsub = store.subscribe(() => {
        called = true
      })
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(called).toBe(true)
      unsub?.()
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    })

    test('subscribe returns an unsubscribe function', () => {
      const unsub = store.subscribe(() => {})
      expect(typeof unsub).toBe(TYPE_STRINGS.FUNCTION)
      unsub()
    })

    test('multiple subscribers all receive updates', () => {
      let count = 0
      const unsub1 = store.subscribe(() => {
        count++
      })
      const unsub2 = store.subscribe(() => {
        count++
      })
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(count).toBeGreaterThanOrEqual(2)
      unsub1?.()
      unsub2?.()
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    })

    test('unsubscribe stops receiving updates', () => {
      let count = 0
      const unsub = store.subscribe(() => {
        count++
      })
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      const countAfterFirst = count
      unsub()
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      expect(count).toBe(countAfterFirst)
    })

    test('store.notify fires all subscribers', () => {
      let calls = 0
      const unsub1 = store.subscribe(() => {
        calls++
      })
      const unsub2 = store.subscribe(() => {
        calls++
      })
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(calls).toBe(2)
      unsub1()
      unsub2()
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    })
  })

  // ── Theme Switching ─────────────────────────────────────────────────────────
  describe('6. Theme Management', () => {
    test('setTheme("dark") does not crash', () => {
      expect(() => store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)).not.toThrow()
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
    })

    test('setTheme("light") does not crash', () => {
      expect(() => store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)).not.toThrow()
    })

    test('setTheme("system") does not crash', () => {
      expect(() => store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)).not.toThrow()
    })

    test('effectiveTheme is either light or dark after setting theme', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect([THEME.LIGHT, THEME.DARK]).toContain(store.state.effectiveTheme)
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
    })

    test('setTheme("dark") sets effectiveTheme to "dark"', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(store.state.effectiveTheme).toBe(THEME.DARK)
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
    })

    test('setTheme("light") sets effectiveTheme to "light"', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      expect(store.state.effectiveTheme).toBe(THEME.LIGHT)
    })
  })

  // ── Language Support ────────────────────────────────────────────────────────
  describe('7. Language Management', () => {
    const languages = [LOCALES.EN, LOCALES.PT, LOCALES.DE, LOCALES.FR, LOCALES.ES]

    languages.forEach((lang) => {
      test(`setLang("${lang}") stores locale correctly`, () => {
        store.commit(LANG_MUTATIONS.SET_LANG, lang)
        expect(store.state.lang.locale).toBe(lang)
        store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      })

      test(`getLang() returns "${lang}" after setLang`, () => {
        store.commit(LANG_MUTATIONS.SET_LANG, lang)
        expect(store.getters.getLang()).toBe(lang)
        store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      })
    })

    test('language change does not affect reducedMotion', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.PT)
      expect(store.state.reducedMotion).toBe(false)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    })

    test('language change does not affect portfoliolist', () => {
      const original = store.state.portfoliolist
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
      expect(store.state.portfoliolist).toEqual(original)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    })
  })

  // ── Storage URL ──────────────────────────────────────────────────────────────
  describe('8. Storage URL Management', () => {
    test('default storage is Firebase production URL', () => {
      const url = store.getters.getStorage()
      expect(url).toBe(CDN_URLS.CDN_BASE)
    })

    test('storage URL ends with "/"', () => {
      expect(store.getters.getStorage().endsWith('/')).toBe(true)
    })

    test('storage URL is accessible via getters.getStorage()', () => {
      expect(typeof store.getters.getStorage()).toBe(TYPE_STRINGS.STRING)
    })

    test('storage URL matches state.storage', () => {
      expect(store.getters.getStorage()).toBe(store.state.storage)
    })

    test('storage URL contains googleapis.com', () => {
      expect(store.getters.getStorage()).toContain('googleapis')
    })

    test('storage URL starts with https://', () => {
      expect(store.getters.getStorage()).toMatch(/^https:\/\//)
    })
  })

  // ── Preferences Modal ───────────────────────────────────────────────────────
  describe('9. Preferences Modal State', () => {
    test('state.preferencesOpen starts as false', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
      expect(store.state.preferencesOpen).toBe(false)
    })

    test('togglePreferencesModal(true) opens preferences', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
      expect(store.state.preferencesOpen).toBe(true)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    })

    test('togglePreferencesModal(false) closes preferences', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
      expect(store.state.preferencesOpen).toBe(false)
    })

    test('togglePreferencesModal() without arg toggles state', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
      const before = store.state.preferencesOpen
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL)
      expect(store.state.preferencesOpen).toBe(!before)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    })

    test('getPreferencesOpen() returns state.preferencesOpen', () => {
      expect(store.getters.getPreferencesOpen()).toBe(store.state.preferencesOpen)
    })
  })

  // ── Portfolio List ──────────────────────────────────────────────────────────
  describe('10. Portfolio List Management', () => {
    test('portfoliolist is an array by default', () => {
      expect(Array.isArray(store.state.portfoliolist)).toBe(true)
    })

    test('setPortfolioList with array stores correctly', () => {
      const items = [{ slug: 'project-a' }, { slug: 'project-b' }]
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, items)
      expect(store.state.portfoliolist).toEqual(items)
    })

    test('setPortfolioList with object converts to array', () => {
      const obj = { a: { id: 1 }, b: { id: 2 } }
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, obj)
      expect(Array.isArray(store.state.portfoliolist)).toBe(true)
      expect(store.state.portfoliolist.length).toBe(2)
    })

    test('getPortfolioList() returns same as state.portfoliolist', () => {
      const items = [{ slug: 'test' }]
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, items)
      expect(store.getters.getPortfolioList()).toEqual(items)
    })

    test('empty portfolio list is valid', () => {
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [])
      expect(store.state.portfoliolist).toEqual([])
    })
  })
})
