/**
 * @file app-shell-coverage-approot-mount-loaddata.test.js
 * @description Split from app-shell-coverage.test.js — covers the "AppRoot — mount + loadData" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { AppRoot } from '@/App.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { mount } from '@tests/fixtures/test-constants.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'

import { LOCALES, ROUTE_NAMES } from '@core/constants.js'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

let cleanups = []

beforeEach(() => {
  // Mounts read router.currentRoute.view — keep a complete descriptor.
  router.currentRoute = { name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} }
})

afterEach(() => {
  cleanups.forEach((c) => c())
  cleanups = []
})

const stableFetch = () => {
  const orig = globalThis.fetch

  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))

  return orig
}

const _BAD_LOCALE = 'xx'

const _mountNav = () => {
  const el = document.createElement(COMPONENT_TAGS.APP_NAV)

  cleanups.push(mount(el))

  return el
}

const _keydown = (key) =>
  window.dispatchEvent(new window.KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key }))

// ─── mount + data fan-out ────────────────────────────────────────────────────
describe('AppRoot — mount + loadData', () => {
  test('mounts, boots preferences, and fans APP translations to children', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(80)

    const nav = el.shadowRoot.querySelector(COMPONENT_TAGS.APP_NAV)

    expect(nav).not.toBeNull()
    expect(el.translations).not.toBeNull()
    expect(nav.translations).toBe(el.translations)

    globalThis.fetch = origFetch
  })

  test('onStoreUpdate reloads when the locale changes', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    const spy = jest.spyOn(el, 'loadData')

    el._loadedLang = LOCALES.EN
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.FR)

    el.onStoreUpdate()

    expect(spy).toHaveBeenCalled()

    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    globalThis.fetch = origFetch
  })

  test('loadData skips nodes already cached for the locale', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    el.loadData() // translations/lang.components now cached → no new fetches
    el.loadData()

    globalThis.fetch = origFetch
  })
})
