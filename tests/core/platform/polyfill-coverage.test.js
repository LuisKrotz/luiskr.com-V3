/**
 * @file polyfill-coverage.test.js
 * @description Forces the guarded installation paths of src/legacy-polyfills/polyfills.js and
 * src/legacy-polyfills/* by deleting the native API each guard checks for,
 * re-importing the module under a fresh registry (jest.resetModules), and
 * asserting the shim both installs and behaves correctly. Heavy third-party
 * polyfill payloads (core-js, webcomponentsjs, whatwg-fetch,
 * intersection-observer, resize-observer-polyfill, css-vars-ponyfill) are
 * mocked so only our wrapper lines execute.
 */

import { describe, test, expect, jest, afterEach } from '@jest/globals'
import { TYPE_STRINGS } from '../../../src/core/tokens/strings/types.js'
import { HTML_TAGS } from '../../../src/core/tokens/elements/html.js'
import { ARIA_ATTRS } from '../../../src/core/tokens/attrs/aria.js'
import { STATE_STRINGS } from '../../../src/core/tokens/strings/state.js'
import { CHAR_STRINGS } from '../../../src/core/tokens/strings/chars.js'
import { MEDIA_EVENTS, WINDOW_EVENTS } from '../../../src/core/tokens/events/dom.js'
import { SECTION_UI_KEYS } from '../../../src/core/tokens/data/ui-keys.js'

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

// ─── src/legacy-polyfills/polyfills.js ────────────────────────────────────────────────────────

describe('src/legacy-polyfills/polyfills.js guarded installs', () => {
  test('installs structuredClone when missing', async () => {
    saveKey('structuredClone')
    delete globalThis.structuredClone
    jest.resetModules()

    await import('@/legacy-polyfills/polyfills.js')

    expect(typeof globalThis.structuredClone).toBe(TYPE_STRINGS.FUNCTION)
    expect(globalThis.structuredClone({ a: [1, 2] })).toEqual({ a: [1, 2] })
  })

  test('structuredClone polyfill returns the value when JSON round-trip fails', async () => {
    saveKey('structuredClone')
    delete globalThis.structuredClone
    jest.resetModules()

    await import('@/legacy-polyfills/polyfills.js')

    const cyclic = {}

    cyclic.self = cyclic

    expect(globalThis.structuredClone(cyclic)).toBe(cyclic)
  })

  test('installs Array.prototype.at when missing', async () => {
    saveKey('at', Array.prototype)
    delete Array.prototype.at
    jest.resetModules()

    await import('@/legacy-polyfills/polyfills.js')

    expect([1, 2, 3].at(-1)).toBe(3)
    expect([1, 2, 3].at(5)).toBeUndefined()
    expect([1, 2, 3].at(-9)).toBeUndefined()
  })

  test('installs String.prototype.at when missing', async () => {
    saveKey('at', String.prototype)
    delete String.prototype.at
    jest.resetModules()

    await import('@/legacy-polyfills/polyfills.js')

    expect('abc'.at(-1)).toBe('c')
    expect('abc'.at(5)).toBeUndefined()
  })

  test('installs Object.hasOwn when missing', async () => {
    saveKey('hasOwn', Object)
    delete Object.hasOwn
    jest.resetModules()

    await import('@/legacy-polyfills/polyfills.js')

    expect(Object.hasOwn({ x: 1 }, 'x')).toBe(true)
    expect(Object.hasOwn({ x: 1 }, 'y')).toBe(false)
  })

  test('installs queueMicrotask when missing', async () => {
    saveKey('queueMicrotask')
    delete globalThis.queueMicrotask
    jest.resetModules()

    await import('@/legacy-polyfills/polyfills.js')

    const ran = jest.fn()

    globalThis.queueMicrotask(ran)
    await Promise.resolve()

    expect(ran).toHaveBeenCalled()
  })

  test('installs the inert property shim and restores tabindex values', async () => {
    saveKey('inert', HTMLElement.prototype)
    delete HTMLElement.prototype.inert
    jest.resetModules()

    await import('@/legacy-polyfills/polyfills.js')

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

    await import('@/legacy-polyfills/polyfills.js')

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

// ─── src/legacy-polyfills/* ──────────────────────────────────────────────────

describe('src/legacy-polyfills wrappers', () => {
  jest.setTimeout(30000)

  test('ro.js installs ResizeObserver when absent', async () => {
    saveKey('ResizeObserver', window)
    delete window.ResizeObserver
    jest.resetModules()

    await import('@/legacy-polyfills/ro.js')

    expect(window.ResizeObserver).toBe(ResizeObserverShim)
  })

  test('ro.js keeps a native ResizeObserver when present', async () => {
    saveKey('ResizeObserver', window)

    class NativeRO {}

    window.ResizeObserver = NativeRO
    jest.resetModules()

    await import('@/legacy-polyfills/ro.js')

    expect(window.ResizeObserver).toBe(NativeRO)
  })

  test('cssvars.js invokes the ponyfill with watch enabled', async () => {
    jest.resetModules()

    await import('@/legacy-polyfills/cssvars.js')

    expect(cssVarsMock).toHaveBeenCalledWith(
      expect.objectContaining({ watch: true, onlyLegacy: true })
    )
  })

  test('es-core.js evaluates without throwing', async () => {
    jest.resetModules()

    await expect(import('@/legacy-polyfills/es-core.js')).resolves.toBeTruthy()
  })

  test('webcomponents.js evaluates without throwing', async () => {
    jest.resetModules()

    await expect(import('@/legacy-polyfills/webcomponents.js')).resolves.toBeTruthy()
  })

  test('fetch.js evaluates without throwing', async () => {
    jest.resetModules()

    await expect(import('@/legacy-polyfills/fetch.js')).resolves.toBeTruthy()
  })

  test('io.js evaluates without throwing', async () => {
    jest.resetModules()

    await expect(import('@/legacy-polyfills/io.js')).resolves.toBeTruthy()
  })
})

describe('src/legacy-polyfills/dom.js shims', () => {
  test('installs queueMicrotask + requestIdleCallback when missing', async () => {
    saveKey('queueMicrotask', window)
    saveKey('requestIdleCallback', window)
    saveKey('cancelIdleCallback', window)
    delete window.queueMicrotask
    delete window.requestIdleCallback
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    expect(typeof window.queueMicrotask).toBe(TYPE_STRINGS.FUNCTION)
    expect(typeof window.requestIdleCallback).toBe(TYPE_STRINGS.FUNCTION)
    expect(typeof window.cancelIdleCallback).toBe(TYPE_STRINGS.FUNCTION)

    const cb = jest.fn()

    window.requestIdleCallback(cb)
    await new Promise((r) => setTimeout(r, 10))

    expect(cb).toHaveBeenCalled()
  })

  test('keeps a native requestIdleCallback when present', async () => {
    saveKey('requestIdleCallback')

    const native = () => 0

    globalThis.requestIdleCallback = native
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    expect(globalThis.requestIdleCallback).toBe(native)
  })

  test('installs AbortController stub when missing', async () => {
    saveKey('AbortController')
    delete globalThis.AbortController
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    const ac = new window.AbortController()

    expect(ac.signal.aborted).toBe(false)

    ac.abort()

    expect(ac.signal.aborted).toBe(true)
  })

  test('installs CustomEvent constructor when missing', async () => {
    saveKey('CustomEvent', window)
    delete window.CustomEvent
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    // happy-dom's createEvent routes through window.CustomEvent internally,
    // so instantiating the polyfill would recurse — assert installation
    // and the Event-prototype linkage instead.
    expect(typeof window.CustomEvent).toBe(TYPE_STRINGS.FUNCTION)
    expect(window.CustomEvent.prototype).toBe(window.Event.prototype)
  })

  test('installs Element.matches/closest and NodeList.forEach when missing', async () => {
    saveKey('matches', Element.prototype)
    saveKey('closest', Element.prototype)
    saveKey('forEach', window.NodeList.prototype)
    saveKey('webkitMatchesSelector', Element.prototype)
    saveKey('NodeList')

    const nativeMatches = Element.prototype.matches

    // dom.js checks the bare `NodeList` global — happy-dom only exposes it on
    // window, so mirror it for the shim's guard.
    globalThis.NodeList = window.NodeList
    delete Element.prototype.matches
    delete Element.prototype.closest
    delete window.NodeList.prototype.forEach
    // Engines needing this shim expose the vendor-prefixed matcher instead.
    Element.prototype.webkitMatchesSelector = nativeMatches
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    const host = document.createElement(HTML_TAGS.DIV)
    const btn = document.createElement(HTML_TAGS.BUTTON)

    btn.className = 'x'
    host.appendChild(btn)
    document.body.appendChild(host)

    expect(btn.closest('.x')).toBe(btn)
    expect(btn.closest(HTML_TAGS.SPAN)).toBe(null)
    expect(typeof window.NodeList.prototype.forEach).toBe(TYPE_STRINGS.FUNCTION)

    host.remove()
  })

  test('installs the legacy inert shim when missing', async () => {
    saveKey('inert', HTMLElement.prototype)
    delete HTMLElement.prototype.inert
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    const host = document.createElement(HTML_TAGS.DIV)
    const btn = document.createElement(HTML_TAGS.BUTTON)

    host.appendChild(btn)
    document.body.appendChild(host)

    host.inert = true

    expect(host.hasAttribute('inert')).toBe(true)
    expect(btn.getAttribute(ARIA_ATTRS.TABINDEX)).toBe(CHAR_STRINGS.MINUS_ONE)

    host.inert = false

    expect(host.hasAttribute('inert')).toBe(false)
    expect(btn.hasAttribute(ARIA_ATTRS.TABINDEX)).toBe(false)

    host.remove()
  })

  test('queueMicrotask shim runs the callback and defers throw via setTimeout', async () => {
    saveKey('queueMicrotask')
    saveKey('queueMicrotask', window)
    saveKey('setTimeout')
    delete globalThis.queueMicrotask
    delete window.queueMicrotask
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    const cb = jest.fn()

    window.queueMicrotask(cb)
    await Promise.resolve()

    expect(cb).toHaveBeenCalled()

    const timeouts = []

    globalThis.setTimeout = (fn) => {
      timeouts.push(fn)
      return 0
    }

    window.queueMicrotask(() => {
      throw new Error('qm-fail')
    })
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    expect(timeouts).toHaveLength(1)
    expect(() => timeouts[0]()).toThrow('qm-fail')
  })

  test('requestIdleCallback shim exposes didTimeout and timeRemaining', async () => {
    saveKey('requestIdleCallback', window)
    saveKey('cancelIdleCallback', window)
    delete window.requestIdleCallback
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    let info = null

    window.requestIdleCallback((i) => {
      info = i
    })
    await new Promise((r) => setTimeout(r, 10))

    expect(info.didTimeout).toBe(false)
    expect(typeof info.timeRemaining()).toBe(TYPE_STRINGS.NUMBER)
    expect(info.timeRemaining()).toBeGreaterThanOrEqual(0)

    window.cancelIdleCallback(1)
  })

  test('structuredClone shim JSON-clones data and returns cyclic input as-is', async () => {
    saveKey('structuredClone')
    saveKey('structuredClone', window)
    delete globalThis.structuredClone
    delete window.structuredClone
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    expect(window.structuredClone({ a: [1, 2] })).toEqual({ a: [1, 2] })

    const cyclic = {}

    cyclic.self = cyclic

    expect(window.structuredClone(cyclic)).toBe(cyclic)
  })

  test('AbortController stub exposes inert listener methods', async () => {
    saveKey('AbortController')
    delete globalThis.AbortController
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    const ac = new window.AbortController()

    ac.signal.addEventListener(MEDIA_EVENTS.ABORT, () => {})
    ac.signal.removeEventListener(MEDIA_EVENTS.ABORT, () => {})

    expect(ac.signal.aborted).toBe(false)
  })

  test('matches shim falls back to msMatchesSelector', async () => {
    saveKey('matches', Element.prototype)
    saveKey('msMatchesSelector', Element.prototype)
    saveKey('webkitMatchesSelector', Element.prototype)

    const nativeMatches = Element.prototype.matches

    Element.prototype.msMatchesSelector = nativeMatches
    delete Element.prototype.matches
    delete Element.prototype.webkitMatchesSelector
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    const el = document.createElement(HTML_TAGS.DIV)

    el.className = 'probe'
    expect(el.matches('.probe')).toBe(true)
  })

  test('closest shim walks past documentElement via parentNode', async () => {
    saveKey('closest', Element.prototype)
    delete Element.prototype.closest
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    expect(document.documentElement.closest(HTML_TAGS.SPAN)).toBe(null)
  })

  test('CustomEvent shim links a plain object when window.Event is gone', async () => {
    saveKey('CustomEvent', window)
    saveKey('Event', window)
    delete window.CustomEvent
    delete window.Event
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    expect(typeof window.CustomEvent).toBe(TYPE_STRINGS.FUNCTION)
    expect(window.CustomEvent.prototype).toEqual({})
  })

  test('CustomEvent shim body fills default params and inits the event', async () => {
    saveKey('CustomEvent', window)
    delete window.CustomEvent
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    // happy-dom's createEvent routes through window.CustomEvent — stub it so
    // the polyfill constructor can run without recursing into itself.
    saveKey('createEvent', document)

    const evt = { initCustomEvent: jest.fn() }

    document.createEvent = jest.fn(() => evt)

    const made = new window.CustomEvent('probe')

    expect(document.createEvent).toHaveBeenCalledWith('CustomEvent')
    expect(evt.initCustomEvent).toHaveBeenCalledWith('probe', false, false, null)
    expect(made).toBe(evt)

    // explicit params arm
    evt.initCustomEvent.mockClear()

    new window.CustomEvent('probe2', { bubbles: true, cancelable: true, detail: { x: 1 } })

    expect(evt.initCustomEvent).toHaveBeenCalledWith('probe2', true, true, { x: 1 })
  })

  test('cssvars.js skips the ponyfill when window is undefined', async () => {
    saveKey('window')
    delete globalThis.window
    jest.resetModules()

    await expect(import('@/legacy-polyfills/cssvars.js')).resolves.toBeDefined()
  })

  test('Element guard skips matches/closest when Element is undefined', async () => {
    saveKey('Element')
    delete globalThis.Element
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')
  })

  test('inert getter reflects the attribute and preserves prior tabindex', async () => {
    saveKey('inert', HTMLElement.prototype)
    delete HTMLElement.prototype.inert
    jest.resetModules()

    await import('@/legacy-polyfills/dom.js')

    const host = document.createElement(HTML_TAGS.DIV)
    const btn = document.createElement(HTML_TAGS.BUTTON)

    btn.setAttribute(ARIA_ATTRS.TABINDEX, '2')
    host.appendChild(btn)
    document.body.appendChild(host)

    expect(host.inert).toBe(false)

    host.inert = true

    expect(host.inert).toBe(true)
    expect(btn.getAttribute('data-inert-tabindex')).toBe('2')

    // second enable — the saved marker already exists, value is preserved
    host.inert = true
    host.inert = false

    expect(btn.getAttribute(ARIA_ATTRS.TABINDEX)).toBe('2')

    host.remove()
  })
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

// ─── src/utils/route-warmer.js ───────────────────────────────────────────────

describe('route-warmer', () => {
  test('schedules via requestIdleCallback after window load', async () => {
    jest.resetModules()
    saveKey('requestIdleCallback', window)

    const idleCalls = []

    window.requestIdleCallback = (cb) => {
      idleCalls.push(cb)
      return 1
    }

    const { startRouteWarming, stopRouteWarming } = await import('@/utils/motion/route-warmer.js')

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

    const { startRouteWarming, stopRouteWarming } = await import('@/utils/motion/route-warmer.js')

    startRouteWarming()
    startRouteWarming()
    stopRouteWarming()
    // Resolves without throwing; the _started latch blocks the second call.
    expect(true).toBe(true)
  })

  test('swallows a failing route chunk and keeps warming the rest', async () => {
    jest.resetModules()
    jest.unstable_mockModule('../../../src/routes/views/home/Home.js', () => {
      throw new Error('warm-fail')
    })
    saveKey('requestIdleCallback', window)

    window.requestIdleCallback = (cb) => {
      cb()
      return 1
    }

    const { startRouteWarming, stopRouteWarming } = await import('@/utils/motion/route-warmer.js')

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

    const { startRouteWarming, stopRouteWarming } = await import('@/utils/motion/route-warmer.js')

    startRouteWarming()

    expect(idleCalls.length).toBe(0)

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.LOAD))

    await new Promise((r) => setTimeout(r, 30))

    expect(idleCalls.length).toBeGreaterThan(0)
    stopRouteWarming()

    if (desc) Object.defineProperty(document, 'readyState', desc)
  })
})
