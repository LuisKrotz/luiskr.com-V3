/**
 * @file app-shell-coverage-approot-scroll-tracking.test.js
 * @description Split from app-shell-coverage.test.js — covers the "AppRoot — scroll tracking" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { AppRoot } from '@/App.js'
import router from '@core/router/router.js'
import { mount } from '@tests/fixtures/test-constants.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'

import { ROUTE_NAMES, SECTIONS } from '@core/constants.js'

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

// ─── scroll tracking ─────────────────────────────────────────────────────────
describe('AppRoot — scroll tracking', () => {
  test('checkScroll resolves sections on home and feeds nav elsewhere', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    // Non-home route → nav state push + early return.
    router.currentRoute = { name: 'Project', view: VIEW_TAGS.VIEW_PROJECT, meta: {} }
    el.checkScroll()

    expect(el.onBottom).toBeDefined()

    // Home route + measured markers → section resolution. scrollHeight
    // must exceed innerHeight + 200 or onBottom pins the section to contact.
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 5000,
      configurable: true,
    })

    router.currentRoute = { name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} }
    el._aboutTop = -100
    el._contactTop = -50
    el._sectionsMeasured = true
    el.checkScroll()

    expect(el.activeSection).toBe(SECTIONS.CONTACT)

    el._aboutTop = -100
    el._contactTop = 20000
    el.checkScroll()

    expect(el.activeSection).toBe(SECTIONS.ABOUT)

    el._aboutTop = 10000
    el._contactTop = 20000
    el.checkScroll()

    expect(el.activeSection).toBe(SECTIONS.HOME)

    // Unmeasured markers → lazy re-measure path.
    el._sectionsMeasured = false
    el._lastMeasureAttempt = 0
    el.checkScroll()

    expect(el._lastMeasureAttempt).toBeGreaterThan(0)

    globalThis.fetch = origFetch
  })
})
