/**
 * @file app-shell-coverage-approot-view-outlet.test.js
 * @description Split from app-shell-coverage.test.js — covers the "AppRoot — view outlet" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { AppRoot } from '@/App.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { mount, waitFor } from '@tests/fixtures/test-constants.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'

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

// ─── view-outlet reconciliation ──────────────────────────────────────────────
describe('AppRoot — view outlet', () => {
  test('same-tag route delegates to onRouteParamChange', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)
    const current = outlet.firstElementChild

    current.onRouteParamChange = jest.fn()
    el.currentViewTag = current.tagName.toLowerCase()
    el._updateViewContent({ meta: {} })

    expect(current.onRouteParamChange).toHaveBeenCalled()

    globalThis.fetch = origFetch
  })

  test('different view tag cross-fades to the new element', async () => {
    const origFetch = stableFetch()

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)

    // Pre-resolve the lazy view chunk, then fake the clock: the cross-fade
    // swap is a wall-clock setTimeout that starves under saturated parallel
    // workers. finally-guarded so a failure can't leak fake timers.
    await import('@website/views/not-found/NotFound.js')

    jest.useFakeTimers()

    try {
      el.currentViewTag = VIEW_TAGS.VIEW_NOT_FOUND
      el._updateViewContent({})

      for (
        let i = 0;
        i < 10 && outlet.firstElementChild?.tagName.toLowerCase() !== VIEW_TAGS.VIEW_NOT_FOUND;
        i++
      ) {
        await jest.advanceTimersByTimeAsync(ANIMATION_DURATIONS.PAGE_FADE_HALF)
      }
    } finally {
      jest.useRealTimers()
    }

    expect(outlet.firstElementChild.tagName.toLowerCase()).toBe(VIEW_TAGS.VIEW_NOT_FOUND)

    globalThis.fetch = origFetch
  }, 120000)

  test('reduced motion takes the instant-swap path', async () => {
    const origFetch = stableFetch()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    el.currentViewTag = VIEW_TAGS.VIEW_LEGAL
    el._updateViewContent({})

    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)

    await waitFor(
      () =>
        outlet.firstElementChild &&
        outlet.firstElementChild.tagName.toLowerCase() === VIEW_TAGS.VIEW_LEGAL
    )

    expect(outlet.firstElementChild.tagName.toLowerCase()).toBe(VIEW_TAGS.VIEW_LEGAL)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    globalThis.fetch = origFetch
  })

  test('docs view tag lazy-imports and instant-swaps under reduced motion', async () => {
    const origFetch = stableFetch()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    const el = new AppRoot()
    cleanups.push(mount(el))

    await flush(60)

    el.currentViewTag = VIEW_TAGS.VIEW_DOCS
    el._updateViewContent({})

    const outlet = el.shadowRoot.querySelector(`#${APP_IDS.VIEW_OUTLET}`)

    await waitFor(
      () =>
        outlet.firstElementChild &&
        outlet.firstElementChild.tagName.toLowerCase() === VIEW_TAGS.VIEW_DOCS
    )

    expect(outlet.firstElementChild.tagName.toLowerCase()).toBe(VIEW_TAGS.VIEW_DOCS)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    globalThis.fetch = origFetch
  })
})
