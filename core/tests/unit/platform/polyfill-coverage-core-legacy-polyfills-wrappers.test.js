/**
 * @file polyfill-coverage-core-legacy-polyfills-wrappers.test.js
 * @description Split from polyfill-coverage.test.js — covers the "core/legacy-polyfills wrappers" describe.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'

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

// ─── core/legacy-polyfills/* ──────────────────────────────────────────────────
describe('core/legacy-polyfills wrappers', () => {
  jest.setTimeout(30000)

  test('ro.js installs ResizeObserver when absent', async () => {
    saveKey('ResizeObserver', window)
    delete window.ResizeObserver
    jest.resetModules()

    await import('@core/legacy-polyfills/ro.js')

    expect(window.ResizeObserver).toBe(ResizeObserverShim)
  })

  test('ro.js keeps a native ResizeObserver when present', async () => {
    saveKey('ResizeObserver', window)

    class NativeRO {}

    window.ResizeObserver = NativeRO
    jest.resetModules()

    await import('@core/legacy-polyfills/ro.js')

    expect(window.ResizeObserver).toBe(NativeRO)
  })

  test('cssvars.js invokes the ponyfill with watch enabled', async () => {
    jest.resetModules()

    await import('@core/legacy-polyfills/cssvars.js')

    expect(cssVarsMock).toHaveBeenCalledWith(
      expect.objectContaining({ watch: true, onlyLegacy: true })
    )
  })

  test('es-core.js evaluates without throwing', async () => {
    jest.resetModules()

    await expect(import('@core/legacy-polyfills/es-core.js')).resolves.toBeTruthy()
  })

  test('webcomponents.js evaluates without throwing', async () => {
    jest.resetModules()

    await expect(import('@core/legacy-polyfills/webcomponents.js')).resolves.toBeTruthy()
  })

  test('fetch.js evaluates without throwing', async () => {
    jest.resetModules()

    await expect(import('@core/legacy-polyfills/fetch.js')).resolves.toBeTruthy()
  })

  test('io.js evaluates without throwing', async () => {
    jest.resetModules()

    await expect(import('@core/legacy-polyfills/io.js')).resolves.toBeTruthy()
  })
})
