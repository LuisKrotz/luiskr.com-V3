/**
 * @file polyfill-coverage-registerserviceworker.test.js
 * @description Split from polyfill-coverage.test.js — covers the "registerServiceWorker" describe.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

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

const _saveKey = (key, holder = globalThis) => {
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

// ─── src/registerServiceWorker.js ────────────────────────────────────────────
describe('registerServiceWorker', () => {
  test('registers on load and wires every lifecycle callback', async () => {
    const { registerServiceWorker } = await import('@/registerServiceWorker.js')

    registerServiceWorker({ PROD: true, BASE_URL: '/' })
    window.dispatchEvent(new window.Event(WINDOW_EVENTS.LOAD))

    expect(registerMock).toHaveBeenCalledWith('/service-worker.js', expect.any(Object))

    const hooks = registerMock.mock.calls[0][1]

    for (const key of [
      'ready',
      'registered',
      'cached',
      'updatefound',
      'updated',
      'offline',
      WINDOW_EVENTS.ERROR,
    ]) {
      expect(() => hooks[key](new Error('x'))).not.toThrow()
    }
  })

  test('does nothing outside production', async () => {
    const { registerServiceWorker } = await import('@/registerServiceWorker.js')

    registerMock.mockClear()
    registerServiceWorker({ PROD: false })
    registerServiceWorker(undefined)

    // No load dispatch here — the previous test's listener stays attached to
    // the shared window and would re-fire register().
    expect(registerMock).not.toHaveBeenCalled()
  })
})
