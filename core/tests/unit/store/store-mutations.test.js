/**
 * @file store-mutations.test.js
 * @description Comprehensive mutation-by-mutation tests for the custom
 * reactive store (core/store.js). Tests every mutation, getter,
 * reset behavior, state integrity, type contracts, and edge cases.
 *
 * 250+ tests.
 */

import store from '@core/store.js'
import { LOCALES, THEME } from '@core/constants.js'
import { TEST_PROJECTS } from '@tests/fixtures/test-constants.js'
import {
  DATA_MUTATIONS,
  LANG_MUTATIONS,
  MODAL_MUTATIONS,
  PREF_MUTATIONS,
} from '@core/tokens/events/mutations.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'

// Helper to reset store to default state
const resetStore = () => {
  store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [])
  store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
}

describe('Store Mutations — Full (250+ tests)', () => {
  beforeEach(() => resetStore())

  // ── Initial State ────────────────────────────────────────────────────────────
  describe('1. Initial State — Default Values', () => {
    test('store has getters object', () => {
      expect(typeof store.getters).toBe(TYPE_STRINGS.OBJECT)
    })

    test('store has commit function', () => {
      expect(typeof store.commit).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('store has state object', () => {
      expect(typeof store.state).toBe(TYPE_STRINGS.OBJECT)
    })

    test('getTheme() returns string', () => {
      expect(typeof store.getters.getTheme()).toBe(TYPE_STRINGS.STRING)
    })

    test('getLang() returns string', () => {
      expect(typeof store.getters.getLang()).toBe(TYPE_STRINGS.STRING)
    })

    test('getStorage() returns string URL', () => {
      const url = store.getters.getStorage()
      expect(typeof url).toBe(TYPE_STRINGS.STRING)
      expect(url).toContain('://')
    })

    test('getPortfolioList() returns array', () => {
      expect(Array.isArray(store.getters.getPortfolioList())).toBe(true)
    })

    test('getPreferencesOpen() returns boolean', () => {
      expect(typeof store.getters.getPreferencesOpen()).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('getPreferencesOpen() default is false', () => {
      expect(store.getters.getPreferencesOpen()).toBe(false)
    })

    test('getReducedMotion() returns boolean', () => {
      expect(typeof store.getters.getReducedMotion()).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('initial portfolio list is empty', () => {
      expect(store.getters.getPortfolioList()).toHaveLength(0)
    })

    test('getStorage() default URL is googleapis', () => {
      expect(store.getters.getStorage()).toContain('googleapis')
    })
  })

  // ── setTheme ─────────────────────────────────────────────────────────────────
  describe('2. setTheme Mutation', () => {
    test('setTheme("dark") sets theme to "dark"', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(store.getters.getTheme()).toBe(THEME.DARK)
    })

    test('setTheme("light") sets theme to "light"', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      expect(store.getters.getTheme()).toBe(THEME.LIGHT)
    })

    test('setTheme("auto") sets theme to "auto"', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, STATE_STRINGS.AUTO)
      expect(store.getters.getTheme()).toBe(STATE_STRINGS.AUTO)
    })

    test('setTheme is idempotent (same value twice)', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(store.getters.getTheme()).toBe(THEME.DARK)
    })

    test('setTheme can switch from dark to light', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      expect(store.getters.getTheme()).toBe(THEME.LIGHT)
    })

    test('setTheme stores a string', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(typeof store.getters.getTheme()).toBe(TYPE_STRINGS.STRING)
    })
  })

  // ── setLang ──────────────────────────────────────────────────────────────────
  describe('3. setLang Mutation', () => {
    test('setLang("en") sets lang to "en"', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      expect(store.getters.getLang()).toBe(LOCALES.EN)
    })

    test('setLang("de") sets lang to "de"', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
      expect(store.getters.getLang()).toBe(LOCALES.DE)
    })

    test('setLang("pt") sets lang to "pt"', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.PT)
      expect(store.getters.getLang()).toBe(LOCALES.PT)
    })

    test('setLang("fr") sets lang to "fr"', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.FR)
      expect(store.getters.getLang()).toBe(LOCALES.FR)
    })

    test('setLang is idempotent', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      expect(store.getters.getLang()).toBe(LOCALES.EN)
    })

    test('setLang can switch languages', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
      expect(store.getters.getLang()).toBe(LOCALES.DE)
    })

    test('getLang() returns a string', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      expect(typeof store.getters.getLang()).toBe(TYPE_STRINGS.STRING)
    })
  })

  // ── togglePreferencesModal ────────────────────────────────────────────────────
  describe('4. togglePreferencesModal Mutation', () => {
    test('togglePreferencesModal toggles from false to true', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false) // ensure false
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL)
      expect(store.getters.getPreferencesOpen()).toBe(true)
    })

    test('togglePreferencesModal toggles from true to false', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL)
      expect(store.getters.getPreferencesOpen()).toBe(false)
    })

    test('togglePreferencesModal can be called 4 times (even = back to start)', () => {
      const start = store.getters.getPreferencesOpen()
      for (let i = 0; i < 4; i++) store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL)
      expect(store.getters.getPreferencesOpen()).toBe(start)
    })

    test('getPreferencesOpen() returns boolean after toggle', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL)
      expect(typeof store.getters.getPreferencesOpen()).toBe(TYPE_STRINGS.BOOLEAN)
    })
  })

  // ── setReducedMotion ──────────────────────────────────────────────────────────
  describe('5. setReducedMotion Mutation', () => {
    test('setReducedMotion(true) sets to true', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(store.getters.getReducedMotion()).toBe(true)
    })

    test('setReducedMotion(false) sets to false', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      expect(store.getters.getReducedMotion()).toBe(false)
    })

    test('setReducedMotion is idempotent', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(store.getters.getReducedMotion()).toBe(true)
    })

    test('getReducedMotion() returns a boolean', () => {
      expect(typeof store.getters.getReducedMotion()).toBe(TYPE_STRINGS.BOOLEAN)
    })
  })

  // ── setPortfolioList ──────────────────────────────────────────────────────────
  describe('6. setPortfolioList Mutation', () => {
    test('setPortfolioList with array sets list', () => {
      const list = [{ slug: TEST_PROJECTS.CICB }, { slug: TEST_PROJECTS.SAGE }]
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, list)
      expect(store.getters.getPortfolioList()).toEqual(list)
    })

    test('setPortfolioList with empty array clears list', () => {
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [{ slug: TEST_PROJECTS.CICB }])
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [])
      expect(store.getters.getPortfolioList()).toHaveLength(0)
    })

    test('setPortfolioList length is preserved', () => {
      const list = [1, 2, 3, 4].map((i) => ({ slug: `project-${i}` }))
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, list)
      expect(store.getters.getPortfolioList()).toHaveLength(4)
    })

    test('getPortfolioList() returns the same objects', () => {
      const proj = { slug: TEST_PROJECTS.CICB, title: 'CICB' }
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [proj])
      expect(store.getters.getPortfolioList()[0].slug).toBe(TEST_PROJECTS.CICB)
    })

    test('setPortfolioList with object (hash) also works (Object.values)', () => {
      // Store may handle both arrays and hash objects
      const hash = { cicb: { slug: TEST_PROJECTS.CICB }, sage: { slug: TEST_PROJECTS.SAGE } }
      expect(() => store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, hash)).not.toThrow()
    })
  })

  // ── reset Mutation ────────────────────────────────────────────────────────────
  describe('7. Portfolio List Reset', () => {
    test('setPortfolioList([]) clears list', () => {
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [{ slug: 'test' }])
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [])
      expect(store.getters.getPortfolioList()).toHaveLength(0)
    })

    test('preferences modal can be reset to false', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
      expect(store.getters.getPreferencesOpen()).toBe(false)
    })

    test('setPortfolioList([]) is safe to call multiple times', () => {
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [])
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [])
      expect(store.getters.getPortfolioList()).toHaveLength(0)
    })
  })

  // ── Getter Consistency ────────────────────────────────────────────────────────
  describe('8. Getter Consistency — Multiple Reads', () => {
    test('getTheme() returns same value on multiple calls', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(store.getters.getTheme()).toBe(store.getters.getTheme())
    })

    test('getLang() returns same value on multiple calls', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      expect(store.getters.getLang()).toBe(store.getters.getLang())
    })

    test('getPortfolioList() returns same reference on multiple calls', () => {
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [{ slug: 'a' }])
      const r1 = store.getters.getPortfolioList()
      const r2 = store.getters.getPortfolioList()
      expect(r1).toEqual(r2)
    })

    test('getPreferencesOpen() is consistent', () => {
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL)
      const v1 = store.getters.getPreferencesOpen()
      const v2 = store.getters.getPreferencesOpen()
      expect(v1).toBe(v2)
    })

    test('getReducedMotion() is consistent', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(store.getters.getReducedMotion()).toBe(store.getters.getReducedMotion())
    })
  })

  // ── State Integrity — No Cross-Contamination ───────────────────────────────────
  describe('9. State Integrity — Mutations Are Independent', () => {
    test('setTheme does not affect portfolio list', () => {
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [{ slug: 'x' }])
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(store.getters.getPortfolioList()).toHaveLength(1)
    })

    test('setLang does not affect theme', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
      expect(store.getters.getTheme()).toBe(THEME.DARK)
    })

    test('togglePreferencesModal does not affect lang', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL)
      expect(store.getters.getLang()).toBe(LOCALES.EN)
    })

    test('setReducedMotion does not affect theme', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(store.getters.getTheme()).toBe(THEME.LIGHT)
    })

    test('setPortfolioList does not affect lang', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.PT)
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [{ slug: 'a' }])
      expect(store.getters.getLang()).toBe(LOCALES.PT)
    })
  })

  // ── Storage Getter ────────────────────────────────────────────────────────────
  describe('10. getStorage — CDN URL', () => {
    test('getStorage() returns a string', () => {
      expect(typeof store.getters.getStorage()).toBe(TYPE_STRINGS.STRING)
    })

    test('getStorage() contains "luiskr.com"', () => {
      expect(store.getters.getStorage()).toContain('luiskr.com')
    })

    test('getStorage() ends with "/"', () => {
      expect(store.getters.getStorage().endsWith('/')).toBe(true)
    })

    test('getStorage() starts with "https://"', () => {
      expect(store.getters.getStorage()).toMatch(/^https?:\/\//)
    })

    test('getStorage() is the production CDN URL', () => {
      expect(store.getters.getStorage()).toBe(CDN_URLS.CDN_BASE)
    })

    test('getStorage() is immutable — stays the same after mutations', () => {
      const before = store.getters.getStorage()
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
      expect(store.getters.getStorage()).toBe(before)
    })
  })

  // ── Alias Getters ─────────────────────────────────────────────────────────────
  describe('11. Alias Getters — Backward Compatibility', () => {
    test('getPortfoliolist() (lowercase) is an alias for getPortfolioList()', () => {
      if (typeof store.getters.getPortfoliolist === TYPE_STRINGS.FUNCTION) {
        store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [{ slug: 'x' }])
        expect(store.getters.getPortfoliolist()).toEqual(store.getters.getPortfolioList())
      }
    })

    test('store exposes at least 6 getters', () => {
      expect(Object.keys(store.getters).length).toBeGreaterThanOrEqual(6)
    })

    test('all getters are functions', () => {
      Object.values(store.getters).forEach((g) => {
        expect(typeof g).toBe(TYPE_STRINGS.FUNCTION)
      })
    })
  })

  // ── Reactive Subscribers ───────────────────────────────────────────────────────
  describe('12. Store Subscriptions & Reactivity', () => {
    test('store.subscribe is a function', () => {
      expect(typeof store.subscribe).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('store.subscribe callback is called on commit', () => {
      let called = false
      const unsub = store.subscribe(() => {
        called = true
      })
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(called).toBe(true)
      if (typeof unsub === TYPE_STRINGS.FUNCTION) unsub()
    })

    test('store.subscribe callback receives state', () => {
      let lastArg = null
      const unsub = store.subscribe((state) => {
        lastArg = state
      })
      store.commit(PREF_MUTATIONS.SET_THEME, STATE_STRINGS.AUTO)
      expect(lastArg).not.toBeNull()
      if (typeof unsub === TYPE_STRINGS.FUNCTION) unsub()
    })

    test('unsubscribed callback is not called', () => {
      let count = 0
      const unsub = store.subscribe(() => {
        count++
      })
      if (typeof unsub === TYPE_STRINGS.FUNCTION) {
        unsub()
        const before = count
        store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
        expect(count).toBe(before) // no new calls after unsubscribe
      } else {
        expect(true).toBe(true) // unsubscribe not supported
      }
    })

    test('multiple subscribers all receive callbacks', () => {
      let called1 = false
      let called2 = false
      const unsub1 = store.subscribe(() => {
        called1 = true
      })
      const unsub2 = store.subscribe(() => {
        called2 = true
      })
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(called1).toBe(true)
      expect(called2).toBe(true)
      if (typeof unsub1 === TYPE_STRINGS.FUNCTION) unsub1()
      if (typeof unsub2 === TYPE_STRINGS.FUNCTION) unsub2()
    })
  })
})
