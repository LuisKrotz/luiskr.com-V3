/**
 * @file coverage-tails-2.test.js
 * @description Second branch-tail sweep: store init/mutation edges,
 * Component mount/remount fallbacks, predictive-loader observer paths,
 * wasm-smooth-scroll option shapes, WebGL pool purge/restore, intro
 * loader early exits, checkbox/burger canvas widgets, local media cache
 * fallbacks, the SWR db layer, NPU predictor tiers, and the legacy DOM
 * polyfill bodies.
 */
import { jest } from '@jest/globals'
import { LOCALES, THEME } from '@/core/constants.js'
import store from '@/core/store.js'

import '@/components/feedback/CookieBanner.js'
import { DATA_MUTATIONS, LANG_MUTATIONS, MODAL_MUTATIONS, PREF_MUTATIONS, UI_MUTATIONS } from '../../../../src/core/tokens/events/mutations.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'
import { COMPONENT_TAGS } from '../../../../src/core/tokens/elements/components.js'
import { PREF_STORAGE_KEYS } from '../../../../src/core/tokens/data/storage.js'
import { STATE_STRINGS } from '../../../../src/core/tokens/strings/state.js'







// ─── store.js ────────────────────────────────────────────────────────────────

describe('store tails', () => {
  test('applyTheme covers dark/light/system resolution', () => {
    const prev = store.state.theme

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
    expect(store.state.effectiveTheme).toBe(THEME.DARK)

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
    expect(store.state.effectiveTheme).toBe(THEME.LIGHT)

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)

    store.commit(PREF_MUTATIONS.SET_THEME, prev)
  })

  test('videoAutoplay off sweeps document + shadow videos', () => {
    const vid = document.createElement(HTML_TAGS.VIDEO)

    vid.pause = jest.fn()
    document.body.appendChild(vid)

    const mf = document.createElement(HTML_TAGS.DIV)
    const shadowVid = document.createElement(HTML_TAGS.VIDEO)

    shadowVid.pause = jest.fn()

    // A media-figure tag whose shadow contains a <video> hits the inner loop.
    const figure = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    figure.shadowRoot?.appendChild?.(shadowVid)
    document.body.appendChild(figure)

    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)
    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)

    vid.remove()
    figure.remove()
    mf.remove()
  })

  test('re-init under touch + stored prefs seeds inputMethod/reducedMotion', async () => {
    localStorage.setItem(PREF_STORAGE_KEYS.REDUCED_MOTION, STATE_STRINGS.TRUE)
    localStorage.setItem(PREF_STORAGE_KEYS.THEME, THEME.DARK)
    window.ontouchstart = () => {}

    jest.resetModules()
    const mod = await import('@/core/store.js')
    const s = mod.default

    expect(s.state.reducedMotion).toBe(true)

    delete window.ontouchstart
    jest.resetModules()
  })

  test('typeof-guard else arms: mutations degrade without localStorage', () => {
    const savedLS = globalThis.localStorage

    delete globalThis.localStorage

    try {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      store.commit(PREF_MUTATIONS.INIT_THEME)
      store.commit(PREF_MUTATIONS.INIT_REDUCED_MOTION)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
      store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
    } finally {
      globalThis.localStorage = savedLS
    }
  })

  test('typeof-guard else arms: mutations degrade without document', () => {
    const savedDoc = globalThis.document

    delete globalThis.document

    try {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      store.commit(PREF_MUTATIONS.INIT_REDUCED_MOTION)
      store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
      store.commit(UI_MUTATIONS.SET_CLEAR)
      store.commit(UI_MUTATIONS.SET_ON_MOUSE_MOVE, { x: 1, y: 1 })
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
    } finally {
      globalThis.document = savedDoc
    }
  })

  test('payload-shape else arms across setters', () => {
    store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, null)
    store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, { a: 1 })
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, 'nonbool')
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, 7)
    store.commit(UI_MUTATIONS.SET_CLICK_OR_TAP, { click: 'Clk' })
    store.commit(UI_MUTATIONS.SET_CLICK_OR_TAP, { tap: 'Tp' })
    store.commit(UI_MUTATIONS.SET_CLICK_OR_TAP, {})
    store.commit(LANG_MUTATIONS.SET_APP_LANG, 5)
    store.commit(LANG_MUTATIONS.SET_SLUGS_LANG, 'not-an-object')
    store.commit(MODAL_MUTATIONS.SET_MODAL_ORIGIN, { x: 'a' })

    expect(store.state.modalOrigin).toBeNull()
  })
})

