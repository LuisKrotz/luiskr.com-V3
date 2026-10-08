/**
 * @file store-deep-coverage-store-missing-bom-else-arms.test.js
 * @description Split from store-deep-coverage.test.js — covers the "store — missing-BOM else arms" describe.
 */
import { describe, test, beforeEach, jest } from '@jest/globals'
import store from '@core/store.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

import { LOCALES } from '@core/constants.js'
import { THEME } from '@core/tokens/theme/theme.js'

beforeEach(() => {
  document.documentElement.className = ''
  document.body.className = ''
})

// ─── Missing-BOM guards ─────────────────────────────────────────────────────
// Every `typeof <global> !== 'undefined'` persistence/class guard has an else
// arm for non-browser contexts; these call each mutation with the global
// shadowed to undefined so the skip path is exercised.

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

      await import('@core/store.js')
    } finally {
      if (saved) Object.defineProperty(globalThis, 'localStorage', saved)
      jest.resetModules()
    }
  })
})
