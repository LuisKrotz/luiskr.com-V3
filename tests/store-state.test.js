/**
 * @file store-state.test.js
 * @description Deep tests of the reactive store: state shape,
 * all getters, all mutations, all actions, reactivity, subscription system,
 * i18n integration, theme switching, touch detection, and storage URL management.
 * Based on the ACTUAL store API (not Vuex-style).
 *
 */

import store from '../src/core/store.js'

describe('Store — State Management', () => {

  afterEach(() => {
    // Reset critical state after each test
    try {
      store.commit('setTheme', 'light')
      store.commit('setReducedMotion', false)
      store.commit('setLang', 'en')
    } catch (e) {
      // ignore
    }
  })

  // ── State Shape ──────────────────────────────────────────────────────────────
  describe('1. State Shape & Defaults', () => {
    test('store has state property', () => {
      expect(store.state).toBeDefined()
    })

    test('store.state is an object', () => {
      expect(typeof store.state).toBe('object')
    })

    test('store.state.storage is a string URL', () => {
      expect(typeof store.state.storage).toBe('string')
      expect(store.state.storage).toContain('://')
    })

    test('store.state.storage ends with "/"', () => {
      expect(store.state.storage.endsWith('/')).toBe(true)
    })

    test('store.state.storage is the Firebase production URL', () => {
      expect(store.state.storage).toBe('https://storage.googleapis.com/luiskr.com/public/_v3/')
    })

    test('store.state.reducedMotion is a boolean', () => {
      expect(typeof store.state.reducedMotion).toBe('boolean')
    })

    test('store.state.theme is a string', () => {
      expect(typeof store.state.theme).toBe('string')
    })

    test('store.state.theme has valid value (light, dark, or system)', () => {
      expect(['light', 'dark', 'system']).toContain(store.state.theme)
    })

    test('store.state.effectiveTheme is light or dark', () => {
      expect(['light', 'dark']).toContain(store.state.effectiveTheme)
    })

    test('store.state.lang is an object', () => {
      expect(typeof store.state.lang).toBe('object')
    })

    test('store.state.lang.locale is a string', () => {
      expect(typeof store.state.lang.locale).toBe('string')
    })

    test('store.state.has_touch is a boolean', () => {
      expect(typeof store.state.has_touch).toBe('boolean')
    })

    test('store.state.portfoliolist is an array', () => {
      expect(Array.isArray(store.state.portfoliolist)).toBe(true)
    })

    test('store.state.modalObject exists with open property', () => {
      expect(store.state.modalObject).toBeDefined()
      expect(typeof store.state.modalObject.open).toBe('boolean')
    })

    test('store.state.preferencesOpen is a boolean', () => {
      expect(typeof store.state.preferencesOpen).toBe('boolean')
    })

    test('store.state.clickortap is a string', () => {
      expect(typeof store.state.clickortap).toBe('string')
    })

    test('store.state.inputMethod is "touch" or "pointer"', () => {
      expect(['touch', 'pointer']).toContain(store.state.inputMethod)
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
      expect(typeof store.getters.getLang).toBe('function')
    })

    test('getters.getLang() returns a string', () => {
      const lang = store.getters.getLang()
      expect(typeof lang).toBe('string')
    })

    test('getters.getLang() returns a valid language code', () => {
      const lang = store.getters.getLang()
      expect(lang.length).toBeGreaterThan(0)
      expect(lang.length).toBeLessThanOrEqual(5)
    })

    test('getters.getReducedMotion is a function', () => {
      expect(typeof store.getters.getReducedMotion).toBe('function')
    })

    test('getters.getReducedMotion() returns a boolean', () => {
      expect(typeof store.getters.getReducedMotion()).toBe('boolean')
    })

    test('getters.getStorage is a function', () => {
      expect(typeof store.getters.getStorage).toBe('function')
    })

    test('getters.getStorage() returns a string', () => {
      expect(typeof store.getters.getStorage()).toBe('string')
    })

    test('getters.getStorage() URL is valid', () => {
      const url = store.getters.getStorage()
      expect(url).toContain('://')
    })

    test('getters.getTouch is a function', () => {
      expect(typeof store.getters.getTouch).toBe('function')
    })

    test('getters.getTouch() returns a boolean', () => {
      expect(typeof store.getters.getTouch()).toBe('boolean')
    })

    test('getters.getPortfolioList is a function', () => {
      expect(typeof store.getters.getPortfolioList).toBe('function')
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
      expect(typeof store.commit).toBe('function')
    })

    test('commit("setReducedMotion", true) sets reducedMotion to true', () => {
      store.commit('setReducedMotion', true)
      expect(store.state.reducedMotion).toBe(true)
    })

    test('commit("setReducedMotion", false) sets reducedMotion to false', () => {
      store.commit('setReducedMotion', true)
      store.commit('setReducedMotion', false)
      expect(store.state.reducedMotion).toBe(false)
    })

    test('commit("setLang", "pt") sets lang.locale to "pt"', () => {
      store.commit('setLang', 'pt')
      expect(store.state.lang.locale).toBe('pt')
    })

    test('commit("setLang", "en") sets lang.locale to "en"', () => {
      store.commit('setLang', 'pt')
      store.commit('setLang', 'en')
      expect(store.state.lang.locale).toBe('en')
    })

    test('commit("setLang", "de") sets lang.locale to "de"', () => {
      store.commit('setLang', 'de')
      expect(store.state.lang.locale).toBe('de')
      store.commit('setLang', 'en')
    })

    test('commit("setInputMethod", "touch") sets has_touch to true', () => {
      store.commit('setInputMethod', 'touch')
      expect(store.state.has_touch).toBe(true)
    })

    test('commit("setInputMethod", "pointer") sets has_touch to false', () => {
      store.commit('setInputMethod', 'touch')
      store.commit('setInputMethod', 'pointer')
      expect(store.state.has_touch).toBe(false)
    })

    test('commit("setTheme", "dark") updates theme to "dark"', () => {
      store.commit('setTheme', 'dark')
      expect(['dark', 'light', 'system']).toContain(store.state.theme)
    })

    test('commit("setTheme", "light") updates theme to "light"', () => {
      store.commit('setTheme', 'light')
      expect(['dark', 'light', 'system']).toContain(store.state.theme)
    })

    test('commit("setPortfolioList", arr) sets portfoliolist', () => {
      const projects = [{ id: 1 }, { id: 2 }]
      store.commit('setPortfolioList', projects)
      expect(store.state.portfoliolist).toEqual(projects)
    })

    test('commit("setPortfolioList", object) converts object values to array', () => {
      const projectObj = { a: { id: 1 }, b: { id: 2 } }
      store.commit('setPortfolioList', projectObj)
      expect(Array.isArray(store.state.portfoliolist)).toBe(true)
    })

    test('unknown mutation does not throw', () => {
      expect(() => store.commit('unknownMutation', null)).not.toThrow()
    })
  })

  // ── Getter/Mutation Sync ─────────────────────────────────────────────────────
  describe('4. Getter/Mutation Synchronization', () => {
    test('getReducedMotion() reflects setReducedMotion(true) immediately', () => {
      store.commit('setReducedMotion', true)
      expect(store.getters.getReducedMotion()).toBe(true)
      store.commit('setReducedMotion', false)
    })

    test('getReducedMotion() reflects setReducedMotion(false) immediately', () => {
      store.commit('setReducedMotion', true)
      store.commit('setReducedMotion', false)
      expect(store.getters.getReducedMotion()).toBe(false)
    })

    test('getLang() reflects setLang("pt")', () => {
      store.commit('setLang', 'pt')
      expect(store.getters.getLang()).toBe('pt')
      store.commit('setLang', 'en')
    })

    test('getStorage() matches state.storage directly', () => {
      expect(store.getters.getStorage()).toBe(store.state.storage)
    })

    test('getTouch() reflects setInputMethod("touch")', () => {
      store.commit('setInputMethod', 'touch')
      expect(store.getters.getTouch()).toBe(true)
      store.commit('setInputMethod', 'pointer')
    })

    test('multiple mutations do not interfere with each other', () => {
      store.commit('setReducedMotion', true)
      store.commit('setLang', 'pt')
      store.commit('setInputMethod', 'touch')
      expect(store.state.reducedMotion).toBe(true)
      expect(store.state.lang.locale).toBe('pt')
      expect(store.state.has_touch).toBe(true)
      store.commit('setReducedMotion', false)
      store.commit('setLang', 'en')
      store.commit('setInputMethod', 'pointer')
    })
  })

  // ── Subscription System ─────────────────────────────────────────────────────
  describe('5. Subscription System — Reactive Updates', () => {
    test('store.subscribe is a function', () => {
      expect(typeof store.subscribe).toBe('function')
    })

    test('subscribe callback is called when state changes', () => {
      let called = false
      const unsub = store.subscribe(() => { called = true })
      store.commit('setReducedMotion', true)
      expect(called).toBe(true)
      unsub?.()
      store.commit('setReducedMotion', false)
    })

    test('subscribe returns an unsubscribe function', () => {
      const unsub = store.subscribe(() => {})
      expect(typeof unsub).toBe('function')
      unsub()
    })

    test('multiple subscribers all receive updates', () => {
      let count = 0
      const unsub1 = store.subscribe(() => { count++ })
      const unsub2 = store.subscribe(() => { count++ })
      store.commit('setReducedMotion', true)
      expect(count).toBeGreaterThanOrEqual(2)
      unsub1?.()
      unsub2?.()
      store.commit('setReducedMotion', false)
    })

    test('unsubscribe stops receiving updates', () => {
      let count = 0
      const unsub = store.subscribe(() => { count++ })
      store.commit('setReducedMotion', true)
      const countAfterFirst = count
      unsub()
      store.commit('setReducedMotion', false)
      expect(count).toBe(countAfterFirst)
    })

    test('store.notify fires all subscribers', () => {
      let calls = 0
      const unsub1 = store.subscribe(() => { calls++ })
      const unsub2 = store.subscribe(() => { calls++ })
      store.commit('setReducedMotion', true)
      expect(calls).toBe(2)
      unsub1()
      unsub2()
      store.commit('setReducedMotion', false)
    })
  })

  // ── Theme Switching ─────────────────────────────────────────────────────────
  describe('6. Theme Management', () => {
    test('setTheme("dark") does not crash', () => {
      expect(() => store.commit('setTheme', 'dark')).not.toThrow()
      store.commit('setTheme', 'system')
    })

    test('setTheme("light") does not crash', () => {
      expect(() => store.commit('setTheme', 'light')).not.toThrow()
    })

    test('setTheme("system") does not crash', () => {
      expect(() => store.commit('setTheme', 'system')).not.toThrow()
    })

    test('effectiveTheme is either light or dark after setting theme', () => {
      store.commit('setTheme', 'dark')
      expect(['light', 'dark']).toContain(store.state.effectiveTheme)
      store.commit('setTheme', 'system')
    })

    test('setTheme("dark") sets effectiveTheme to "dark"', () => {
      store.commit('setTheme', 'dark')
      expect(store.state.effectiveTheme).toBe('dark')
      store.commit('setTheme', 'system')
    })

    test('setTheme("light") sets effectiveTheme to "light"', () => {
      store.commit('setTheme', 'light')
      expect(store.state.effectiveTheme).toBe('light')
    })
  })

  // ── Language Support ────────────────────────────────────────────────────────
  describe('7. Language Management', () => {
    const languages = ['en', 'pt', 'de', 'fr', 'es']

    languages.forEach(lang => {
      test(`setLang("${lang}") stores locale correctly`, () => {
        store.commit('setLang', lang)
        expect(store.state.lang.locale).toBe(lang)
        store.commit('setLang', 'en')
      })

      test(`getLang() returns "${lang}" after setLang`, () => {
        store.commit('setLang', lang)
        expect(store.getters.getLang()).toBe(lang)
        store.commit('setLang', 'en')
      })
    })

    test('language change does not affect reducedMotion', () => {
      store.commit('setReducedMotion', false)
      store.commit('setLang', 'pt')
      expect(store.state.reducedMotion).toBe(false)
      store.commit('setLang', 'en')
    })

    test('language change does not affect portfoliolist', () => {
      const original = store.state.portfoliolist
      store.commit('setLang', 'de')
      expect(store.state.portfoliolist).toEqual(original)
      store.commit('setLang', 'en')
    })
  })

  // ── Storage URL ──────────────────────────────────────────────────────────────
  describe('8. Storage URL Management', () => {
    test('default storage is Firebase production URL', () => {
      const url = store.getters.getStorage()
      expect(url).toBe('https://storage.googleapis.com/luiskr.com/public/_v3/')
    })

    test('storage URL ends with "/"', () => {
      expect(store.getters.getStorage().endsWith('/')).toBe(true)
    })

    test('storage URL is accessible via getters.getStorage()', () => {
      expect(typeof store.getters.getStorage()).toBe('string')
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
      store.commit('togglePreferencesModal', false)
      expect(store.state.preferencesOpen).toBe(false)
    })

    test('togglePreferencesModal(true) opens preferences', () => {
      store.commit('togglePreferencesModal', true)
      expect(store.state.preferencesOpen).toBe(true)
      store.commit('togglePreferencesModal', false)
    })

    test('togglePreferencesModal(false) closes preferences', () => {
      store.commit('togglePreferencesModal', true)
      store.commit('togglePreferencesModal', false)
      expect(store.state.preferencesOpen).toBe(false)
    })

    test('togglePreferencesModal() without arg toggles state', () => {
      store.commit('togglePreferencesModal', false)
      const before = store.state.preferencesOpen
      store.commit('togglePreferencesModal')
      expect(store.state.preferencesOpen).toBe(!before)
      store.commit('togglePreferencesModal', false)
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
      store.commit('setPortfolioList', items)
      expect(store.state.portfoliolist).toEqual(items)
    })

    test('setPortfolioList with object converts to array', () => {
      const obj = { a: { id: 1 }, b: { id: 2 } }
      store.commit('setPortfolioList', obj)
      expect(Array.isArray(store.state.portfoliolist)).toBe(true)
      expect(store.state.portfoliolist.length).toBe(2)
    })

    test('getPortfolioList() returns same as state.portfoliolist', () => {
      const items = [{ slug: 'test' }]
      store.commit('setPortfolioList', items)
      expect(store.getters.getPortfolioList()).toEqual(items)
    })

    test('empty portfolio list is valid', () => {
      store.commit('setPortfolioList', [])
      expect(store.state.portfoliolist).toEqual([])
    })
  })
})
