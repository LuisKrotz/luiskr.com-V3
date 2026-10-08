/**
 * @file setup.js
 * @description Jest environment setup — installs the happy-dom window as
 * the global DOM surface, silences console output (zero-console policy:
 * src diagnostics route through devlog; remaining console callers are
 * third-party noise), sets the Firebase log level to silent, and deletes
 * any initialized Firebase app between runs.
 */

import { GlobalWindow } from 'happy-dom'
import { setLogLevel as firebaseSetLogLevel, getApps, deleteApp } from 'firebase/app'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

// Tests run with no Firebase credentials — the SDK's offline/permission_denied
// console.warn chatter is expected, not a failure signal. Silence it so test
// output stays clean.
firebaseSetLogLevel('silent')

// Zero-console test policy: no console output of any kind during test runs.
// Src routes diagnostics through core/devlog.ts (assert via getDevLog());
// remaining console callers are third-party noise (Firebase SDK logger,
// three.js, happy-dom) that carries no assertion signal.
for (const method of ['warn', 'error', 'info', 'log', 'debug', 'trace']) {
  console[method] = () => {}
}

const win = new GlobalWindow({
  url: 'http://localhost:5173',
})

// Specifically attach browser DOM APIs without overriding Node/Jest internals
globalThis.window = win
globalThis.document = win.document
globalThis.customElements = win.customElements
globalThis.HTMLElement = win.HTMLElement
globalThis.Element = win.Element
globalThis.Node = win.Node
globalThis.ShadowRoot = win.ShadowRoot
globalThis.DocumentFragment = win.DocumentFragment
globalThis.CustomEvent = win.CustomEvent
globalThis.Event = win.Event
globalThis.PointerEvent = win.PointerEvent || win.Event
globalThis.MouseEvent = win.MouseEvent || win.Event
globalThis.localStorage = win.localStorage
globalThis.sessionStorage = win.sessionStorage
globalThis.DOMParser = win.DOMParser
globalThis.requestAnimationFrame = (cb) => {
  const t = setTimeout(cb, 16)
  if (t && typeof t.unref === TYPE_STRINGS.FUNCTION) t.unref()
  return t
}
globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
// Unref every timer so component timeouts left pending past teardown
// (menu close, teleport, autoplay) can't hold a jest worker alive — the
// "worker failed to exit gracefully" warning under parallel load. The
// wrapper calls the impl captured at setup time; jest.useFakeTimers()
// replaces globalThis.setTimeout entirely, so fake-timer tests bypass this
// wrapper and are unaffected.
const _realSetTimeout = globalThis.setTimeout
const _realSetInterval = globalThis.setInterval

globalThis.setTimeout = (cb, ms, ...rest) => {
  const t = _realSetTimeout(cb, ms, ...rest)
  if (t && typeof t.unref === TYPE_STRINGS.FUNCTION) t.unref()
  return t
}
globalThis.setInterval = (cb, ms, ...rest) => {
  const t = _realSetInterval(cb, ms, ...rest)
  if (t && typeof t.unref === TYPE_STRINGS.FUNCTION) t.unref()
  return t
}

// Tear down the happy-dom window after each test file — its async-task
// manager owns ref'd Node timers (async fetches, deferred reactions) that
// otherwise keep the jest worker alive after the suite finishes.
afterAll(async () => {
  try {
    // abort() is synchronous and cancels the async-task timers; close() is
    // NOT used — it returns a promise whose rejection escapes this hook and
    // crashes the worker after the suite already passed.
    win.happyDOM?.abort?.()
  } catch {
    // happy-dom teardown is best-effort — must never fail the suite.
  }

  try {
    // Firebase RTDB/auth instances opened during the suite hold ref'd
    // sockets and retry timers — deleteApp tears down every SDK component,
    // which is the difference between a worker exiting and a force-kill.
    await Promise.all(getApps().map((a) => deleteApp(a)))
  } catch {
    // Best-effort — suites that never touched firebase have no apps.
  }
})
// Deterministic idle callbacks — the real rIC can defer arbitrarily under
// parallel-suite CPU load, which made prefetch assertions flaky.
const immediateIdle = (cb) => {
  const t = setTimeout(cb, 0)
  if (t && typeof t.unref === TYPE_STRINGS.FUNCTION) t.unref()
  return t
}
// Note: only assigned on `win`, never globalThis — the dom polyfill shim
// probes bare `requestIdleCallback` (globalThis scope) and must see it
// absent so its install path stays testable.
win.requestIdleCallback = immediateIdle
win.cancelIdleCallback = (id) => clearTimeout(id)
globalThis.Image = win.Image || class Image {}

if (typeof globalThis.TouchEvent === TYPE_STRINGS.UNDEFINED) {
  globalThis.TouchEvent = class TouchEvent extends (win.UIEvent || win.Event) {
    constructor(type, dict = {}) {
      super(type, dict)
      this.touches = dict.touches || []
      this.changedTouches = dict.changedTouches || []
      this.targetTouches = dict.targetTouches || []
    }
  }
  win.TouchEvent = globalThis.TouchEvent
}

if (typeof globalThis.KeyboardEvent === TYPE_STRINGS.UNDEFINED) {
  globalThis.KeyboardEvent = class KeyboardEvent extends (win.UIEvent || win.Event) {
    constructor(type, dict = {}) {
      super(type, dict)
      this.key = dict.key || ''
      this.code = dict.code || ''
      this.keyCode = dict.keyCode || 0
    }
  }
  win.KeyboardEvent = globalThis.KeyboardEvent
}

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
    this.elements = new Set()
  }
  observe(el) {
    this.elements.add(el)
    const t = setTimeout(() => {
      this.callback([{ isIntersecting: true, intersectionRatio: 1.0, target: el }], this)
    }, 10)
    if (t && typeof t.unref === TYPE_STRINGS.FUNCTION) t.unref()
  }
  unobserve(el) {
    this.elements.delete(el)
  }
  disconnect() {
    this.elements.clear()
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver
win.IntersectionObserver = MockIntersectionObserver

const matchMediaMock = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})

globalThis.matchMedia = matchMediaMock
win.matchMedia = matchMediaMock

globalThis.scrollTo = () => {}
win.scrollTo = () => {}

const mockFetch = async (_url) => {
  const res = {
    ok: true,
    status: 200,
    headers: { get: () => null },
    json: async () => ({}),
    text: async () => '',
    blob: async () => new Blob([]),
    arrayBuffer: async () => new ArrayBuffer(0),
  }

  res.clone = () => ({ ...res })

  return res
}

globalThis.fetch = mockFetch
win.fetch = mockFetch

globalThis.getComputedStyle = (...args) => win.getComputedStyle(...args)
