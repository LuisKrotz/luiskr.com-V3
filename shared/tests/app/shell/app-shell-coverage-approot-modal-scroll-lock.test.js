/**
 * @file app-shell-coverage-approot-modal-scroll-lock.test.js
 * @description Split from app-shell-coverage.test.js — covers the "AppRoot — modal scroll lock" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { AppRoot } from '@/App.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { mount } from '@tests/fixtures/test-constants.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'

import { ROUTE_NAMES } from '@core/constants.js'

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

// ─── modal scroll-lock ───────────────────────────────────────────────────────
describe('AppRoot — modal scroll lock', () => {
  test('open locks <main> at -scrollY; close restores position', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      transform: 320,
      class: MODAL_CLASSES.MODAL_OPEN,
      open: true,
      media: {},
    })

    el._updateModalState()

    const mainEl = el.shadowRoot.querySelector(`#${APP_IDS.MAIN_CONTENT}`)

    expect(document.documentElement.classList.contains(MODAL_CLASSES.MODAL_OPEN)).toBe(true)
    expect(mainEl.style.position).toBe(STATE_STRINGS.FIXED)
    expect(mainEl.style.top).toBe('-320px')

    store.commit(MODAL_MUTATIONS.SET_MODAL, { transform: 0, class: '', open: false, media: {} })
    el._updateModalState()

    expect(mainEl.style.position).toBe(CHAR_STRINGS.EMPTY)
    expect(document.documentElement.classList.contains(MODAL_CLASSES.MODAL_OPEN)).toBe(false)

    globalThis.fetch = origFetch
  })
})
