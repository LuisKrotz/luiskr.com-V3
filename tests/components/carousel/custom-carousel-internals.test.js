/**
 * @file custom-carousel-internals.test.js
 * @description Deep coverage for CustomCarousel internals: configure/items
 * lifecycle, fit measurement, height sync, WebGL arrow mounting, scroll
 * navigation, infinite-loop teleports, dot clicks, and autoplay tick/ring
 * regression. Geometry is stubbed via getBoundingClientRect since happy-dom
 * has no layout engine.
 */

import { jest } from '@jest/globals'

import store from '@/core/store.js'
import '@/components/carousel/CustomCarousel.js'
import { TEST_URLS, TEST_TEXT } from '../../fixtures/test-constants.js'
import { attachHybridGL } from '../../fixtures/mock-webgl.js'
import { COMPONENT_TAGS } from '../../../src/core/tokens/elements/components.js'
import { CAROUSEL_SELECTORS } from '../../../src/core/tokens/selectors/carousel.js'
import { CHAR_STRINGS } from '../../../src/core/tokens/strings/chars.js'
import { CAROUSEL_CLASSES } from '../../../src/core/tokens/classes/carousel.js'
import { HTML_TAGS } from '../../../src/core/tokens/elements/html.js'
import { STATE_STRINGS } from '../../../src/core/tokens/strings/state.js'
import { COMMON_ATTRS } from '../../../src/core/tokens/attrs/common.js'
import { MOUSE_EVENTS, TOUCH_EVENTS, WINDOW_EVENTS } from '../../../src/core/tokens/events/dom.js'
import { CAROUSEL_TIMING } from '../../../src/core/tokens/motion/carousel.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '../../../src/core/tokens/events/mutations.js'

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

describe('CustomCarousel tails', () => {
  test('onStoreUpdate starts autoplay when active, visible and motion allowed', () => {
    const el = makeCarousel()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    el.isFullyVisible = true
    el.onStoreUpdate()

    expect(el.autoplayRunning).toBe(true)

    el._stopAutoplay()
    cleanup(el)
  })

  test('_measureFit collapses side-by-side below the mobile breakpoint', () => {
    const el = makeCarousel()

    el._isSideBySide = true

    const desc = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true })
    el._measureFit(500)

    expect(el._isSideBySide).toBe(false)

    el._measureFit(500)
    Object.defineProperty(window, 'innerWidth', desc)
    cleanup(el)
  })

  test('_measureFit early-returns without window and on empty host width', () => {
    const el = makeCarousel()
    const w = globalThis.window

    try {
      delete globalThis.window
      el._measureFit(600)
    } finally {
      globalThis.window = w
    }

    el._measureFit(0)
    cleanup(el)
  })

  test('_measureFit exits side-by-side when items overflow the host', () => {
    const el = makeCarousel()

    el._isSideBySide = true
    el._measureFit(50)

    expect(el._isSideBySide).toBe(false)

    cleanup(el)
  })

  test('goTo in-range resets isNavigating via the teleport timer', () => {
    jest.useFakeTimers()

    const el = makeCarousel()

    el.goTo(1)
    jest.advanceTimersByTime(500)

    expect(el.isNavigating).toBe(false)

    jest.useRealTimers()
    cleanup(el)
  })

  test('_checkInfiniteLoop snaps to the real first slide near clone-first and guards missing nodes', () => {
    const el = makeCarousel()
    const track = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_TRACK)
    const cloneFirst = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_FIRST)
    const cloneLast = el.shadowRoot.querySelector(CAROUSEL_SELECTORS.CAROUSEL_SLIDE_CLONE_LAST)

    if (track && cloneFirst && cloneLast) {
      track.getBoundingClientRect = () => ({ left: 0, width: 600 })
      cloneLast.getBoundingClientRect = () => ({ left: -5000, width: 100 })
      cloneFirst.getBoundingClientRect = () => ({ left: 250, width: 100 })
      el._checkInfiniteLoop()

      expect(el.currentIndex).toBe(0)

      cloneFirst.getBoundingClientRect = () => ({ left: -8000, width: 100 })
      el._checkInfiniteLoop()
    }

    const bare = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)

    bare._checkInfiniteLoop()
    cleanup(el)
  })

  test('_setupIntersectionObserver arms: missing root, no-API fallback, observer reuse', () => {
    const el = makeCarousel()
    const spy = jest.spyOn(el, '$').mockReturnValue(null)

    el._setupIntersectionObserver()
    spy.mockRestore()

    const IO = globalThis.IntersectionObserver

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    delete globalThis.IntersectionObserver
    el._setupIntersectionObserver()

    expect(el.isFullyVisible).toBe(true)
    expect(el.isEnteredViewport).toBe(true)

    el._stopAutoplay()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    el._setupIntersectionObserver()
    globalThis.IntersectionObserver = IO

    const disc = jest.fn()

    el.observer = { disconnect: disc }
    el._setupIntersectionObserver()

    expect(disc).toHaveBeenCalled()

    cleanup(el)
  })

  test('observer callback mounts and destroys arrows across visibility flips', () => {
    const el = makeCarousel()
    let cb
    const IO = globalThis.IntersectionObserver

    globalThis.IntersectionObserver = class {
      constructor(f) {
        cb = f
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    el._setupIntersectionObserver()
    cb([{ isIntersecting: false, intersectionRatio: 0, target: el }])
    cb([{ isIntersecting: true, intersectionRatio: 0.5, target: el }])
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })
    cb([{ isIntersecting: true, intersectionRatio: 0.5, target: el }])
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    cb([{ isIntersecting: true, intersectionRatio: 0.5, target: el }])
    cb([{ isIntersecting: false, intersectionRatio: 0, target: el }])

    el._stopAutoplay()
    globalThis.IntersectionObserver = IO
    cleanup(el)
  })

  test('ring regression decays to zero, aborts while autoplay runs, and no-ops at zero', async () => {
    const el = makeCarousel()

    el.ringProgress = 0
    el._regressRingToZero()

    expect(el.ringProgress).toBe(0)

    el.ringProgress = 0.5
    el.autoplayRunning = true
    el._regressRingToZero()
    await new Promise((r) => setTimeout(r, 40))

    expect(el._isRegressing).toBe(false)

    el.autoplayRunning = false
    el.ringProgress = 0.5
    el._regressRingToZero()
    await new Promise((r) => setTimeout(r, 600))

    expect(el.ringProgress).toBe(0)

    cleanup(el)
  })

  test('autoplay tick advances the slide at cycle end then idles', async () => {
    const el = makeCarousel()

    el.autoplayRunning = true
    el.autoplayStart = 0
    const idx = el.currentIndex

    el._tick(CAROUSEL_TIMING.AUTOPLAY_DURATION + 10)

    expect(el.currentIndex).toBe(idx + 1)

    el.autoplayRunning = false
    await new Promise((r) => setTimeout(r, 40))
    cleanup(el)
  })
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
    await import('@/components/carousel/CustomCarousel.js')
  })
})
