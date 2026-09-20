import { GlobalWindow } from 'happy-dom'

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
  if (t && typeof t.unref === 'function') t.unref()
  return t
}
globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
globalThis.Image = win.Image || class Image {}

if (typeof globalThis.TouchEvent === 'undefined') {
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

if (typeof globalThis.KeyboardEvent === 'undefined') {
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
    if (t && typeof t.unref === 'function') t.unref()
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

const mockFetch = async (url) => ({
  ok: true,
  status: 200,
  json: async () => ({}),
  text: async () => '',
  arrayBuffer: async () => new ArrayBuffer(0),
})

globalThis.fetch = mockFetch
win.fetch = mockFetch

