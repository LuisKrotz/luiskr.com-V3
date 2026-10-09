/**
 * @file coverage/starfield/component/starfield-component-tails.test.js
 * @description Coverage tails for <view-star-field> — the rare component
 * arms the lifecycle suite doesn't reach: canvas re-mount guard,
 * keybound teardown, Escape dismissal precedence, detached-host live
 * regions, unknown-id name lookup, null-engine optional calls and the
 * Escape/re-render guards.
 */
import { describe, test, expect, jest } from '@jest/globals'

import { LOCALES } from '@core/tokens/locales.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { KEYS } from '@core/tokens/primitives.js'

const dbData = { title: 'Star Field' }

jest.unstable_mockModule('@core/utils/data/db.js', () => ({
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => true, val: () => dbData })),
}))

await import('../../../../StarField.js')

const mount = () => {
  const el = document.createElement(VIEW_TAGS.VIEW_STAR_FIELD)

  document.body.appendChild(el)

  return el
}

const unmount = (el) => {
  el.onDestroy()
  el.remove()
}

const esc = (el) =>
  el.dispatchEvent(new window.KeyboardEvent('keydown', { key: KEYS.ESCAPE }))

describe('StarField coverage tails', () => {
  test('second onMounted hits the canvas-already-mounted guard', async () => {
    const el = mount()

    await new Promise((r) => setTimeout(r, 40))

    const canvas = el._canvasEl

    el.onMounted()

    expect(el._canvasEl).toBe(canvas)

    unmount(el)
  })

  test('onDestroy removes a bound Escape handler', async () => {
    const el = mount()

    expect(el._onKeyDown).toBeTruthy()

    el._bindKeys()

    const first = el._onKeyDown

    el._bindKeys()

    expect(el._onKeyDown).toBe(first)

    unmount(el)

    expect(el._onKeyDown).toBeNull()
  })

  test('Escape precedence — panel first, drawer second, neither last', () => {
    const el = mount()

    el._selectedId = 'mars'
    el._navOpen = true
    esc(el)

    expect(el._selectedId).toBeNull()
    expect(el._navOpen).toBe(true)

    esc(el)

    expect(el._navOpen).toBe(false)

    esc(el)

    unmount(el)
  })

  test('detached host — live-region lookups and engine optional calls no-op', () => {
    const el = document.createElement(VIEW_TAGS.VIEW_STAR_FIELD)

    el._handleHover('mars')

    expect(el._liveText).toBe('Mars')

    el._handleHover('unknown-id')

    expect(el._liveText).toBe('')

    el._announce('unknown-id')

    expect(el._liveText).toBe('')

    el._engine = null
    el._selectBody('mars')
    el._takeScreenshot()
    el._flyHome()
    el._toggleNav()
    el._closePanel()
    el._dismissLoader()
    el._updateLoader('x', 5)
    el._loadTranslations()
    el._applyTranslations(dbData)
    el.onUpdated()
    el.onDestroy()
  })

  test('onStoreUpdate refetches only on a real locale change', () => {
    const el = mount()

    el._loadTranslations = jest.fn()

    el._lastLocale = LOCALES.DE
    el.onStoreUpdate()

    expect(el._loadTranslations).toHaveBeenCalled()

    el._lastLocale = null
    el.onStoreUpdate()

    expect(el._loadTranslations).toHaveBeenCalledTimes(1)

    unmount(el)
  })

  test('render() returns the loader view pre-boot', () => {
    const el = document.createElement(VIEW_TAGS.VIEW_STAR_FIELD)

    expect(el.render()).toBeTruthy()
  })
})
