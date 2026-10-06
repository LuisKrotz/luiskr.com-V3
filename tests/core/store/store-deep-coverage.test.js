/**
 * @file store-deep-coverage.test.js
 * @description Commits every store mutation and reads every getter —
 * covers the persisted-preference writes, document class toggles,
 * the autoplay sweep, hover-follower math and the pub/sub contract
 * (commit → notify, unknown-mutation warn, subscriber error isolation).
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import store from '@/core/store.js'
import {
  DATA_MUTATIONS,
  LANG_MUTATIONS,
  MODAL_MUTATIONS,
  PREF_MUTATIONS,
  UI_MUTATIONS,
} from '@/core/tokens/events/mutations.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { PREF_STORAGE_KEYS } from '@/core/tokens/data/storage.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import { MODAL_CLASSES } from '@/core/tokens/classes/modal.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'

import { LOCALES } from '@/core/constants.js'
import { THEME } from '@/core/tokens/theme/theme.js'

beforeEach(() => {
  document.documentElement.className = ''
  document.body.className = ''
})

describe('store — mutations', () => {
  test('setPortfolioList accepts arrays and objects', () => {
    store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, [{ id: 'a' }])
    expect(store.getters.getPortfolioList()).toHaveLength(1)

    store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, { x: { id: 'b' } })
    expect(store.getters.getPortfolioList()[0].id).toBe('b')
  })

  test('theme lifecycle: initTheme → setTheme → applyTheme', () => {
    store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
    expect(store.getters.getTheme()).toBe(THEME.DARK)
    expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(true)

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.LIGHT)
    expect(document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)).toBe(false)

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
    store.commit(PREF_MUTATIONS.APPLY_THEME)
    store.commit(PREF_MUTATIONS.INIT_THEME)
    expect(localStorage.getItem(PREF_STORAGE_KEYS.THEME)).toBe(THEME.SYSTEM)
  })

  test('dialog + modal-origin toggles honour boolean payloads', () => {
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    expect(store.getters.getPreferencesOpen()).toBe(true)

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL)
    expect(store.getters.getPreferencesOpen()).toBe(false)

    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, true)
    expect(store.getters.getLangDialogOpen()).toBe(true)

    store.commit(MODAL_MUTATIONS.SET_MODAL_ORIGIN, { x: 10, y: 20 })
    expect(store.getters.getModalOrigin()).toEqual({ x: 10, y: 20 })

    store.commit(MODAL_MUTATIONS.SET_MODAL_ORIGIN, { x: 'bad' })
    expect(store.getters.getModalOrigin()).toBeNull()
  })

  test('reduced-motion set/toggle persists and toggles the class', () => {
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    expect(store.getters.getReducedMotion()).toBe(true)
    expect(document.documentElement.classList.contains(STATE_CLASSES.REDUCED_MOTION)).toBe(true)

    store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
    expect(store.getters.getReducedMotion()).toBe(false)
    expect(localStorage.getItem(PREF_STORAGE_KEYS.REDUCED_MOTION)).toBe(STATE_STRINGS.FALSE)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION)
    expect(store.getters.getReducedMotion()).toBe(true)

    store.commit(PREF_MUTATIONS.INIT_REDUCED_MOTION)
    expect(store.getters.getReducedMotion()).toBe(true)
  })

  test('stats-for-nerds + grid toggles persist', () => {
    const before = store.getters.getStatsForNerds()

    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
    expect(store.getters.getStatsForNerds()).toBe(!before)
    expect(localStorage.getItem(PREF_STORAGE_KEYS.STATS_FOR_NERDS)).toBe(String(!before))

    store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)
    expect(localStorage.getItem(PREF_STORAGE_KEYS.SHOW_GRID)).toBe(
      String(store.getters.getShowGrid())
    )
    expect(document.documentElement.classList.contains(STATE_CLASSES.SHOW_GRID)).toBe(
      store.getters.getShowGrid()
    )

    store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)
  })

  test('setVideoAutoplay(false) sweeps and pauses page videos', () => {
    const video = document.createElement(HTML_TAGS.VIDEO)
    let paused = false
    video.pause = () => {
      paused = true
    }
    document.body.appendChild(video)

    const mf = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
    const shadow = mf.attachShadow({ mode: STATE_STRINGS.OPEN })
    const innerVid = document.createElement(HTML_TAGS.VIDEO)
    let innerPaused = false
    innerVid.pause = () => {
      innerPaused = true
    }
    shadow.appendChild(innerVid)
    document.body.appendChild(mf)

    const me = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)
    const meShadow = me.attachShadow({ mode: STATE_STRINGS.OPEN })
    const meVid = document.createElement(HTML_TAGS.VIDEO)
    let mePaused = false
    meVid.pause = () => {
      mePaused = true
    }
    meShadow.appendChild(meVid)
    document.body.appendChild(me)

    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)

    expect(store.getters.getVideoAutoplay()).toBe(false)
    expect(paused).toBe(true)
    expect(innerPaused).toBe(true)
    expect(mePaused).toBe(true)
    expect(localStorage.getItem(PREF_STORAGE_KEYS.VIDEO_AUTOPLAY)).toBe(STATE_STRINGS.FALSE)

    store.commit(PREF_MUTATIONS.TOGGLE_VIDEO_AUTOPLAY)
    expect(store.getters.getVideoAutoplay()).toBe(true)

    video.remove()
    mf.remove()
    me.remove()
  })

  test('setInputMethod switches click/tap vocabulary', () => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, COMMON_ATTRS.TOUCH)
    expect(store.getters.getInputMethod()).toBe(COMMON_ATTRS.TOUCH)
    expect(store.getters.getTouch()).toBe(true)
    expect(store.getters.getClickOrTap()).toBe(store.state.actionTextMap.tap)

    // Same-method write is a no-op (returns false → no notify).
    const res = store.mutations.setInputMethod(COMMON_ATTRS.TOUCH)
    expect(res).toBe(false)

    store.commit(UI_MUTATIONS.SET_CLICK_OR_TAP, { click: 'Clk', tap: 'Tp' })
    expect(store.state.actionTextMap.click).toBe('Clk')
    expect(store.getters.getClickOrTap()).toBe('Tp')

    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, COMMON_ATTRS.POINTER)
    expect(store.getters.getClickOrTap()).toBe('Clk')
  })

  test('hover/setClear drive the mouseenter body class', () => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, COMMON_ATTRS.POINTER)
    store.commit(UI_MUTATIONS.SET_HOVER, { pageX: 100, pageY: 200 })

    expect(store.getters.getHover()).toBe(true)
    expect(store.getters.getOnMouseMove()).toEqual({ left: 40, top: 140 })

    store.commit(UI_MUTATIONS.SET_ON_MOUSE_MOVE, {})
    expect(store.getters.getOnMouseMove()).toEqual({ left: -60, top: -60 })

    store.commit(UI_MUTATIONS.SET_CLEAR)
    expect(store.getters.getHover()).toBe(false)
  })

  test('setHover is ignored on touch devices', () => {
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, COMMON_ATTRS.TOUCH)
    store.commit(UI_MUTATIONS.SET_HOVER, { pageX: 1, pageY: 1 })

    expect(store.getters.getHover()).toBe(false)
    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, COMMON_ATTRS.POINTER)
  })

  test('setMentions/setLang/setStorage/setModal run their guards', () => {
    store.commit(DATA_MUTATIONS.SET_MENTIONS, { title: 'T', items: [1] })
    expect(store.getters.getMentions().items).toEqual([1])

    store.commit(DATA_MUTATIONS.SET_MENTIONS, { items: [2] })
    expect(store.getters.getMentions().title).toBe('T')

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, { c: 1 })
    store.commit(LANG_MUTATIONS.SET_APP_LANG, { a: 1 })
    store.commit(LANG_MUTATIONS.SET_APP_LANG, 'not-an-object')
    store.commit(LANG_MUTATIONS.SET_SLUGS_LANG, { s: 1 })
    store.commit(LANG_MUTATIONS.SET_SLUGS_LANG, null)
    store.commit(LANG_MUTATIONS.SET_CAROUSEL_LANG, { extra: true })
    store.commit(LANG_MUTATIONS.SET_STATS_HUD_LANG, { extra: true })

    expect(store.getters.getCarouselLang().extra).toBe(true)
    expect(store.getters.getStatsHudLang().extra).toBe(true)

    store.commit(LANG_MUTATIONS.SET_LANG, null)
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
    expect(store.getters.getLang()).toBe(LOCALES.DE)
    expect(localStorage.getItem(PREF_STORAGE_KEYS.LOCALE)).toBe(LOCALES.DE)

    // Same locale with components loaded → early return.
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, { c: 1 })
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)

    store.commit(DATA_MUTATIONS.SET_STORAGE, null)
    store.commit(DATA_MUTATIONS.SET_STORAGE, 42)
    store.commit(DATA_MUTATIONS.SET_STORAGE, 'https://cdn.example/')
    expect(store.getters.getStorage()).toBe('https://cdn.example/')

    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      transform: 1,
      class: MODAL_CLASSES.MODAL_OPEN,
      open: true,
      media: { source: 's', thumb: 't', alt: 'a', width: 1, height: 1, isVideo: false },
    })
    expect(store.getters.getModal().open).toBe(true)
    expect(document.documentElement.classList.contains(MODAL_CLASSES.MODAL_OPEN)).toBe(true)

    store.commit(MODAL_MUTATIONS.SET_MODAL, { transform: 0, class: '', open: false, media: {} })
    expect(document.documentElement.classList.contains(MODAL_CLASSES.MODAL_OPEN)).toBe(false)

    store.commit(UI_MUTATIONS.SET_MARQUEE_AMOUNT)
    expect(store.getters.getMarqueeAmount()).toBe(0)
  })

  test('lang getters mirror the lang subtree', () => {
    expect(store.getters.getlang()).toBe(store.state.lang)
    expect(store.getters.getEffectiveTheme()).toBe(store.state.effectiveTheme)
    expect(store.getters.getPortfoliolist()).toBe(store.getters.getPortfolioList())
  })
})

describe('store — pub/sub', () => {
  test('commit notifies subscribers; unknown mutation warns and no-ops', () => {
    const calls = []
    const unsub = store.subscribe((s) => calls.push(s))

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    expect(calls.length).toBeGreaterThan(0)

    store.commit('notARealMutation')
    store.commit(UI_MUTATIONS.SET_MARQUEE_AMOUNT) // returns undefined → notifies

    unsub()
    const count = calls.length

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    expect(calls.length).toBe(count)
  })

  test('a throwing subscriber cannot break the others', () => {
    const bad = () => {
      throw new Error('boom')
    }
    const good = []
    const u1 = store.subscribe(bad)
    const u2 = store.subscribe(() => good.push(1))

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)

    expect(good.length).toBe(1)

    u1()
    u2()
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
  })
})

// ─── Missing-BOM guards ─────────────────────────────────────────────────────
// Every `typeof <global> !== 'undefined'` persistence/class guard has an else
// arm for non-browser contexts; these call each mutation with the global
// shadowed to undefined so the skip path is exercised.

describe('store — missing-BOM else arms', () => {
  const withoutGlobal = (name, fn) => {
    const saved = globalThis[name]

    try {
      Object.defineProperty(globalThis, name, {
        value: undefined,
        configurable: true,
        writable: true,
      })

      fn()
    } finally {
      Object.defineProperty(globalThis, name, { value: saved, configurable: true, writable: true })
    }
  }

  test('localStorage-less persistence guards all skip the write', () => {
    withoutGlobal('localStorage', () => {
      store.mutations.setReducedMotion(true)
      store.mutations.setReducedMotion(false)
      store.mutations.toggleStatsForNerds()
      store.mutations.toggleStatsForNerds()
      store.mutations.toggleShowGrid()
      store.mutations.toggleShowGrid()
      store.mutations.setVideoAutoplay(false)
      store.mutations.setVideoAutoplay(true)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
      store.mutations.setTheme(THEME.DARK)
      store.mutations.setTheme(THEME.SYSTEM)
    })
  })

  test('document-less guards skip the class sweeps', () => {
    withoutGlobal('document', () => {
      store.mutations.initReducedMotion()
      store.mutations.toggleShowGrid()
      store.mutations.toggleShowGrid()
      store.mutations.setVideoAutoplay(false)
      store.mutations.setVideoAutoplay(true)
      store.mutations.setClear()

      store.state.has_touch = false
      store.mutations.setHover({ pageX: 1, pageY: 2 })
      store.mutations.setModal({ transform: 0, class: CHAR_STRINGS.EMPTY, open: false, media: {} })
    })
  })

  test('media-figure/expanded without shadow video take the vid else arm', () => {
    const mf = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
    const me = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)

    document.body.appendChild(mf)
    document.body.appendChild(me)

    store.mutations.setVideoAutoplay(false)
    store.mutations.setVideoAutoplay(true)

    mf.remove()
    me.remove()
  })

  test('module init without localStorage takes the autoplay seed else arm', async () => {
    const saved = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')

    try {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        configurable: true,
        writable: true,
      })
      jest.resetModules()

      await import('@/core/store.js')
    } finally {
      if (saved) Object.defineProperty(globalThis, 'localStorage', saved)
      jest.resetModules()
    }
  })
})
