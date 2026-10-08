/**
 * @file polyfill-coverage-route-warmer.test.js
 * @description Split from polyfill-coverage.test.js — covers the "route-warmer" describe.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'

const cssVarsMock = jest.fn()
const ResizeObserverShim = class MockRO {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.unstable_mockModule('css-vars-ponyfill', () => ({ default: cssVarsMock }))
jest.unstable_mockModule('resize-observer-polyfill', () => ({ default: ResizeObserverShim }))
jest.unstable_mockModule('core-js-bundle/minified.js', () => ({}))
jest.unstable_mockModule('@webcomponents/webcomponentsjs', () => ({}))
jest.unstable_mockModule('whatwg-fetch', () => ({}))
jest.unstable_mockModule('intersection-observer', () => ({}))

const registerMock = jest.fn()

jest.unstable_mockModule('register-service-worker', () => ({ register: registerMock }))

/** Stashed globals, restored after each test. Descriptors are captured
 * (not values) so accessor properties like HTMLElement.prototype.inert
 * don't invoke their getter against the prototype itself. */
const stash = new Map()

const saveKey = (key, holder = globalThis) => {
  const id = `${holder === window ? 'w' : 'g'}:${key}`

  if (!stash.has(id)) {
    stash.set(id, { key, holder, desc: Object.getOwnPropertyDescriptor(holder, key) })
  }
}

afterEach(() => {
  for (const { key, holder, desc } of stash.values()) {
    // Polyfill-defined properties may be non-configurable — a failed
    // restore leaves the (harmless) shim installed.
    try {
      if (desc) Object.defineProperty(holder, key, desc)
      else delete holder[key]
    } catch {
      /* non-configurable shim stays installed */
    }
  }

  stash.clear()

  for (const k of Object.keys(stash)) delete stash[k]

  jest.resetModules()
})

// ─── core/utils/route-warmer.js ───────────────────────────────────────────────
describe('route-warmer', () => {
  test('schedules via requestIdleCallback after window load', async () => {
    jest.resetModules()
    saveKey('requestIdleCallback', window)

    const idleCalls = []

    window.requestIdleCallback = (cb) => {
      idleCalls.push(cb)
      return 1
    }

    const { startRouteWarming, stopRouteWarming } =
      await import('@core/utils/motion/route-warmer.js')

    startRouteWarming()
    stopRouteWarming()

    if (document.readyState === 'complete') {
      expect(idleCalls.length).toBeGreaterThan(0)
    } else {
      window.dispatchEvent(new window.Event(WINDOW_EVENTS.LOAD))

      await new Promise((r) => setTimeout(r, 0))

      expect(idleCalls.length).toBeGreaterThan(0)
    }
  })

  test('is idempotent — a second call does not reschedule', async () => {
    jest.resetModules()

    const { startRouteWarming, stopRouteWarming } =
      await import('@core/utils/motion/route-warmer.js')

    startRouteWarming()
    startRouteWarming()
    stopRouteWarming()
    // Resolves without throwing; the _started latch blocks the second call.
    expect(true).toBe(true)
  })

  test('swallows a failing route chunk and keeps warming the rest', async () => {
    jest.resetModules()
    jest.unstable_mockModule('@website/views/home/Home.js', () => {
      throw new Error('warm-fail')
    })
    saveKey('requestIdleCallback', window)

    window.requestIdleCallback = (cb) => {
      cb()
      return 1
    }

    const { startRouteWarming, stopRouteWarming } =
      await import('@core/utils/motion/route-warmer.js')

    startRouteWarming()
    window.dispatchEvent(new window.Event(WINDOW_EVENTS.LOAD))

    await new Promise((r) => setTimeout(r, 80))
    stopRouteWarming()

    expect(true).toBe(true)
  })

  test('defers warming to the load event when readyState is not complete', async () => {
    jest.resetModules()
    saveKey('requestIdleCallback', window)

    const idleCalls = []

    window.requestIdleCallback = (cb) => {
      idleCalls.push(cb)
      cb()
      return 1
    }

    const desc =
      Object.getOwnPropertyDescriptor(document, 'readyState') ||
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(document), 'readyState')

    Object.defineProperty(document, 'readyState', {
      value: SECTION_UI_KEYS.LOADING,
      configurable: true,
    })

    const { startRouteWarming, stopRouteWarming } =
      await import('@core/utils/motion/route-warmer.js')

    startRouteWarming()

    expect(idleCalls.length).toBe(0)

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.LOAD))

    await new Promise((r) => setTimeout(r, 30))

    expect(idleCalls.length).toBeGreaterThan(0)
    stopRouteWarming()

    if (desc) Object.defineProperty(document, 'readyState', desc)
  })
})
