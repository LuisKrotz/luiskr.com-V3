/**
 * @file custom-carousel-internals-customcarousel-tails-2.test.js
 * @description Split from custom-carousel-internals.test.js — covers the "CustomCarousel tails 2" describe.
 */
import { jest } from '@jest/globals'

import '@website/components/carousel/CustomCarousel.js'
import { TEST_URLS, TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CAROUSEL_SELECTORS } from '@core/tokens/selectors/carousel.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MOUSE_EVENTS, TOUCH_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'

const SLIDES = [
  { src: 'a.webp', size: [800, 450], label: 'One', canExpand: true },
  { src: 'b.webp', size: [800, 450], label: 'Two', isVideo: true },
  { src: 'c.webp', label: 'Three' },
]

const rect = (w = 300, h = 200) => ({ left: 0, top: 0, width: w, height: h, right: w, bottom: h })

const makeCarousel = (slides = SLIDES) => {
  const el = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)

  document.body.appendChild(el)

  el.configure({ items: slides, folder: TEST_URLS.IMG })

  // happy-dom has no layout — provide geometry for measure/scroll paths
  el.getBoundingClientRect = () => rect(600, 400)

  const track = el.shadowRoot?.querySelector(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

  if (track) {
    track.getBoundingClientRect = () => rect(600, 400)
    track.querySelectorAll('*').forEach((c) => {
      c.getBoundingClientRect = () => rect(600, 400)
    })
    track.shadowRoot?.querySelectorAll('*').forEach?.((_c) => {})
  }

  return el
}

const cleanup = (el) => {
  el?.remove()
}

afterEach(() => {
  document.body.innerHTML = CHAR_STRINGS.EMPTY
})

describe('CustomCarousel tails 2', () => {
  test('setters and configure: non-array items, missing folder, flag mismatches', () => {
    const bare = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)

    bare.items = CHAR_STRINGS.EMPTY
    expect(bare.items).toEqual([])
    bare.folder = CHAR_STRINGS.EMPTY
    expect(bare.forceActive).toBe(false)

    const el = makeCarousel(SLIDES.slice(0, 2))

    el.configure({ items: el.items })
    el.configure({ items: el.items, folder: TEST_URLS.B })

    cleanup(el)
  })

  test('fit observer skips empty entries, small deltas and refits on real ones', async () => {
    const el = makeCarousel()
    let cb
    const RO = globalThis.ResizeObserver

    globalThis.ResizeObserver = class {
      constructor(f) {
        cb = f
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    el._startFitObserver()
    cb([])
    cb([{}])
    cb([{ contentRect: { width: 333 } }])
    await new Promise((r) => setTimeout(r, 40))
    cb([{ contentRect: { width: 334 } }])
    cb([{ contentRect: { width: 500 } }])
    await new Promise((r) => setTimeout(r, 40))

    globalThis.ResizeObserver = RO

    el._fitObserver = null
    el.onUnmounted()
    const disc = jest.fn()

    el._fitObserver = { disconnect: disc }
    el.onUnmounted()

    expect(disc).toHaveBeenCalled()

    cleanup(el)
  })

  test('_measureFit: mobile breakpoint, window-less fallback, sparse size dims', () => {
    const el = makeCarousel([{ size: [] }, { size: [800] }])
    const desc = Object.getOwnPropertyDescriptor(window, 'innerWidth')

    el._isSideBySide = true
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true })
    el._measureFit(500)

    expect(el._isSideBySide).toBe(false)

    Object.defineProperty(window, 'innerWidth', desc)

    const w = globalThis.window

    try {
      Object.defineProperty(globalThis, 'window', { value: undefined, configurable: true })
      document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)
      el._measureFit(600)
      el._onResize()
    } finally {
      Object.defineProperty(globalThis, 'window', { value: w, configurable: true })
    }

    el._measureFit(50)
    el._isSideBySide = true
    el._measureFit(50)

    expect(el._isSideBySide).toBe(false)

    cleanup(el)
  })

  test('_bindControls else-arms when controls are missing', () => {
    const el = makeCarousel()
    const spy = jest.spyOn(el, '$').mockReturnValue(null)

    el._bindControls()
    spy.mockRestore()
    cleanup(el)
  })

  test('control listeners: arrows, hover, track scroll, swipe and resize', () => {
    const el = makeCarousel()

    el._bindControls()

    const prevBtn = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_BTN_PREV)
    const nextBtn = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_BTN_NEXT)
    const track = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

    el._prevArrow = null
    el._nextArrow = null
    prevBtn.dispatchEvent(new Event(MOUSE_EVENTS.CLICK))
    nextBtn.dispatchEvent(new Event(MOUSE_EVENTS.CLICK))
    prevBtn.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEENTER))
    prevBtn.dispatchEvent(new Event(MOUSE_EVENTS.MOUSELEAVE))
    nextBtn.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEENTER))
    nextBtn.dispatchEvent(new Event(MOUSE_EVENTS.MOUSELEAVE))
    track.dispatchEvent(new Event(WINDOW_EVENTS.SCROLL))
    window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))

    const ts = new Event(TOUCH_EVENTS.TOUCHSTART)

    ts.touches = [{ clientX: 200 }]
    track.dispatchEvent(ts)

    const te = new Event(TOUCH_EVENTS.TOUCHEND)

    te.changedTouches = [{ clientX: 195 }]
    track.dispatchEvent(te)

    const ts2 = new Event(TOUCH_EVENTS.TOUCHSTART)

    ts2.touches = [{ clientX: 200 }]
    track.dispatchEvent(ts2)

    const te2 = new Event(TOUCH_EVENTS.TOUCHEND)

    te2.changedTouches = [{ clientX: 100 }]
    track.dispatchEvent(te2)

    const te3 = new Event(TOUCH_EVENTS.TOUCHEND)

    te3.changedTouches = [{ clientX: 300 }]
    track.dispatchEvent(te3)

    el._mountWebGLArrows()
    el._prevArrow?.onAction?.()
    el._nextArrow?.onAction?.()

    cleanup(el)
  })

  test('_mountWebGLArrows guards: window-less return and missing canvases', () => {
    const el = makeCarousel()
    const w = globalThis.window

    try {
      Object.defineProperty(globalThis, 'window', { value: undefined, configurable: true })
      el._mountWebGLArrows()
    } finally {
      Object.defineProperty(globalThis, 'window', { value: w, configurable: true })
    }

    const spy = jest.spyOn(el, '$').mockReturnValue(null)

    el._prevArrow = null
    el._nextArrow = null
    el._mountWebGLArrows()
    spy.mockRestore()

    el._prevArrow = null
    el._nextArrow = null
    el._destroyWebGLArrows()

    cleanup(el)
  })

  test('_setHeightVar: missing sizes, clientHeight stub and window-less fallbacks', () => {
    const el = makeCarousel([{ label: TEST_TEXT.HELLO }, { label: TEST_TEXT.WORLD }])

    el._setHeightVar()

    const slide = el.shadowRoot.querySelector(`${CAROUSEL_SELECTORS.CAROUSEL_TRACK} > *`)

    if (slide) Object.defineProperty(slide, 'clientHeight', { value: 300, configurable: true })
    el._setHeightVar()

    el.items = [
      { size: [800, 600], label: TEST_TEXT.HELLO },
      { size: [400, 300], label: TEST_TEXT.WORLD },
    ]
    el._setHeightVar()

    const w = globalThis.window

    try {
      Object.defineProperty(globalThis, 'window', { value: undefined, configurable: true })
      el._setHeightVar()
    } finally {
      Object.defineProperty(globalThis, 'window', { value: w, configurable: true })
    }

    cleanup(el)
  })

  test('isNavigating guards, mark-adjacent edges, counter and figure arms', () => {
    const el = makeCarousel()

    el.isNavigating = true
    el.onScroll()
    el._checkInfiniteLoop()
    el.isNavigating = false

    el.items = []
    el.goTo(0)
    el._markAdjacentLoaded(0)

    el.items = [{}, {}, {}, {}, {}, {}]
    el._markAdjacentLoaded(0)
    el._markAdjacentLoaded(5)

    const spy = jest.spyOn(el, '$').mockReturnValue(null)

    el._updateActiveClasses()
    spy.mockRestore()

    const $$spy = jest.spyOn(el, '$$').mockReturnValue([document.createElement(HTML_TAGS.DIV)])

    el.goTo(0)
    const fig = document.createElement(HTML_TAGS.DIV)
    const inner = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    inner.loadHighRes = jest.fn()
    fig.appendChild(inner)
    $$spy.mockReturnValue([fig])
    el.goTo(0)
    expect(inner.loadHighRes).toHaveBeenCalled()
    $$spy.mockRestore()

    cleanup(el)
  })

  test('scroll offsets: null rect retry, smooth jump and renderSlide fallbacks', async () => {
    const el = makeCarousel()
    const track = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_TRACK)
    const slide = track?.children[1]

    if (slide) {
      slide.getBoundingClientRect = () => ({ width: 0, left: 0 })
      el._jumpToSlide(0)
      el._scrollToSlide(0)
      el._scrollToElement(slide)
      slide.getBoundingClientRect = () => ({ width: 100, left: 50 })
      el._jumpToSlide(0, true)
      el._scrollToSlide(0)
    }

    el.renderSlide(null)
    el.folder = CHAR_STRINGS.EMPTY
    const node = el.renderSlide({ src: TEST_URLS.IMG })

    expect(node).toBeTruthy()

    el.isEnteredViewport = true
    el._updateDom()

    await new Promise((r) => setTimeout(r, 40))
    cleanup(el)
  })

  test('customElements re-evaluation skips re-registration', async () => {
    expect(customElements.get(COMPONENT_TAGS.CUSTOM_CAROUSEL)).toBeTruthy()
    jest.resetModules()
    await import('@website/components/carousel/CustomCarousel.js')
  })
})
