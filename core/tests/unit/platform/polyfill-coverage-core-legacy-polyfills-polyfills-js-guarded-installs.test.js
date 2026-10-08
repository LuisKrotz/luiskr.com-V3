/**
 * @file polyfill-coverage-core-legacy-polyfills-polyfills-js-guarded-installs.test.js
 * @description Split from polyfill-coverage.test.js — covers the "core/legacy-polyfills/polyfills.js guarded installs" describe.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

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

// ─── core/legacy-polyfills/polyfills.js ────────────────────────────────────────────────────────
describe('core/legacy-polyfills/polyfills.js guarded installs', () => {
  test('installs structuredClone when missing', async () => {
    saveKey('structuredClone')
    delete globalThis.structuredClone
    jest.resetModules()

    await import('@core/legacy-polyfills/polyfills.js')

    expect(typeof globalThis.structuredClone).toBe(TYPE_STRINGS.FUNCTION)
    expect(globalThis.structuredClone({ a: [1, 2] })).toEqual({ a: [1, 2] })
  })

  test('structuredClone polyfill returns the value when JSON round-trip fails', async () => {
    saveKey('structuredClone')
    delete globalThis.structuredClone
    jest.resetModules()

    await import('@core/legacy-polyfills/polyfills.js')

    const cyclic = {}

    cyclic.self = cyclic

    expect(globalThis.structuredClone(cyclic)).toBe(cyclic)
  })

  test('installs Array.prototype.at when missing', async () => {
    saveKey('at', Array.prototype)
    delete Array.prototype.at
    jest.resetModules()

    await import('@core/legacy-polyfills/polyfills.js')

    expect([1, 2, 3].at(-1)).toBe(3)
    expect([1, 2, 3].at(5)).toBeUndefined()
    expect([1, 2, 3].at(-9)).toBeUndefined()
  })

  test('installs String.prototype.at when missing', async () => {
    saveKey('at', String.prototype)
    delete String.prototype.at
    jest.resetModules()

    await import('@core/legacy-polyfills/polyfills.js')

    expect('abc'.at(-1)).toBe('c')
    expect('abc'.at(5)).toBeUndefined()
  })

  test('installs Object.hasOwn when missing', async () => {
    saveKey('hasOwn', Object)
    delete Object.hasOwn
    jest.resetModules()

    await import('@core/legacy-polyfills/polyfills.js')

    expect(Object.hasOwn({ x: 1 }, 'x')).toBe(true)
    expect(Object.hasOwn({ x: 1 }, 'y')).toBe(false)
  })

  test('installs queueMicrotask when missing', async () => {
    saveKey('queueMicrotask')
    delete globalThis.queueMicrotask
    jest.resetModules()

    await import('@core/legacy-polyfills/polyfills.js')

    const ran = jest.fn()

    globalThis.queueMicrotask(ran)
    await Promise.resolve()

    expect(ran).toHaveBeenCalled()
  })

  test('installs the inert property shim and restores tabindex values', async () => {
    saveKey('inert', HTMLElement.prototype)
    delete HTMLElement.prototype.inert
    jest.resetModules()

    await import('@core/legacy-polyfills/polyfills.js')

    const host = document.createElement(HTML_TAGS.DIV)
    const btn = document.createElement(HTML_TAGS.BUTTON)
    const keyed = document.createElement(HTML_TAGS.BUTTON)

    keyed.setAttribute(ARIA_ATTRS.TABINDEX, '2')
    host.appendChild(btn)
    host.appendChild(keyed)
    document.body.appendChild(host)

    host.inert = true
    host.inert = true

    expect(host.hasAttribute('inert')).toBe(true)
    expect(host.getAttribute(ARIA_ATTRS.ARIA_HIDDEN)).toBe(STATE_STRINGS.TRUE)
    expect(host.inert).toBe(true)
    expect(btn.getAttribute(ARIA_ATTRS.TABINDEX)).toBe(CHAR_STRINGS.MINUS_ONE)
    expect(keyed.getAttribute(ARIA_ATTRS.TABINDEX)).toBe(CHAR_STRINGS.MINUS_ONE)

    host.inert = false

    expect(host.hasAttribute('inert')).toBe(false)
    expect(btn.hasAttribute(ARIA_ATTRS.TABINDEX)).toBe(false)
    // Pre-existing tabindex is restored, not stripped.
    expect(keyed.getAttribute(ARIA_ATTRS.TABINDEX)).toBe('2')

    host.remove()
  })

  test('queueMicrotask shim forwards errors to a throwing timeout', async () => {
    saveKey('queueMicrotask')
    delete globalThis.queueMicrotask
    jest.resetModules()

    await import('@core/legacy-polyfills/polyfills.js')

    const timeoutSpy = jest.spyOn(globalThis, 'setTimeout').mockImplementation(() => 0)

    globalThis.queueMicrotask(() => {
      throw new Error('boom')
    })
    // then→catch is two microtasks deep — flush a macrotask to reach it.
    await new Promise((r) => Promise.resolve().then(r).then(r))

    expect(timeoutSpy).toHaveBeenCalled()
    // The captured callback re-throws the microtask error asynchronously.
    expect(() => timeoutSpy.mock.calls[0][0]()).toThrow('boom')

    timeoutSpy.mockRestore()
  })
})
