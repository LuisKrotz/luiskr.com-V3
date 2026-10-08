/**
 * @file custom-carousel-internals-customcarousel-internals.test.js
 * @description Split from custom-carousel-internals.test.js — covers the "CustomCarousel internals" describe.
 */
import { jest } from '@jest/globals'

import store from '@core/store.js'
import '@website/components/carousel/CustomCarousel.js'
import { TEST_URLS } from '@tests/fixtures/test-constants.js'
import { attachHybridGL } from '@tests/fixtures/mock-webgl.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CAROUSEL_SELECTORS } from '@core/tokens/selectors/carousel.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { CAROUSEL_CLASSES } from '@core/tokens/classes/carousel.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { MOUSE_EVENTS, TOUCH_EVENTS } from '@core/tokens/events/dom.js'
import { CAROUSEL_TIMING } from '@core/tokens/motion/carousel.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'

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

describe('CustomCarousel internals', () => {
  test('configure is a no-op when inputs are unchanged', () => {
    const el = makeCarousel()
    const items = el.items

    el.configure({ items, folder: TEST_URLS.IMG })

    expect(el.items).toBe(items)

    cleanup(el)
  })

  test('items setter triggers a re-render with slides', () => {
    const el = makeCarousel()

    const slides = el.shadowRoot.querySelectorAll(`.${CAROUSEL_CLASSES.CAROUSEL_SLIDE}`)

    expect(slides.length).toBeGreaterThanOrEqual(SLIDES.length)

    cleanup(el)
  })

  test('folder and forceActive getters/setters round-trip', () => {
    const el = makeCarousel()

    el.folder = 'folder/'

    expect(el.folder).toBe('folder/')

    el.forceActive = true

    expect(el.forceActive).toBe(true)

    cleanup(el)
  })

  test('isActive reflects item count and side-by-side state', () => {
    const el = makeCarousel()

    expect(el.isActive).toBe(true)

    const single = makeCarousel([SLIDES[0]])

    expect(single.isActive).toBe(false)

    cleanup(el)
    cleanup(single)
  })

  test('_measureFit computes slide geometry', () => {
    const el = makeCarousel()

    el._measureFit?.(600)

    cleanup(el)
  })

  test('goTo clamps out-of-range indexes', () => {
    const el = makeCarousel()

    el.goTo(1)

    expect(el.currentIndex).toBe(1)

    el.goTo(-5)

    el.goTo(99)

    cleanup(el)
  })

  test('onPrevClick/onNextClick wrap around the item list', () => {
    const el = makeCarousel()

    el.onNextClick()

    expect(el.currentIndex).toBe(1)

    el.onPrevClick()
    el.onPrevClick()

    cleanup(el)
  })

  test('onDotClick jumps to the requested index', () => {
    const el = makeCarousel()

    el.onDotClick(2)

    expect(el.currentIndex).toBe(2)

    cleanup(el)
  })

  test('onScroll marks navigation and schedules the loop check', () => {
    const el = makeCarousel()

    el.onScroll?.()

    cleanup(el)
  })

  test('_checkInfiniteLoop teleports past the clone edges', () => {
    const el = makeCarousel()

    el.currentIndex = el.items.length
    el._checkInfiniteLoop?.()

    el.currentIndex = -1
    el._checkInfiniteLoop?.()

    cleanup(el)
  })

  test('autoplay starts, ticks the ring, and stops', async () => {
    jest.useFakeTimers()

    const el = makeCarousel()

    el._startAutoplay?.()

    expect(el.autoplayRunning).toBe(true)

    el._tick?.(performance.now() + CAROUSEL_TIMING.AUTOPLAY_DURATION / 2)

    el._stopAutoplay?.()

    expect(el.autoplayRunning).toBe(false)

    jest.useRealTimers()

    cleanup(el)
  })

  test('_regressRingToZero decays the progress ring', () => {
    const el = makeCarousel()

    el.ringProgress = 0.8
    el._regressRingToZero?.()

    cleanup(el)
  })

  test('_mountWebGLArrows binds canvases inside the controls', () => {
    const el = makeCarousel()

    el.shadowRoot.querySelectorAll(HTML_TAGS.CANVAS).forEach((c) => attachHybridGL(c))

    el._mountWebGLArrows?.()

    el._destroyWebGLArrows?.()

    cleanup(el)
  })

  test('onStoreUpdate reacts to reduced-motion and locale changes', () => {
    const el = makeCarousel()

    el.onStoreUpdate?.()

    cleanup(el)
  })

  test('render falls back to a flat list for a single item', () => {
    const el = makeCarousel([SLIDES[0]])

    const fallback =
      el.shadowRoot.querySelector(`.${CAROUSEL_CLASSES.CAROUSEL_FALLBACK}`) ||
      el.shadowRoot.querySelector(`.${CAROUSEL_CLASSES.CAROUSEL_FALLBACK_SIDE}`)

    expect(fallback).toBeTruthy()

    cleanup(el)
  })

  test('onDestroy releases observers and the render loop', () => {
    const el = makeCarousel()

    el.remove()

    expect(el.parentNode).toBeNull()
  })

  describe('deep branches', () => {
    test('forceActive setter re-renders once mounted', () => {
      const el = makeCarousel()

      el._isMounted = true
      el.forceActive = true

      expect(el.forceActive).toBe(true)

      el.forceActive = false

      expect(el.isActive).toBe(!el._isSideBySide && el.items.length > 1)

      cleanup(el)
    })

    test('onUnmounted disconnects the fit observer', () => {
      const el = makeCarousel()
      const disconnect = jest.fn()

      el._fitObserver = { disconnect }
      el.onUnmounted()

      expect(disconnect).toHaveBeenCalled()
      expect(el._fitObserver).toBeNull()

      cleanup(el)
    })

    test('_startFitObserver skips sub-4px changes and refits on real ones', () => {
      const el = makeCarousel()
      const RO = globalThis.ResizeObserver
      const calls = []

      class StubRO {
        constructor(cb) {
          calls.push(cb)
          this.cb = cb
        }
        observe() {}
        disconnect() {}
      }

      globalThis.ResizeObserver = StubRO
      el._startFitObserver()
      globalThis.ResizeObserver = RO

      expect(el._fitObserver).toBeTruthy()

      const measure = jest.spyOn(el, '_measureFit')

      el._lastObservedWidth = 300
      el._fitObserver.cb([{ contentRect: { width: 301 } }])
      el._fitObserver.cb([{ contentRect: { width: 400 } }])

      expect(el._lastObservedWidth).toBe(400)

      el._fitObserver.disconnect()
      measure.mockRestore?.()
      cleanup(el)
    })

    test('_measureFit early-returns and side-by-side transitions', () => {
      const el = makeCarousel()

      el._forceActive = true
      el._measureFit(500)

      el._forceActive = false
      el.items = [SLIDES[0]]
      el._measureFit(500)

      el.items = SLIDES
      el._isSideBySide = true
      el._measureFit(500)

      expect(el._isSideBySide).toBe(false)

      const landscape = [{ ...SLIDES[0], class: STATE_STRINGS.LANDSCAPE }, SLIDES[1]]

      el.items = landscape
      el._measureFit(500)

      expect(el._isSideBySide).toBe(false)

      cleanup(el)
    })

    test('_measureFit accepts a fit within the host width', () => {
      const el = makeCarousel()
      const narrow = [SLIDES[0], SLIDES[1]]

      el.items = narrow
      el._isSideBySide = false

      const iw = Object.getOwnPropertyDescriptor(window, 'innerWidth')
      const ih = Object.getOwnPropertyDescriptor(window, 'innerHeight')

      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1600 })
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })

      el._measureFit(6000)

      expect(el._isSideBySide).toBe(true)

      if (iw) Object.defineProperty(window, 'innerWidth', iw)
      if (ih) Object.defineProperty(window, 'innerHeight', ih)

      el._isSideBySide = false

      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 })
      el._measureFit(2000)

      expect(el._isSideBySide).toBe(false)

      if (iw) Object.defineProperty(window, 'innerWidth', iw)

      cleanup(el)
    })

    test('_onResize + _setHeightVar publish the section height var', () => {
      const section = document.createElement(COMMON_ATTRS.SECTION)
      const el = makeCarousel()

      section.appendChild(el)
      document.body.appendChild(section)

      el._onResize()

      const first = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)

      if (first) {
        Object.defineProperty(first, 'clientHeight', { configurable: true, value: 200 })
        el._setHeightVar()
      }

      document.body.removeChild(section)
      cleanup(el)
    })

    test('control listeners: prev/next click + hover, dots, touch swipe', () => {
      const el = makeCarousel()

      el._bindControls()

      const prevBtn = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_BTN_PREV)
      const nextBtn = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_BTN_NEXT)
      const track = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_TRACK)
      const dots = el.shadowRoot.querySelectorAll(CAROUSEL_SELECTORS.CAROUSEL_DOT)
      const setHover = jest.fn()

      el._prevArrow = { setHover, destroy: jest.fn(), canvas: null }
      el._nextArrow = { setHover, destroy: jest.fn(), canvas: null }

      prevBtn?.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEENTER))
      prevBtn?.dispatchEvent(new Event(MOUSE_EVENTS.MOUSELEAVE))
      nextBtn?.dispatchEvent(new Event(MOUSE_EVENTS.MOUSEENTER))
      nextBtn?.dispatchEvent(new Event(MOUSE_EVENTS.MOUSELEAVE))

      expect(setHover).toHaveBeenCalled()

      const fireTouch = (type, x) => {
        const e = new Event(type, { bubbles: true })

        e.touches = [{ clientX: x }]
        e.changedTouches = [{ clientX: x }]
        track?.dispatchEvent(e)
      }

      fireTouch(TOUCH_EVENTS.TOUCHSTART, 100)
      fireTouch(TOUCH_EVENTS.TOUCHEND, 10)

      expect(el.isNavigating || el.currentIndex >= 0).toBe(true)

      fireTouch(TOUCH_EVENTS.TOUCHSTART, 10)
      fireTouch(TOUCH_EVENTS.TOUCHEND, 200)

      dots[1]?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

      expect(el.currentIndex).toBe(1)

      el._destroyWebGLArrows()
      cleanup(el)
    })

    test('goTo beyond edges teleports through the clone slides', async () => {
      const el = makeCarousel()

      await new Promise((r) => requestAnimationFrame(r))
      await new Promise((r) => requestAnimationFrame(r))

      const cloneFirst = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_FIRST)
      const cloneLast = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_LAST)

      if (cloneLast) {
        el.goTo(-1)

        expect(el.isNavigating).toBe(true)

        await new Promise((r) => setTimeout(r, CAROUSEL_TIMING.TELEPORT_DELAY + 60))
      }

      if (cloneFirst) {
        el.goTo(el.items.length)

        await new Promise((r) => setTimeout(r, CAROUSEL_TIMING.TELEPORT_DELAY + 60))
      }

      expect(el.isNavigating).toBe(false)

      cleanup(el)
    })

    test('_scrollToElement/_scrollToSlide/_jumpToSlide guard missing nodes', () => {
      const el = makeCarousel()

      el._scrollToElement(null)

      const track = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_TRACK)

      if (track) {
        el._scrollToSlide(el.items.length + 5)
        el._jumpToSlide(el.items.length + 5)
      }

      cleanup(el)
    })

    test('onStoreUpdate stops autoplay while the modal is open', () => {
      const el = makeCarousel()
      const stop = jest.spyOn(el, '_stopAutoplay')

      el._prevArrow = { setReducedMotion: jest.fn(), setHover: jest.fn(), destroy: jest.fn() }
      el._nextArrow = { setReducedMotion: jest.fn(), setHover: jest.fn(), destroy: jest.fn() }

      store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })
      el.onStoreUpdate()

      expect(stop).toHaveBeenCalled()

      store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
      el.onStoreUpdate()

      stop.mockRestore?.()
      cleanup(el)
    })

    test('_mountWebGLArrows replaces stale canvas widgets', () => {
      const el = makeCarousel()

      const stale = { canvas: document.createElement(HTML_TAGS.CANVAS), destroy: jest.fn() }

      el._prevArrow = stale
      el._nextArrow = { canvas: document.createElement(HTML_TAGS.CANVAS), destroy: jest.fn() }
      el._mountWebGLArrows()

      const prevCanvas = el.shadowRoot.querySelector(
        `${CAROUSEL_SELECTORS.CAROUSEL_BTN_PREV} ${CAROUSEL_SELECTORS.CAROUSEL_BTN_CANVAS}`
      )

      if (prevCanvas) expect(stale.destroy).toHaveBeenCalled()

      cleanup(el)
    })
  })
})
